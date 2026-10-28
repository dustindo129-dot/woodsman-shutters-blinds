# WoodsMan Shutters and Blinds — Website

A marketing website for WoodsMan Shutters and Blinds (Garland, TX) with a
working contact form powered by [Resend](https://resend.com). The front end is
plain HTML/CSS/JS; a small Express server serves the site and handles form
submissions.

## Structure

```
woodsman-site/
├── index.html      # All page sections (hero, products, shutters, gallery, reviews, contact)
├── styles.css      # Brand theme (navy + red, from the real logo), responsive layout
├── script.js       # Mobile nav, gallery lightbox, scroll reveal, contact-form fetch
├── server.js       # Express static server + POST /api/contact (Resend)
├── package.json
├── .env            # Resend keys (gitignored) — copy from .env.example
├── .env.example
└── images/         # Real photos + logo pulled from the live WoodsMan site
```

## Real assets

The logo and all photography were downloaded from the live WoodsMan site and
live in `images/` (hero, product cards, shutters feature, and 7 gallery photos).
The color palette (navy `#16243d` + red `#c0303a`) is taken from the real logo.

## Run it

```bash
npm install
npm start
# open http://localhost:5175
```

## Contact form / Resend

The form posts JSON to `POST /api/contact`. The server validates the input and
sends an email via Resend. Configure it in `.env` (see `.env.example`):

- `RESEND_API_KEY` — your Resend API key.
- `CONTACT_TO` — where inquiries are delivered (default: the WoodsMan Gmail).
- `RESEND_FROM` — the sender. For production, verify the WoodsMan domain in
  Resend and use e.g. `WoodsMan Website <website@woodsmanshuttersandblinds.com>`.
  `onboarding@resend.dev` works for testing.
- `PORT` — server port (default `5175`).

> Note: `.env` currently reuses the same Resend key as the `authentic-blinds`
> project. Swap in a dedicated WoodsMan key + verified domain before going live.

## SEO

Mirrors the setup used in the `authentic-blinds` project, adapted for a static site:

- **Rich meta** in `index.html` — descriptive title, description, keywords, canonical, `robots`, and local-SEO geo tags.
- **Open Graph + Twitter** cards (uses `images/hero.jpg` as the share image).
- **JSON-LD structured data** — `LocalBusiness` / `HomeAndConstructionBusiness`
  (address, geo, hours, areaServed, aggregateRating) + `WebSite`.
- **`robots.txt`** — allows all crawlers and AI search bots, points to the sitemap.
- **`sitemap.xml`** — the homepage.
- **Favicon / apple-touch-icon** — the WoodsMan logo.

> Before launch: set the real domain everywhere (search `woodsmanshuttersandblinds.com`),
> and add your own **Google Search Console** and **Bing Webmaster** verification tokens
> (placeholder `<meta>` tags are in `index.html` `<head>`).

## Customization

- **Colors & fonts:** CSS variables at the top of `styles.css` (`:root`).
- **Images:** replace files in `images/` (keep the same names, or update the
  `background-image` / `src` references in `index.html`).
- **Business info:** address, phone, and email live in the Contact section and
  footer of `index.html`.
