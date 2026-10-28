import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Resend } from 'resend';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5175;

app.use(express.json({ limit: '32kb' }));

// Serve the static site (index.html, styles.css, script.js, images/)
app.use(express.static(__dirname, { extensions: ['html'] }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

app.post('/api/contact', async (req, res) => {
  const body = req.body || {};

  const name    = (body.name    || '').toString().trim();
  const email   = (body.email   || '').toString().trim();
  const phone   = (body.phone   || '').toString().trim();
  const service = (body.service || '').toString().trim();
  const message = (body.message || '').toString().trim();

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and a valid email are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: 'Message is too long.' });
  }

  const { RESEND_API_KEY, CONTACT_TO, RESEND_FROM } = process.env;

  if (!RESEND_API_KEY) {
    console.error('Contact form: RESEND_API_KEY is not set.');
    return res.status(503).json({
      error: 'The contact form is temporarily unavailable. Please call (214) 413-9115.',
    });
  }

  const resend = new Resend(RESEND_API_KEY);
  const to   = CONTACT_TO  || 'woodsmanshuttersandblindsllc@gmail.com';
  const from = RESEND_FROM || 'WoodsMan Website <onboarding@resend.dev>';

  const html = `
    <h2>New website inquiry — WoodsMan Shutters &amp; Blinds</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone) || '—'}</p>
    <p><strong>Interested in:</strong> ${escapeHtml(service) || '—'}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br/>') || '—'}</p>
  `;

  const text = `New website inquiry — WoodsMan Shutters & Blinds\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nInterested in: ${service || '-'}\n\nMessage:\n${message || '-'}`;

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html,
      text,
    });
  } catch (err) {
    console.error('Contact form: Resend error', err);
    return res.status(502).json({
      error: 'We could not send your message. Please try again or call (214) 413-9115.',
    });
  }

  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`WoodsMan site running at http://localhost:${PORT}`);
});
