// Local development server only. In production the site is deployed on Vercel,
// which serves the static files and runs api/contact.js as a serverless function.
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import contactHandler from './api/contact.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5175;

app.use(express.json({ limit: '32kb' }));

// Serve the static site (index.html, styles.css, script.js, images/)
app.use(express.static(__dirname, { extensions: ['html'] }));

app.all('/api/contact', contactHandler);

app.listen(PORT, () => {
  console.log(`WoodsMan site running at http://localhost:${PORT}`);
});
