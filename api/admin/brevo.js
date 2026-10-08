module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') res.setHeader('Allow', 'POST');
  return res.status(410).json({ error: 'On Vercel, add BREVO_API_KEY, BREVO_ADMIN_EMAIL and BREVO_SENDER_EMAIL in Project Settings → Environment Variables, then redeploy. Secret keys cannot be saved through this page on Vercel.' });
};
