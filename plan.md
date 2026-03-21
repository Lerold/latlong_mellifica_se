# Website Upgrade & Modernisation Plan: latlong.mellifica.se

## Current State Summary

A Swedish geographic coordinate converter (DD/DM/DMS, RT90, SWEREF 99) built as a static single-page app. Core codebase is ~1,200 lines of vanilla ES5 JavaScript across 5 files, with an embedded OpenLayers 2.x map. Last meaningful update was 2019; uses technologies from the 2009-2013 era.

**Key problems**: not mobile-friendly (fixed 500px width), deprecated OpenLayers 2.x, broken Google Maps (placeholder API key), deprecated Google Analytics, ISO-8859-1 encoding, no build tooling, no accessibility support.

---

## Phase 1: Foundation & Encoding (Low risk)

### 1.1 Switch to UTF-8 encoding
- Change `<meta charset>` from ISO-8859-1 to UTF-8
- Re-save all files as UTF-8
- Verify Swedish characters (å, ä, ö) render correctly

### 1.2 Add proper HTML `<head>` metadata
- Add `<meta name="viewport">` for responsive support
- Add `<meta name="description">` for SEO
- Add `lang="sv"` to `<html>` element
- Add Open Graph tags for link sharing

### 1.3 Introduce semantic HTML
- Replace generic `<div>` layout with `<header>`, `<main>`, `<section>`, `<footer>`
- Associate `<label>` elements with form inputs
- Add `alt` attributes to images

---

## Phase 2: Responsive Design & CSS (Medium risk)

### 2.1 Extract inline CSS to external stylesheet
- Create `styles.css` with all current inline styles
- Remove inline `<style>` block from `index.html`

### 2.2 Make layout responsive
- Replace fixed 500px container with fluid/responsive layout
- Use CSS Grid or Flexbox for the coordinate input sections
- Add media queries for mobile (< 768px), tablet, desktop breakpoints
- Stack the three coordinate system panels vertically on mobile
- Make the map container responsive (full-width, flexible height)

### 2.3 Modernise visual design
- Apply a clean, modern colour scheme (keep it minimal/functional)
- Improve typography with system font stack or a web font
- Style form inputs and buttons consistently
- Add visual grouping/cards for each coordinate system section
- Improve the info/help toggle sections

---

## Phase 3: JavaScript Modernisation (Medium risk)

### 3.1 Introduce build tooling
- Add `package.json` with Vite as the build tool (lightweight, fast)
- Set up dev server with hot reload
- Configure production build with minification

### 3.2 Modernise JavaScript
- Convert ES5 to modern ES6+ (const/let, arrow functions, template literals, modules)
- Split code into ES modules:
  - `main.js` — app initialization and URL parameter handling
  - `converters.js` — coordinate conversion logic (from `latlong.js`)
  - `map.js` — map setup and interaction
  - `geodesy/gauss-kruger.js` — projection math (from `gausskruger.js`)
  - `geodesy/lat-lon.js` — DD/DM/DMS parsing (from `lat_lon_conv.js`)
- Remove global variable dependencies; use module imports/exports
- Add input validation and error handling for coordinate fields

### 3.3 Replace deprecated Google Analytics
- Remove old `_gaq` tracking code
- Option A: Add modern Google Analytics 4 (gtag.js)
- Option B: Use a privacy-friendly alternative (Plausible, Umami) or remove analytics entirely

---

## Phase 4: Map Library Upgrade (High risk — core functionality)

### 4.1 Replace OpenLayers 2.x with Leaflet or OpenLayers 9.x
- **Recommended: Leaflet** — smaller (~40KB vs 770KB), simpler API, excellent mobile support, active community
- Alternative: OpenLayers 9.x if advanced projection/GIS features are needed

### 4.2 Rewrite map integration
- Install via npm (`leaflet`)
- Recreate map layers:
  - OpenStreetMap (default)
  - Satellite imagery (consider switching from Google to free alternatives like Esri or MapTiler)
- Re-implement click-to-get-coordinates
- Re-implement marker placement
- Re-implement RT90/SWEREF99 zone overlays (if keeping this feature)
- Ensure map is responsive and touch-friendly

### 4.3 Remove Google Maps dependency (optional)
- Google Maps API requires a billing-enabled API key
- Replace with free tile providers (OpenStreetMap, Esri World Imagery, Stadia Maps)
- This eliminates the broken API key issue entirely

---

## Phase 5: Accessibility & Polish (Low risk)

### 5.1 Accessibility (WCAG 2.1 AA)
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works for all controls
- Verify colour contrast ratios meet AA standards
- Add focus indicators on form fields
- Make info/help sections accessible (use `<details>`/`<summary>` or proper ARIA)

### 5.2 Performance
- Lazy-load the map (defer until visible or user interaction)
- Add `async`/`defer` to script tags
- Optimise marker images (convert to SVG or use CSS)
- Add proper cache headers guidance (via `.htaccess` or hosting config)

### 5.3 Progressive enhancement
- Ensure coordinate conversion works without JavaScript map loaded
- Add a `<noscript>` fallback message
- Add URL sharing (update URL as coordinates change for easy bookmarking)

---

## Phase 6: Developer Experience & Deployment (Low risk)

### 6.1 Development setup
- Add `.gitignore` for `node_modules/`, `dist/`
- Add a `README.md` with setup instructions
- Add ESLint for code quality

### 6.2 Deployment
- Configure Vite build output to `dist/`
- Add npm scripts: `dev`, `build`, `preview`
- Site can then be deployed to any static host (Netlify, Vercel, GitHub Pages, existing server)

---

## Implementation Order & Risk Assessment

| Phase | Effort | Risk | Can deploy independently? |
|-------|--------|------|--------------------------|
| 1. Foundation & Encoding | Small | Low | Yes |
| 2. Responsive Design & CSS | Medium | Low-Medium | Yes |
| 3. JS Modernisation | Medium | Medium | Yes (with Phase 1) |
| 4. Map Library Upgrade | Large | High | No (needs Phase 3) |
| 5. Accessibility & Polish | Small | Low | Yes |
| 6. Dev Experience | Small | Low | Yes |

**Recommended approach**: Phases 1-2 first (quick visible wins, low risk), then 3-4 together (the core modernisation), then 5-6 as polish.

---

## Out of Scope (not planned unless requested)

- Server-side rendering or backend
- Database or user accounts
- Additional coordinate systems beyond current RT90/SWEREF99
- Internationalisation (English version)
- PWA / offline support
- Unit tests for geodetic math (recommended but not included)
