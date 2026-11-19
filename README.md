# Mexican cantina (Next.js)

A festive, colour-drenched theme for Mexican restaurants and cantinas: a painted menu of tacos, platos and bebidas with heat levels, papel-picado section banners, daily specials, a happy hour that lights up when it's on, opening hours, location and a [Jamstacks](https://jamstacks.net) contact component for group tables, celebrations and catering.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend. The look is *rótulos*, the hand-painted signage of Mexican streets: full-bleed bands of rosa mexicano, verde, añil blue, marigold and terracotta, big sign-painter lettering, and papel picado strung across the page. Light mode is "painted walls at noon" on lime-wash white. Dark mode is "the plaza after dark": night indigo, deepened bands, string lights and flags lit from behind. Both follow the visitor's device unless they pick one with the header toggle.

**Cantina Papel Picado**, its menu, prices, specials, story and contact details are fictitious placeholders. The sample address is a public landmark, Main Plaza in downtown San Antonio (115 N Main Ave, San Antonio, TX 78205), so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | A stack of painted bands. **Hero**: papel picado, the painted name and a plaque with the live open / happy-hour status, today's hours, the address, **See the menu** and **Get directions**, beside the happy-hour sign. **Find us** (añil): address, cross streets, directions, hours by service and the map. **Hoy** (marigold): today's special beside the week of specials. **Happy hour** (rosa): the deals board that lights up while it's on. **De la casa** (verde): featured dishes and drinks, and the salsa bar. **Story** (terracotta), **Celebrations**, and **FAQs** |
| `/menu/` | The status and happy-hour sign, a papel-picado banner whose flags are the section links, vegetarian / vegan / mild / no-alcohol filters, then one painted board per section (the taco board is a table of fillings by tortilla and price), with salsas, extras and allergies beside it (a collapsible panel on phones) |
| `/contact/` | "Group tables, celebrations & catering": email and phone (always shown) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "¡Ay! This page went missing…" |

The header is a slim rosa strip with three links, **Menu**, **Happy hour** (the home page's happy-hour band) and **Contact**, and the light/dark toggle. "Find us" is reached from the hero plaque and the footer.

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # content, status/happy hour, papel picado, configuration and embed checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from two content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | **Daily specials (at the top)**, menu sections and their banner motif and colour, dishes and drinks, prices and sizes, heat, diet tags, badges, sold-out items, taco fillings and tortillas, the salsa bar, extras, allergy notes, currency |
| [content/cantina.ts](content/cantina.ts) | **Happy hour (at the top)**: days, times and deals. Then name, tagline, introduction, story and points, email, phone, address (plus a landmark/cross-streets `note`), directions, hours by service, notice, amenities, celebrations, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (the band palette and each band's text colours), fonts and other customizations. Components are styled with Tailwind classes |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon (a papel-picado flag) |
| [site.config.json](site.config.json) | Site name/description, domain, time zone and public deployment settings (see below) |

### A menu item

Each row on a board is one entry. The Spanish name goes in `name`, plain English in `description`:

```ts
{
  id: 'elote',                    // URL-safe and unique: /menu/#elote
  name: 'Elote asado',            // Spanish, with accents
  description: 'Grilled corn on the cob with crema, cotija, chile piquín and lime.',
  price: 7,                       // or sizes: [{ label: 'Glass', amount: 4 }, { label: 'Jug', amount: 14 }]
  heat: 1,                        // 0–3 chillies
  diet: ['vegetarian', 'gluten-free'],  // vegan, vegetarian, gluten-free (ingredients), contains-nuts
  badge: 'house',                 // optional: 'house' (De la casa), 'seasonal' or 'new'
  featured: true,                 // optional: show on the home page (keep 4–6 across the menu)
  soldOut: true,                  // optional: stays listed as "Sold out today"
},
```

Drinks also say `alcohol: true` or `false` (the "No alcohol" filter and the "Alcohol-free" mark use it) and which `group` they sit under (Aguas frescas, Margaritas, Cerveza…). Taco fillings live in `menu.tacos.fillings` with a per-taco `price`, an optional `orderOf3` price and optional `tortillas` (leave it out for corn and flour).

Common tasks:

- **Sold out today:** add `soldOut: true` to the item. It stays on the menu, struck through and marked "Sold out today". Remove the line tomorrow.
- **Seasonal or new:** add `badge: 'seasonal'` or `badge: 'new'`.
- **Today's specials:** edit `specials` at the top of `content/menu.ts`. Each weekday can have one special that points at a menu `item` id (its name and description are reused) or has its own `name`, `description` and `price`. Leave a day out for no special.
- **Happy hour:** edit `happyHour` at the top of `content/cantina.ts`. Deals are a menu item id with its happy-hour `price` (and `size`, e.g. `'Glass'` or `'Taco'`), or a short `label` such as "$2 off draft cerveza". The menu shows each happy-hour price beside the normal one.
- **A new section:** add an entry to `menu.sections` with an `id`, Spanish `title`, English `subtitle`, `description`, `items`, a `motif` (taco, chilli, agave, lime, corn, star, flower or glass) and a `band` colour (rosa, verde, anil, marigold or terracotta). Its papel-picado banner is cut automatically; no image needed.

`npm test` checks the rules: unique ids, prices, known tags, heat 0–3, 4–6 featured items, nuts marked, every drink's `alcohol` flag, specials on open days pointing at real items, and happy hour on open days, inside a service, with prices below normal. A failure names the item or day to fix.

### Papel picado draws itself

Every menu section has its own banner. [lib/papel.ts](lib/papel.ts) cuts each flag from the section's `motif`, with a border, satellites and a bottom edge picked by a generator seeded from the section's `id`, so each section's flags are different but always the same from build to build. [components/papel-banner.tsx](components/papel-banner.tsx) draws them as SVG masks in the section's colour. The hero, footer and menu navigation all use the same flags. In dark mode they glow, with string lights between them.

### Hours, happy hour and today's special

`hours` in `content/cantina.ts` lists every day, Monday first, with zero or more services: `Lunch`, `Dinner` or `All day`, each with 24-hour `opens` and `closes` times. An empty list means closed that day. The sample is closed Monday, lunch 11am–3pm and dinner 4–10pm Tuesday to Friday (to 11pm on Friday), and open all day at the weekend.

The status is worked out **in the visitor's browser** from your time zone, and refreshed every minute: "Open · happy hour now until 6pm", "Open until 3pm · happy hour from 4pm", "Between services · dinner from 4pm" or "Closed · opens Tuesday at 11am". While happy hour is on, the happy-hour sign and deals board light up and the menu's happy-hour prices glow. The home page "Hoy" band shows today's special the same way. The static HTML (and the page without JavaScript) stays neutral: it shows the open days, "Happy hour Tuesday–Friday, 4–6pm" and the whole week of specials, and never claims what's on now. The logic is in [lib/hours.ts](lib/hours.ts), covered by `tests/status.test.ts`.

The time zone is `timeZone` in `site.config.json` (an IANA name such as `America/Chicago`). Visitors see "Times shown in Central Time" beside the hours. Without a time zone, the status stays neutral.

### Location and map

The address, its `note` (cross streets or a landmark) and `directions` feed the home page "Find us" band, the footer and the structured data. "Get directions" and "Open in Google Maps" use Google's keyless [Maps URLs](https://developers.google.com/maps/documentation/urls), and the map is Google's keyless embed, lazy-loaded so visitors only contact Google when they scroll to it. In dark mode a CSS filter dims the map to match. To use the official Maps Embed API instead, create a browser key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts).

## Appearance

Colours live in [app/tailwind.input.css](app/tailwind.input.css) as CSS variables: one `:root` block for light mode and two identical dark blocks (one for the device setting, one for the toggle). Every band has five colours: its background (`--rosa`), text (`--rosa-ink`), muted text (`--rosa-muted`), an accent for large lettering (`--rosa-accent`) and a darker panel (`--rosa-panel`). Each pair was chosen so text on the band passes WCAG AA contrast; check contrast if you change them.

**How styling works:** components use [Tailwind CSS v4](https://tailwindcss.com) utility classes. Tailwind's default colours are switched off, so only this palette exists. `@theme inline` maps the variables to utilities (`bg-surface`, `text-ink`, `text-band-muted`…), and `band-rosa`, `band-verde`, `band-anil`, `band-marigold`, `band-terracotta` and `band-lime` paint a band and set its text colours for everything inside. To **change a colour**, edit its variable in all three blocks. To **add one**, add a variable to all three blocks, then a line such as `--color-chile: var(--chile);` in `@theme inline` to get `bg-chile`, `text-chile` and so on.

Fonts are self-hosted from npm (`@fontsource*` packages), both under the SIL Open Font License:

- [Shrikhand](https://fonts.google.com/specimen/Shrikhand), a retro sign-painter display face, for the business name and section titles only;
- [Rubik](https://fonts.google.com/specimen/Rubik) (variable), a sturdy rounded grotesque, for subheadings, the menu and body text, with tabular figures for prices and times.

All motion (swaying papel picado, twinkling string lights, the happy-hour sign switching on) stops when visitors ask their device for reduced motion.

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Cantina Papel Picado",
  "description": "A family-run Mexican cantina on Main Plaza: tacos, platos and bebidas, a daily special, happy hour, opening hours and how to find us.",
  "domain": "next-mexican-cantina.jamstacks.net",
  "timeZone": "America/Chicago",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo. **Replace it with your own domain** (hostname only, e.g. `www.yourcantina.com`), or set it to `""` if you don't know it yet; it drives canonical URLs, the sitemap and social images. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-cantina` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts it and emits HTTPS canonical, social and sitemap URLs. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (`servesCuisine: "Mexican"`, address, opening hours per service, telephone, menu link, `acceptsReservations: false` for walk-ins) built from `content/cantina.ts`.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number, a reminder that walk-ins never need a booking, and a "useful to include" list. No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Group tables, celebrations & catering", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing the menu, hours or the site ID does need a rebuild.
- The form supports name, email and message today. The page copy calls a message an *enquiry*: nothing is booked or ordered until you reply to confirm. Don't promise booking slots, party-size fields, attachments or online ordering.
- Only the Contact page loads the Jamstacks script or contains its URL.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation). This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). In dark mode the form's primary colour stays a deep rosa so its white button text is readable. A theme you publish in the portal overrides these. Don't style the component's internals.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets; they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/cantina-preview npm run build
node scripts/serve.mjs --base /cantina-preview   # http://localhost:3000/cantina-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, and put the same hostname in `site.config.json`'s `domain`. A `public/CNAME` file isn't needed: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal.

## Project structure

```
app/                     routes, metadata, sitemap/robots, global styles and tokens
components/              header, footer, papel-picado banner and flags, menu board and rows, status plaque,
                         happy-hour sign, today's special, heat meter, salsa bowls, ornaments, Jamstacks host/loader
content/                 cantina.ts (happy hour first) and menu.ts (specials first): your content
lib/hours.ts             hours by service, the open/happy-hour status and today's special (pure, unit tested)
lib/papel.ts             the seeded papel-picado pattern generator and flag sizes (pure, unit tested)
lib/deals.ts             happy-hour deals resolved against the menu
lib/menu-filter.ts       vegetarian / vegan / mild / no-alcohol filter rules
lib/config.mjs           build-time public config resolution and validation
lib/paths.ts             base-path-aware links and asset URLs
lib/structured-data.ts   schema.org Restaurant data
lib/time-zone.ts         readable time zone names for the hours
lib/maps.ts              Google Maps embed, search and directions URLs
lib/embed-status.ts      observable states of the hosted form
types/jamstacks.d.ts     typed JSX for <jamstacks-support-form>
public/                  the social preview image
scripts/serve.mjs        static preview server (with base path support)
tests/                   node:test suites
site.config.json         public deployment settings (provisioner-compatible)
jamstacks/               optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Cantina Papel Picado, the address (and its `note`), directions, email, phone, menu, prices, specials, happy hour, story, FAQs and social links with your own details.
- Set your real services and `timeZone` in `site.config.json`. Check the status, happy-hour sign and today's special on the home page at a few times of day.
- Choose your 4–6 featured dishes and drinks, and check every item's heat and diet tags (especially nuts and gluten).
- Replace `domain` in `site.config.json` with your own domain (or `""`). Update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation, the menu filters and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed: Jamstacks provisioning removes it after verifying it.
Normal `npm test`, type checking, builds and the Pages workflow do not import or read it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
