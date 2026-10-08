# Malabar Crown Exports website

A responsive, single-page site for a Kozhikode pepper and spice exporter. The brand name, contact details, customer reach, and company metrics are sample content; replace them with verified company information before publishing.

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env` and set `ADMIN_PASSWORD` to a long, unique value.
3. Run `node server.js` from this folder and open `http://localhost:3000`.
4. For local email delivery, set `BREVO_API_KEY`, `BREVO_ADMIN_EMAIL` and (if different) `BREVO_SENDER_EMAIL` in `.env`. The local server also supports the Admin setup panel, which saves credentials in the ignored `data/email-settings.json` file.

Contact form delivery uses Brevo's transactional email API. The server uses the admin address as the sender, so configure/verify that sender in Brevo first. Set `replyTo` to the visitor's email so replies go to the person who sent the enquiry. The API key is handled and stored server-side; the browser does not persist it. Use HTTPS and protect `.env` and the `data/` folder in production. The Admin setup endpoint requires the server-side `ADMIN_PASSWORD`.

## Deploy to Vercel from GitHub

1. Push this project to a GitHub repository and import that repository in Vercel.
2. In Vercel project settings, add these Environment Variables for Production (and Preview if you want email to work in preview deployments):
   - `BREVO_API_KEY` — your private Brevo transactional API key.
   - `BREVO_ADMIN_EMAIL` — inbox that should receive enquiries.
   - `BREVO_SENDER_EMAIL` — an email address verified as a sender in Brevo. It can match the admin inbox.
3. Deploy. Vercel serves the site files and runs `api/contact.js` as a serverless function.

For Vercel, add or rotate secrets in Vercel Project Settings and redeploy. The Admin setup form is intended for the local Node server; Vercel's serverless filesystem is temporary, so a key submitted through that form would not be durable. Keep the Brevo key in Vercel Environment Variables, never in `app.js`, `index.html`, or any public client-side setting. The local `server.js` remains available for local development.

The photos load from Unsplash and Google Fonts load from Google Fonts, so those services need to be reachable for the matching image and type treatments.
