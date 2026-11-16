# Working on this website

This is a customer-owned Next.js website for a Mexican restaurant and cantina. Read [README.md](README.md) for
setup, content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample cantina (Acme Cantina),
  menu, prices, specials, happy hour, address, hours and contact details with the owner's real details; the
  fictional examples are starting content.

## Structure and content

- `content/menu.ts` owns the menu. The weekly `specials` sit at the top (one optional special per weekday,
  pointing at a menu `item` id or standing alone with `name`, `description` and `price`). Below them:
  `sections` (Antojitos, Tacos, Platos fuertes, Postres, Bebidas, each with `title`, `subtitle`, `description`,
  `motif` and `band`), dish rows (`name` in Spanish with accents, `description` in English, `price` or sizes,
  `heat` 0–3, `diet`, `badge`, `featured`, `soldOut`; drinks also `alcohol` and `group`), the taco board
  (`tacos.fillings` with a per-taco price and optional `orderOf3`, and `tacos.tortillas`), `salsas`, `extras`
  and allergy `notes`. Most owner requests ("add a taco", "the ceviche is sold out", "Friday's special is
  pozole verde", "raise the margarita price") are edits here only.
- `content/cantina.ts` owns `happyHour` at the top (`days`, `starts`, `ends`, and `deals`: a menu item id
  with a happy-hour price and optional `size`, or a short label), then the name, tagline, introduction,
  story and points, email, phone, address (with a landmark/cross-streets `note`), directions, `hours` (each
  day's `services`: lunch, dinner or all day), notice, amenities, celebrations, FAQs and links.
- Diet tags: `vegan`, `vegetarian`, `gluten-free` (meaning gluten-free *ingredients*: the kitchen and fryer
  are shared, so never promise "gluten-free") and `contains-nuts`. Anything with peanuts or other nuts must
  carry `contains-nuts`; the tests check descriptions for nut words.
- Every menu section draws its own papel-picado banner: `lib/papel.ts` cuts each flag from the section's
  `motif` (taco, chilli, agave, lime, corn, star, flower, glass) with a pattern seeded by the section `id`,
  and `components/papel-banner.tsx` renders it as an SVG mask in the section's `band` colour. A new section
  needs no image file. Renaming a section `id` changes its flags and its `/menu/#id` link. A new motif must be
  drawn in `MOTIF_OPS` in `lib/papel.ts` and added to `MOTIFS` in `content/menu.ts`.
- `lib/hours.ts` holds the pure time logic: grouping hours by service, the "Open · happy hour now until 6pm /
  Open until 10pm · happy hour from 4pm / Between services / Closed · opens Tuesday at 11am" status, the
  happy-hour sign and the day's special. Keep it pure and covered by `tests/status.test.ts`.
- The address drives the home page "Find us" band, Google map, directions links and structured data. Maps use
  keyless Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there).
  Change it there, not in content; without it the status, happy-hour sign and today's special stay neutral.
- Keep ids unique, lowercase and hyphenated; they are page anchors. Use the existing illustrations (papel
  picado, heat meter, salsa bowls, lime/agave/corn ornaments) and band colours rather than adding image files.
- Keep content out of `site.config.json`: Jamstacks may rewrite it with deployment fields only.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business. Spanish names
  are correct and accented, with plain English beside them; no mock-Spanish, sombreros, cartoon cacti or
  Day of the Dead decoration.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds everything utilities can't express: the colour tokens (`:root` for light,
  plus two dark blocks that must stay identical), the `@theme` built from them, the `band-*` utilities, base
  element styles, shared building blocks (`.button`, `.button-ghost`, `.button-band`, `.button-band-ghost`,
  `.button-quiet`, `.text-link`, `.band-link`, `.eyebrow`, `.plaque`, `.menu-row`, `.menu-leader`,
  `.price-tag`, `.mark`, `.diet-mark`, `.faq`), band edges (`.edge-scallop`, `.edge-picado`, `.edge-hang`),
  the limewash texture (`.wash`), the papel-picado banner, string lights and sway, the happy-hour glow and
  styles driven by data attributes (`data-tone`, `data-happy`, `data-today`, `.enquiry[data-state]`).
- Only this template's palette exists (`bg`, `surface`, `ink`, `muted`, `line`, `accent`, `rosa`, `verde`,
  `anil`, `marigold`, `terracotta`, plus `band`, `on-band`, `band-muted`, `band-accent`, `band-panel`,
  `band-line`). Tailwind's default colours are switched off. Paint a band with `band-rosa`, `band-verde`,
  `band-anil`, `band-marigold`, `band-terracotta` or `band-lime`; inside it, use `text-band-muted`,
  `bg-band-panel`, `border-band-line` and so on, so text always uses that band's contrast-checked pair.
- To add a colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on. A new band colour needs its five
  variables (`--name`, `-ink`, `-muted`, `-accent`, `-panel`) in all three blocks, a `@utility band-name`,
  a `--flag-name` colour, and an entry in `BANDS` (content/menu.ts) and the class maps in
  `components/menu-board.tsx` and `components/papel-banner.tsx`. Never hard-code hex values in components.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows
  `html.dark`). Don't put two utilities for the same property on one element.
- Fonts: `font-display` / `lettered` (Shrikhand) only for the business name, section titles and sign
  lettering; `font-sans` (Rubik) for everything else, with tabular figures for prices and times.
- Reuse the building blocks and existing components (`PapelBanner`, `PapelNav`, `Flag`, `MenuRow`, `Price`,
  `HappyHourPrice`, `HeatMeter`, `DietMarks`, `SalsaBowl`, `Ornament`, `StatusLine`, `TodayHours`,
  `HappyHourSign`, `HappyScope`, `TodaySpecial`, `WeekSpecials`, `PageHead`) instead of restyling each instance.
- Keep the `--jamstacks-*` component variables mapped to the tokens, with a dark-mode primary dark enough
  for white button text. Preserve readable contrast on every band in both themes, responsive layouts from
  360px (the header must stay on one line at 390px), visible keyboard focus, semantic headings, the skip
  link, print styles and reduced-motion support (the sway, string lights and happy-hour glow all stop under
  `prefers-reduced-motion`).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no request-time rendering,
  Route Handlers, Server Actions, middleware, database or production Next.js server.
- Use local content for pages and ordinary client code only for browser-only interactions (the status and
  happy-hour sign, today's special, menu filters, copy button). Time-dependent text is computed in the
  browser by `components/use-cantina-clock.ts`, never at build time; the static HTML stays neutral.
- Client components must not import `lib/site.ts`: it would ship the Jamstacks embed URL to every page.
  Read the single `process.env.NEXT_PUBLIC_*` value you need instead (see `lib/paths.ts`).
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths. Use the shared path
  helpers (`documentHref`, `absoluteUrl`, `route`) and `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework
  behavior. Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>` with
  `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at
  `/sites/{publicSiteId}/embed.js`, on the Contact page only; no ID means no script request and a useful email fallback.
- The shared runtime owns form rendering, validation, spam protection and submission. Do not copy it,
  register a replacement element, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount contract is
  available. Keep the email visible beside the form and usable during outages.
- The form supports name, email and message. Contact copy says walk-ins never need a booking and a message
  is an enquiry: nothing is booked or ordered until the cantina replies to confirm. Don't promise bookings,
  ordering, attachments or extra fields.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials, publishing keys or
  private notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated run name
  when changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # content, status/happy hour, papel picado, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/cantina-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the item, section or day to fix.
`npm start` previews the export on port 3000; stop the dev server first, or use `npm start -- --port 3200`.
Browser-check affected routes in light and dark, at desktop and phone widths, and root/project-path assets
when changing layout, navigation or deployment behavior. Report local checks separately from any actual
GitHub deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import or read it.
- Keep `site.config.json`, the embed integration and the Pages workflow outside the optional folder.
