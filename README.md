# Malabar Crown Exports website

A responsive, single-page site for a Kozhikode pepper and spice exporter. The brand name, contact details, customer reach, and company metrics are sample content; replace them with verified company information before publishing.

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env` and set `ADMIN_PASSWORD` to a long, unique value.
3. Run `node server.js` from this folder and open `http://localhost:3000`.
4. For local email delivery, set `BREVO_API_KEY`, `BREVO_ADMIN_EMAIL` and (if different) `BREVO_SENDER_EMAIL` in `.env`. The local server also supports the Admin setup panel, which saves credentials in the ignored `data/email-settings.json` file.

Contact form delivery uses Brevo's transactional email API. The server uses the admin address as the sender, so configure/verify that sender in Brevo first. Set `replyTo` to the visitor's email so replies go to the person who sent the enquiry. The API key is handled and stored server-side; the browser does not persist it. Use HTTPS and protect `.env` and the `data/` folder in production. The Admin setup endpoint requires the server-side `ADMIN_PASSWORD`.

