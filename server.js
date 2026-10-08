const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const SECRET_FILE = path.join(ROOT, 'data', 'email-settings.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

function readSettings() {
  try { return JSON.parse(fs.readFileSync(SECRET_FILE, 'utf8')); } catch { return {}; }
}
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''; req.on('data', chunk => { body += chunk; if (body.length > 30_000) reject(new Error('Request too large')); });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid request')); } });
    req.on('error', reject);
  });
}
function getConfig() {
  const saved = readSettings();
  return { apiKey: process.env.BREVO_API_KEY || saved.apiKey, adminEmail: process.env.BREVO_ADMIN_EMAIL || saved.adminEmail };
}
async function sendBrevoEmail(payload, config) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'accept': 'application/json', 'api-key': config.apiKey, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const message = await response.text();
    console.error('Brevo rejected email:', response.status, message.slice(0, 500));
    throw new Error('Email delivery failed. Please try again or email us directly.');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'POST' && url.pathname === '/api/contact') {
    try {
      const form = await readBody(req);
      const { name, email, company, country, product, message } = form;
      if (![name, email, country, product, message].every(value => typeof value === 'string' && value.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'Please complete the required fields with a valid email.' });
      const config = getConfig();
      if (!config.apiKey || !config.adminEmail) return send(res, 503, { error: 'Email delivery is not configured yet. Please email exports@malabarcrown.example.' });
      const safe = value => String(value || '').trim().slice(0, 4000).replace(/[<>]/g, '');
      const htmlContent = `<h2>Website enquiry</h2><p><b>Name:</b> ${safe(name)}</p><p><b>Email:</b> ${safe(email)}</p><p><b>Company:</b> ${safe(company) || 'Not provided'}</p><p><b>Country:</b> ${safe(country)}</p><p><b>Product:</b> ${safe(product)}</p><p><b>Message:</b><br>${safe(message).replace(/\n/g, '<br>')}</p>`;
      await sendBrevoEmail({ sender: { name: 'Malabar Crown Website', email: config.adminEmail }, to: [{ email: config.adminEmail }], replyTo: { name: safe(name), email: safe(email) }, subject: `Website enquiry: ${safe(product)}`, htmlContent }, config);
      return send(res, 200, { ok: true });
    } catch (error) { console.error('Contact request failed:', error.message); return send(res, 500, { error: 'We could not send that enquiry. Please try again later.' }); }
  }
  if (req.method === 'POST' && url.pathname === '/api/admin/brevo') {
    try {
      const input = await readBody(req);
      const expectedPassword = process.env.ADMIN_PASSWORD;
      if (!expectedPassword) return send(res, 503, { error: 'Set ADMIN_PASSWORD in the server .env file before using admin setup.' });
      if (typeof input.password !== 'string' || input.password.length < 1 || input.password !== expectedPassword) return send(res, 401, { error: 'Administrator password is incorrect.' });
      if (typeof input.apiKey !== 'string' || !input.apiKey.startsWith('xkeysib-') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.adminEmail || '')) return send(res, 400, { error: 'Enter a valid Brevo API key and admin email.' });
      const dataDir = path.dirname(SECRET_FILE);
      fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(SECRET_FILE, JSON.stringify({ apiKey: input.apiKey, adminEmail: input.adminEmail.trim() }, null, 2), { mode: 0o600 });
      return send(res, 200, { ok: true });
    } catch (error) { console.error('Settings save failed:', error.message); return send(res, 500, { error: 'Unable to save email settings.' }); }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
  const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const file = path.resolve(ROOT, `.${requested}`);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) return send(res, 403, { error: 'Forbidden.' });
  fs.readFile(file, (error, contents) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') return res.end();
    res.end(contents);
  });
});
server.listen(PORT, () => console.log(`Malabar Crown website available at http://localhost:${PORT}`));
