# latlong.tsvit.io

Swedish geographic coordinate converter. Converts positions between:

- **SWEREF 99 / WGS 84** — Decimal degrees (DD), Degree/minute (DM), Degree/minute/second (DMS)
- **RT 90** — 6 projection variants
- **SWEREF 99 TM** — 13 projection variants

Interactive map with click-to-convert. Share positions via link, text message, or email.

## Quick start with Docker

```bash
docker compose up
```

Opens at `http://localhost:3947`. That's it!

To rebuild after changes:

```bash
docker compose up --build
```

## Prerequisites (without Docker)

- [Node.js](https://nodejs.org/) 18 or later

## Install

```bash
git clone https://github.com/Lerold/latlong_mellifica_se.git
cd latlong_mellifica_se
npm install
```

## Development

Start the dev server with hot reload:

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents of `dist/` to any static web host (Nginx, Apache, Netlify, Vercel, GitHub Pages, etc.).

Preview the production build locally:

```bash
npm run preview
```

## Project structure

```
index.html              Vite entry point / main HTML
src/
  main.js               App initialization, event binding, URL params
  map.js                Leaflet map setup and interaction
  share.js              Share position (Web Share API / clipboard)
  styles.css            Responsive stylesheet
  geodesy/
    gauss-kruger.js     Gauss Conformal Projection (Transverse Mercator)
    lat-lon.js          DD/DM/DMS coordinate parsing and formatting
```

## Original code

The original pre-2.0 static site is preserved under `latlong.mellifica.se/public_html/` for reference.

## License

MIT — Jonathan B.

Geodetic formulas and parameters from [Lantmäteriet](https://www.lantmateriet.se/geodesi).
