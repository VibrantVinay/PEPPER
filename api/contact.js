function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}

function clean(value, max = 4000) {
  return String(value || '').trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const { name, email, company, country, product, message } = req.body || {};
  if (![name, email, country, product, message].every(value => typeof value === 'string' && value.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) {
    return json(res, 400, { error: 'Please complete the required fields with a valid email.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const adminEmail = process.env.BREVO_ADMIN_EMAIL;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || adminEmail;
  if (!apiKey || !adminEmail || !senderEmail) {
    return json(res, 503, { error: 'Email delivery is not configured yet. Please email exports@malabarcrown.example.' });
  }

  const safeName = clean(name, 200);
  const safeEmail = clean(email, 320);
  const safeCountry = clean(country, 200);
  const safeProduct = clean(product, 200);
  const safeCompany = clean(company, 300) || 'Not provided';
  const safeMessage = clean(message, 4000);
  const htmlContent = `<h2>Website enquiry</h2><p><b>Name:</b> ${escapeHtml(safeName)}</p><p><b>Email:</b> ${escapeHtml(safeEmail)}</p><p><b>Company:</b> ${escapeHtml(safeCompany)}</p><p><b>Country:</b> ${escapeHtml(safeCountry)}</p><p><b>Product:</b> ${escapeHtml(safeProduct)}</p><p><b>Message:</b><br>${escapeHtml(safeMessage).replace(/\n/g, '<br>')}</p>`;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: { name: 'Malabar Crown Website', email: senderEmail },
        to: [{ email: adminEmail }],
        replyTo: { name: safeName, email: safeEmail },
        subject: `Website enquiry: ${safeProduct}`,
        htmlContent
      })
    });
    if (!response.ok) {
      console.error('Brevo rejected email:', response.status, (await response.text()).slice(0, 500));
      return json(res, 502, { error: 'Email delivery failed. Please try again or email us directly.' });
    }
    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Brevo request failed:', error.message);
    return json(res, 502, { error: 'We could not send that enquiry. Please try again later.' });
  }
};
