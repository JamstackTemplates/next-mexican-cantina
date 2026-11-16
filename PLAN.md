# PLAN: build `next-mexican-cantina`

This is the complete brief for an AI coding agent. To start, tell it: **"Implement PLAN.md"**.

It is [PROMPT_TEMPLATE.md](PROMPT_TEMPLATE.md) filled in for this template, with a
**Mexican cantina specifics** section (layout, design, content model and pages) that takes precedence where it is
more specific. `next-cafe-lofi` is the reference implementation, and `next-pizzeria-woodfired` is a second
example (its split lunch/dinner services and their open-state logic are the closest model for this one's
hours); reuse their infrastructure and content patterns, but not their layout or look. This template
should be recognisably different from every existing template in the gallery.

`PLAN.md` and `PROMPT_TEMPLATE.md` are planning documents, not part of the customer template. Don't
link to or import them from the website. Leave them in place, and remind me to delete them before
publishing the template.

## Brief

| Field | Value |
| --- | --- |
| Template ID | `next-mexican-cantina` (`tech` next, `type` mexican, `style` cantina) |
| Gallery name | Mexican cantina |
| Gallery description | A festive, colour-drenched theme for Mexican restaurants and cantinas: a painted menu of tacos, platos and bebidas with heat levels, papel-picado section banners, daily specials, a happy hour that lights up when it's on, opening hours, location and a Jamstacks contact component for group tables, celebrations and catering. |
| Sample business | **Acme Cantina**, a fictitious family-run Mexican restaurant and bar with walk-ins, a happy hour and group tables |
| Sample address | Main Plaza, 115 N Main Ave, San Antonio, TX 78205 (a public landmark, so the map has something real to show) |
| Time zone | `America/Chicago` |
| What visitors want first | Are you open, is it happy hour, and what's on the menu? |
| Contact form purpose | Group tables, celebrations & catering |
| schema.org | `Restaurant` (`servesCuisine: "Mexican"`) |
| Domain | `next-mexican-cantina.jamstacks.net`: `site.config.json`'s `domain` and the GitHub Pages custom domain (CNAME) |

---

## Mexican cantina specifics

### Who it's for

Neighbourhood Mexican restaurants, taquerías and cantinas: walk-ins, after-work happy hour crowds,
families and birthday tables. Visitors want to know whether it's open, whether happy hour is on,
and what's on the menu and how hot it is. It should feel joyful, loud in colour and generous, like
a painted cantina façade on a sunny plaza. Make it celebratory but respectful. Avoid sombreros,
cartoon cacti, moustache caricatures, piñata clip art, "fiesta" stereotypes, mock-Spanish copy, and
Day of the Dead skulls used as decoration. Spanish dish names are correct and properly accented
(*antojitos*, *suadero*, *pozole*, *aguas frescas*) with a plain English description beside them.

### Layout and signature

- **Organizing idea:** *rótulos*, the hand-painted signage of Mexican streets and cantinas. The site
  reads like walking past a painted façade: big sign-painter lettering on blocks of solid colour, with
  papel picado strung overhead.
- **Composition:** full-bleed horizontal **colour bands**. Each home page section is its own band
  painted a different colour (rosa mexicano, verde, añil blue, marigold, lime-wash white), joined by
  scalloped or papel-picado edges instead of plain dividers. There's no single page background with
  floating cards.
- **Hero:** type-led and utility-first. No scene illustration. Giant painted lettering of the business
  name, with a papel-picado banner strung across the top. Beneath it, a painted plaque shows the
  open-now and happy-hour status, today's hours and the address, with "See the menu" and
  "Get directions" buttons. The visitor's question is answered in the hero itself.
- **Core content presentation:** a **painted wall menu**, not cards. Each section is a board with a
  big lettered title, and the items are rows: the Spanish name in bold, the English description below,
  chilli heat, diet marks and a right-aligned price in tabular figures. Tacos are shown as a compact
  **taco board**: a table of fillings by tortilla (corn/flour) and price per taco or per order of three.
- **Signature element: papel-picado banners driven by the menu.** Each menu section has a `motif`
  (taco, chilli, agave, lime, corn, star, flower, glass), and the section's banner flags are cut with
  that motif in the section's colour. Cut-outs are generated as SVG masks from the motif and a seeded
  pattern keyed on the section `id`, so every section has its own banner and new sections need no
  image files. On the menu page, the banner at the top is the section navigation: each flag is a
  link. Write unit tests for the pattern generator (deterministic, every motif renders, flags stay a
  sensible width at 360px).
- **Different from existing templates:**
  - `next-cafe-lofi`, `next-bakery-artisan` and `next-pizzeria-woodfired` all lead with an illustrated
    scene hero beside text, and present their core content as card grids with chips or stickers. This one
    has no hero scene, no cards, and no chips. It uses painted bands, boards and plaques instead.
  - `next-cafe-craft` is about labels on kraft paper. This one is about colour fields and lettering.
  - Every existing template has one dominant background colour. This one alternates between at least
    four saturated band colours.
  - Use a font pairing no other template uses (not Fraunces, Caveat, Kalam, Bricolage Grotesque,
    Roboto Slab, Work Sans, Figtree, Manrope or Nunito).

### Visual direction

- **Light mode, "painted walls at noon":**
  - **Base:** a lime-wash white background (e.g. `#fbf4ea`) with a soft limewash mottling and
    ink (`#231a16`).
  - **Band colours:** rosa mexicano (`#c2185b`, the accent, dark enough for white button text),
    verde (`#1f7a4d`), añil blue (`#1d4e89`), marigold (`#f2a516`) and terracotta (`#c4552d`).
  - **Contrast:** every band gets its own pair of text and link tokens, so text on each band passes
    contrast (e.g. ink on marigold, cream on verde and añil). Add `band-*` utilities through
    `@theme inline` rather than one-off colours.
- **Dark mode, "the plaza after dark":**
  - **Base:** a deep night-indigo background (`#14111f`), with bands as the same hues deepened and
    desaturated (e.g. rosa `#7a1440`, verde `#11402a`, añil `#132b4d`).
  - **Lights:** warm string-light dots along the papel-picado lines, with the banners glowing
    slightly as if lit from behind.
  - **Accent:** a bright rosa (`#ff5fa2`) for text and accents. Keep `--jamstacks-color-primary` the
    darker rosa so the hosted form's white button text passes.
- **Typography** (self-hosted via `@fontsource*` packages; pick close equivalents if needed): a
  bold, retro sign-painter display face for the business name and section titles only (e.g. Shrikhand),
  a sturdy rounded grotesque for subheadings, item names and the menu (e.g. Rubik, variable), and the
  same Rubik or a highly legible sans for body text. Use tabular figures for prices and times.
- **Illustrations** (inline SVG coloured by tokens, changing with light/dark):
  - The papel-picado banners (the signature), with string lights in dark mode.
  - A **heat meter** of 0–3 chillies, the salsa bar as a row of small painted bowls tinted by each
    salsa's colour and heat, and small painted motifs (lime wedge, agave, corn) used as band
    ornaments.
  - Painted plaques and hand-lettered price tags with a slight brush edge (SVG filters or masks,
    kept cheap).
- **Texture:** a subtle limewash on the bands in light mode and faint plaster in dark mode, kept light
  so the gallery JPEGs stay under the screenshot tool's size budget.
- **Motion** (stops under reduced motion): papel picado swaying gently in a breeze, string lights
  twinkling slowly in dark mode, and the happy-hour plaque glowing on when happy hour starts.
- **Footer:** a final painted band in añil blue with the business name in sign-painter lettering, hours
  by service, address, phone, social links and the credit. Use a papel-picado edge, not a solid bar.

### Content model

Use typed files in `content/`. Tests check every rule below and name the item to fix.

- `content/cantina.ts`: the same shape as `next-cafe-lofi`'s `content/cafe.ts` (name, tagline,
  introduction, story (a family recipe tradition and the salsas made every morning, all fictitious),
  `hello@example.com`, a 555 phone number, address with a landmark/cross-streets `note`,
  directions, optional `notice`, amenities, FAQs and social links), plus:
  - **Split services**, as in `next-pizzeria-woodfired`: each day has zero or more `services`
    (`{ label, opens, closes }`), e.g. lunch 11:00–15:00 and dinner 17:00–22:00 on weekdays, open
    all day on weekends, and closed Monday. Tests check that times are valid, ranges don't overlap,
    and each day's ranges are in order.
  - `happyHour`: `days`, `starts`, `ends`, and `deals`, each either a menu item id with a
    happy-hour price or a short label with a price ("$2 off draft cerveza"). Tests check that the
    days are open days, the window falls within a service, the item ids exist, and each happy-hour
    price is below the item's normal price.
- `content/menu.ts`:
  - `sections`: Antojitos, Tacos, Platos fuertes, Postres and Bebidas (aguas frescas, margaritas,
    cerveza, mezcal and tequila, sin alcohol). Each has an `id`, `title` (Spanish), `subtitle`
    (English), `description`, `motif` and `band` (one of the band colour tokens).
  - Items have `id`, `name` (Spanish, accented), `description` (English), `price` (a single price or
    sizes such as `taco` / `order of 3` / `glass` / `pitcher`), optional `heat` (0–3), `diet` tags
    (vegetarian, vegan, gluten-free *ingredients* such as corn tortillas with a shared-kitchen note,
    contains nuts), optional `badge` (`house` | `seasonal` | `new`), `featured`, and `soldOut` (stays
    listed as "Sold out today"). Drinks have an `alcohol` flag, so the menu can mark alcohol-free options.
  - `tacos`: fillings with `name`, `description`, `heat`, `diet`, a per-taco price and an optional
    order-of-three price, plus `tortillas` (corn, flour) for the taco board.
  - `salsas`: the salsa bar (verde, roja, pico de gallo, habanero, macha…) with `name`, `heat` and
    `color`. A salsa macha with peanuts is marked contains-nuts.
  - `specials`: one optional special per weekday (e.g. Tuesday taco special, Friday pozole), each
    with a name, description and price, or an existing item id. This and `happyHour` are the owner's
    most frequent edits, so keep both in obvious places at the top of their files. Tests check that
    the weekdays are open days and that any ids exist.
  - Include 4–5 antojitos (guacamole, elote, queso fundido, ceviche, tostadas), 6–8 taco fillings
    (al pastor, carnitas, suadero, barbacoa, pescado, hongos, a vegan one), 4–5 platos fuertes
    (enchiladas, mole, pozole, carne asada), 3 postres (churros, flan, tres leches) and bebidas
    (3 aguas frescas, a house margarita and a seasonal one, cerveza, a mezcal flight, 2–3
    alcohol-free drinks). Include one sold-out item, one item of each heat level and at least three
    vegan options, with realistic prices and descriptions.
- Prices are in `USD` / `en-US`. Format them the way the lofi template does.

### "Happy hour" and today's special status

- The hero plaque and the menu show a status computed **in the browser** from the time zone and
  refreshed every minute, never at build time:
  - "Open · happy hour now until 6pm";
  - "Open until 10pm · happy hour from 4pm";
  - "Between services · dinner from 5pm";
  - "Closed · opens Tuesday at 11am".
- When happy hour is on, its plaque switches from a quiet painted outline to a lit, glowing sign, and
  the happy-hour prices show beside the normal prices on the menu.
- The home page's "Hoy" (today) slot shows today's special from `specials`, chosen in the browser.
- The static and no-JavaScript view is neutral. It shows the opening hours, the happy hour as
  "Happy hour Tuesday–Friday, 4–6pm" and the week's specials as a list, and makes no claim about
  what's on now or today.
- Put the logic in `lib/` with unit tests covering:
  - before opening, during a service and between services;
  - the moment happy hour starts and ends;
  - a happy-hour day versus a non-happy-hour day;
  - after closing and closed days;
  - the next opening across a closed Monday;
  - a weekday with no special.

### Pages

Use three header items plus the theme toggle: **Menu · Happy hour · Contact**. "Happy hour" links to
the home page's happy-hour band (`/#happy-hour`), and "Find us" is reached from the hero plaque and
the footer. The header itself is a slim painted strip, with a papel-picado edge on its bottom.

1. **Home `/`**, as a stack of painted bands in this order:
   - **Hero band (lime-wash):** the papel-picado banner, giant lettering, the tagline, and the status
     plaque with today's hours, the address, "See the menu" and "Get directions".
   - **Find us band (añil):** cross streets and the plaza landmark, "Get directions", "Open in Google
     Maps", parking and transit directions, opening hours by service with the time zone note, and the
     map in a painted frame.
   - **Hoy band (marigold):** today's special in big lettering, with the week of specials beside it.
   - **Happy hour band (rosa, `id="happy-hour"`):** days, times and deals on a painted board that lights
     up when happy hour is on.
   - **De la casa band (verde):** 4–6 featured dishes and drinks as painted menu rows with heat, linking
     to `/menu/#id`, and the salsa bar row of bowls.
   - **Story band (terracotta):** a short family story (recipes, salsas made each morning, tortillas
     pressed in house) with 3–4 points.
   - **Celebrations band:** group tables, birthdays and catering, linking to Contact.
   - **FAQs (lime-wash):** do you take reservations (walk-ins; groups of 8+ use Contact), is there
     happy hour every day, vegetarian and vegan options, gluten (corn tortillas, shared fryer),
     spice levels and asking for milder, kids, and catering.
2. **Menu `/menu/`:**
   - **Navigation:** the papel-picado banner across the top is the section nav, with the status
     plaque beside it.
   - **Sections:** each section is a painted board on its own band, with the taco board as a table.
   - **Asides:** salsas, extras and allergens sit in a side panel on desktop and in a collapsible panel
     on mobile.
   - **Filters** (vegetarian, vegan, mild, no alcohol) are progressive enhancement. The full menu is
     always in the static HTML.
3. **Contact `/contact/`:** "Group tables, celebrations & catering", following the support form
   contract. The copy makes clear that walk-ins don't need a booking and that a message is an
   *enquiry*: nothing is booked or ordered until we reply to confirm. The "Useful to include" list:
   the date and time, number of guests, the occasion, catering or dine-in, and any allergies.
4. A friendly **404** ("¡Ay! This page went missing…") with links home and to the menu.

Use `schema.org` `Restaurant` with `servesCuisine: "Mexican"`, `hasMenu`, `telephone`,
`acceptsReservations` (false for walk-ins) and the address and service hours from `content/cantina.ts`.

---

## General requirements (from PROMPT_TEMPLATE.md, filled in)

Create a new Jamstacks website template **`next-mexican-cantina`** in
`/home/mythz/src/JamstackTemplates/next-mexican-cantina`: a template for mexican businesses with a
**cantina** style. Make it visually stunning and as close as possible to what a real mexican
owner wants out of the box. Think hand-painted cantina signage: full-bleed bands of saturated painted colour like a lime-washed façade, papel-picado banners strung across the page, and big sign-painter lettering. Daylight on painted walls in light mode, a plaza under string lights in dark mode. The layout is bands and painted boards, not cards.

The sample business is **Acme Cantina**. Its core editable content is: a menu of antojitos, tacos, platos fuertes, postres and bebidas (Spanish name, English description, price, heat level, dietary tags, sold-out flag), a salsa bar, daily specials, happy hour times and deals, and lunch and dinner services.

### Working rules

- The directory is an existing git repo (usually just an initial commit and README). Work on its
  current branch; don't create branches or worktrees.
- Leave changes uncommitted. Don't push, change GitHub settings or deploy unless I ask. The one
  exception is the GitHub Pages custom domain (CNAME) below, which you always set.
- Don't modify the Jamstacks repo (`/home/mythz/src/mythz/jamstacks.net`) or import the template
  into its gallery. Running its screenshot tool *without* `--gallery` is fine.
- `next-cafe-lofi` is the reference implementation, and `next-portfolio-minimal` is a second
  example. Read both before starting. Stay consistent with their infrastructure, content-model
  conventions, accessibility and checks, but **don't reuse their layout or visual design** (see
  Design its own identity).

### Domain and CNAME: `<repo>.jamstacks.net`

Every template is served from a subdomain of jamstacks.net named after its repo, which is also its folder name:
`https://<repo>.jamstacks.net`. For this template that's **`next-mexican-cantina.jamstacks.net`**.

1. Set `"domain": "next-mexican-cantina.jamstacks.net"` in `site.config.json` (see Content model).
2. Set the repo's GitHub Pages custom domain (its CNAME) to the same value, using the GitHub Actions source.
   If Pages isn't enabled yet, enable it first:

   ```sh
   gh api repos/JamstackTemplates/next-mexican-cantina/pages --jq .build_type \
     || gh api -X POST repos/JamstackTemplates/next-mexican-cantina/pages -f build_type=workflow
   gh api -X PUT repos/JamstackTemplates/next-mexican-cantina/pages -f build_type=workflow -f cname=next-mexican-cantina.jamstacks.net
   gh api repos/JamstackTemplates/next-mexican-cantina/pages --jq .cname   # must print next-mexican-cantina.jamstacks.net
   ```

3. Don't add a `public/CNAME` file. Deployments from a GitHub Actions workflow ignore it, and the custom domain
   lives in the Pages settings.
4. DNS is a CNAME record from `next-mexican-cantina.jamstacks.net` to `jamstacktemplates.github.io`. I manage it, so
   don't change DNS. If the domain doesn't resolve yet, say so in your report.
5. Never use another host or repo name. If the folder name and the GitHub repo name differ, stop and ask.

### Copy the shared infrastructure from `next-cafe-lofi`

Copy these and adapt only names, defaults and example paths. They encode the Jamstacks
provisioning, configuration and embed contracts, so don't change their behaviour:

```
.gitignore  .nvmrc  tsconfig.json  next.config.mjs  postcss.config.mjs  .env.example
lib/config.mjs  lib/site.ts  lib/paths.ts  lib/embed-status.ts  lib/time-zone.ts  lib/maps.ts
types/jamstacks.d.ts
components/jamstacks-support-form.tsx  components/site-link.tsx  components/copy-email.tsx
components/time-zone-note.tsx  components/google-map.tsx  components/page-head.tsx
scripts/serve.mjs
tests/config.test.mjs  tests/embed-status.test.ts
.github/workflows/pages.yml
jamstacks/config.test.mjs
```

Drop `time-zone`, `maps`, `time-zone-note` and `google-map` if the business has no opening hours or location.

### Stack

- Next.js static export (`output: 'export'`, `trailingSlash`, unoptimized images), React and
  TypeScript, using the same pinned versions as `next-cafe-lofi`. No request-time rendering, Route
  Handlers, Server Actions, middleware, database or production Next.js server. Client components
  only for browser-only interactions.
- Light/dark theme from the published `jamstacks` npm package: `ThemeProvider` and
  `<ThemeScript />` (from `jamstacks/server`) in `app/layout.tsx`, `DarkModeToggle` in the header.
  Default follows the device.
- Style with **Tailwind CSS v4** (`tailwindcss`, `@tailwindcss/postcss` and `postcss`, pinned like
  `next-cafe-lofi`). Components use utility classes. Customizations live in `app/tailwind.input.css`
  (see Visual design). Restyle the copied `page-head.tsx` to suit the template's typography.
- Self-host fonts through `@fontsource-variable/*` npm packages so builds never fetch fonts from
  the network. Choose fonts that suit the style.
- Scripts: `dev`, `build`, `start` (static preview via `scripts/serve.mjs`), `typecheck`, `test`
  (`node --test`) and `check` (test + typecheck + build). Node ≥ 24.

### Content model: designed for owners and AI agents

- Put all business content in typed files under `content/` (e.g. `content/business.ts` plus one
  file for the core content, like `content/menu.ts` or `content/services.ts`). Pages read from
  them, so most owner requests ("add an item", "change the price", "it's sold out") are data
  edits that never touch components.
- Use explicit types with doc comments on every field, URL-safe unique `id`s that double as page
  anchors, and an optional flag for temporarily unavailable items rather than deleting them.
- Write `tests/content.test.ts` checks that fail with a message naming the item or day to fix:
  unique ids, required fields, valid prices, known tags, and sensible counts of featured items.
- **Never put content in `site.config.json`.** The Jamstacks provisioner rewrites it wholesale
  with `name`, `description`, `domain`, an optional `timeZone`, `jamstacks.siteId`, `jamstacks.cdnUrl`
  and `provisioningId`. Templates must accept exactly that shape (tests cover it).
- **Domain:** the checked-in `site.config.json` sets `"domain": "next-mexican-cantina.jamstacks.net"`, i.e. the folder
  name plus `.jamstacks.net`. That is the template's live demo, and GitHub Pages serves it under the same custom
  domain (CNAME). Never leave it empty, and never use another host. Jamstacks provisioning replaces it with the
  customer's domain. Keep the tests' own config fixtures independent of this value.
- Text is rendered as plain text, never HTML. Use realistic, specific placeholder copy, not
  lorem ipsum. Use a fictitious business, contact details (`hello@example.com`, a 555 phone
  number) and track/people names. Don't invent reviews, awards or claims that could be read as real.

### Page structure

- **Home page:** answer "Are you open, is it happy hour, and what's on the menu?" immediately, on the first screen. For local businesses,
  include a **Find us** section (address, cross streets/landmark, "Get directions", "Open in Google
  Maps", directions, opening hours with a time zone note, and a map) directly under the hero, or
  build the answer into the hero itself. After that, choose the sections and their order to suit
  this business and its content (core content, what makes it special, an enquiry call to action,
  FAQs…). Don't follow another template's section order by default.
- Keep the number of pages small: typically Home, the core-content page (e.g. `/menu/`),
  Contact and a friendly 404. Don't add a page whose content fits on the home page.
- Header navigation is three items at most plus the theme toggle. It must fit on one line at 390px.

### Opening hours and time zone (if applicable)

- Opening hours are local times in `content/`. The time zone is the IANA `timeZone` in
  `site.config.json` (`America/Chicago`), which the Jamstacks portal writes for real customers.
- The "Open now · until 6pm" / "Closed · opens Monday at 7am" badge is computed in the browser
  from the business's time zone and refreshed every minute, never at build time. Without a time
  zone or without JavaScript it shows a neutral label and never claims open or closed.
- Show "Times shown in Eastern Time" (or the business's zone) beside the hours.

### Maps (if applicable)

- Use `lib/maps.ts`: keyless Google Maps URLs for directions/search, and the direct
  `google.com/maps/embed?origin=mfe&pb=…` embed (not `maps?q=…&output=embed`, which redirects
  and breaks the screenshot tool). Never add an API key or anything secret.
- Lazy-load the map iframe. In dark mode, apply the `--map-filter` CSS filter so it matches the theme.

### Design its own identity

Templates in the gallery must not look alike. Design this one from what mexican businesses and their
customers care about, and let the content shape the layout, rather than restyling an earlier template.

- **Start from the business.** Before coding, list 3–5 visual metaphors from this industry and its
  content (a café's chalkboard, a plumber's job ticket, a salon's lookbook, a pizzeria's oven, an
  accountant's ledger). Pick one as the organizing idea and let it drive the layout, not just the colours.
- **Vary the layout, not just the palette.** Decide each of these for this template:
  - **Page composition:** editorial magazine spread, asymmetric grid, full-bleed sections, a
    single long scroll, a split screen, a board, a catalogue, a ticket or a timeline.
  - **Hero:** a large illustration, giant type, a product shot, an interactive board, a full-bleed
    scene, or a utility-first block such as the phone number and an open-now status.
  - **The core content's form:** a card grid, a printed menu, a price sheet, labels, a
    table, an index, tabs, a gallery or a numbered list.
  - **Header and footer:** their placement, weight and shape.
  - **Visual language:** typographic scale and contrast, density and whitespace, shape language
    (sharp, rounded, torn, stamped, ruled) and imagery style (line art, flat shapes, collage,
    pattern, or type alone).
- **One signature element** that could only belong to this template and is driven by its content
  (lofi's window scene, a pizza drawn from its toppings, a roast meter). The design shouldn't
  depend on content-free decoration.
- **Make it different from the existing templates.** Look at the `jamstacks/home-light.jpg` and
  `home-dark.jpg` of the other templates in `/home/mythz/src/JamstackTemplates/`. Don't reuse their
  hero composition, section rhythm, card treatment, sticker/chip styling, footer band or font
  pairings. Shrunk to a gallery thumbnail beside them, this one should be recognisably different.
- Suit the audience. A law firm can be restrained, a donut shop loud, and a trade utility-first.
  "Different" never trumps usability, accessibility or the visitor's top question.

### Visual design

- Make it striking, with a clear point of view. Prefer illustration, typography and texture over generic stock
  layouts. Draw any illustrations as inline SVG coloured by CSS tokens, so the same art changes with
  light/dark (e.g. day vs night) and owners never swap image files.
- Style components with Tailwind utility classes in the TSX. Organize `app/tailwind.input.css` like
  `next-cafe-lofi`'s (the file's structure, not its styles), in this order:
  1. `@import 'tailwindcss'` and `@custom-variant dark (&:where(.dark, .dark *))`.
  2. **Colour tokens** as plain CSS variables (`--bg`, `--surface`, `--text`, `--accent`…), with one
     `:root` block and identical dark overrides under
     `@media (prefers-color-scheme: dark) { :root:not(.light) { … } }` and `:root.dark { … }`.
  3. **Theme:** `@theme { --color-*: initial; … }` switches off Tailwind's default palette, and
     `@theme inline` maps the tokens to utilities (`--color-surface: var(--surface)` gives
     `bg-surface`, `text-ink` and so on). Colours then switch with light/dark automatically, so
     components rarely need `dark:`. Fonts and radii go in `@theme`, and custom breakpoints go in
     `@theme` if the design needs them.
  4. **Base element styles** in `@layer base`. Give `html` an explicit background so gradients don't
     end at the viewport height.
  5. A few **shared building blocks** in `@layer components` (`.button`, `.text-link`, `.eyebrow`…),
     plus `@utility` helpers for layout (`wrap`).
  6. **Illustration, animation** and **data-attribute state** styles (e.g. the support form's
     `.enquiry[data-state]`) that utilities can't express cleanly.
- Customizations such as custom accent colours are new tokens plus an `@theme inline` mapping,
  never hard-coded hex values in components. Avoid putting two utilities for the same property on one
  element (e.g. `text-muted` and `text-ink`), because Tailwind's ordering decides which wins.
- Map the shared `--jamstacks-*` component variables (font, colours, radius, control height,
  spacing, `--jamstacks-form-max-width`) and the `--jamstacks-toggle-*` variables to the
  template's tokens. In dark mode, keep `--jamstacks-color-primary` dark enough for the hosted
  form's white button text.
- Gentle animation is welcome, but all of it must stop under `prefers-reduced-motion`. Visible
  keyboard focus, semantic headings, skip link, sufficient contrast, print styles.
- Responsive from 360px up. Anchor links (`#find-us`, `/menu/#item`) must land just below the
  sticky header, and any sticky toolbar.

### Contact page: Jamstacks support form contract

- Reuse `components/jamstacks-support-form.tsx` unchanged in behaviour. It renders
  `<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="…">` and
  loads one bootstrap `{cdn}/sites/{siteId}/embed.js` only when a site ID is configured.
- With no site ID, show the email fallback and make no script request. The email stays visible
  beside the form at all times.
- Never register the element, render a substitute form, intercept submission or show a success
  message. The hosted runtime owns all of that.
- Links to and from Contact use full-document navigation (`SiteLink` handles it), because the
  runtime has no remount API.
- The form supports name, email and message only. Page copy ("Group tables, celebrations & catering") must not promise
  bookings, ordering, attachments or extra fields.

### SEO and sharing

- Site metadata, per-page titles/descriptions and canonical URLs via `absoluteUrl()` (omitted,
  never guessed, when the deployed URL is unknown). `sitemap.ts`/`robots.ts` with
  `dynamic = 'force-static'`.
- schema.org `Restaurant` JSON-LD built from `content/` (escape `<` in the inline JSON).
- `public/og.png` at 1200×630. Capture it from the built home page with JavaScript disabled so no
  time-dependent text is baked in, then quantize it to keep it small. Add an `app/icon.svg`.
- Footer credit, kept visible, using this markup:

  ```tsx
  <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-footer-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
  ```

  `text-footer-accent` is the café's footer colour. Swap it for the template's own accent utility
  for text on the footer background (e.g. `hover:text-accent`), so it doesn't name a colour that
  isn't in the theme. Keep it a normal followed link (no `nofollow`) with the branded
  `jamstacks.net` text, never keyword-stuffed anchor text.

### AGENTS.md: make the site maintainable with AI agents

Write an `AGENTS.md` for coding assistants working on the *customer's* website, with these sections:

1. **Working preferences:** current branch, preserve changes, leave edits uncommitted, replace
   sample content with the owner's real details.
2. **Structure and content:** which `content/` file owns what. Most owner requests are data
   edits. Id rules. Use existing illustrations and colours instead of adding image files. Content
   never goes in `site.config.json`; the time zone does.
3. **Styling (Tailwind CSS v4):** utilities in components, and what lives in `tailwind.input.css`.
   Only the template palette exists; how to add a colour (token in all three blocks plus an
   `@theme inline` mapping). Prefer tokens to `dark:`. Reuse the building blocks and components.
   Accessibility and reduced motion.
4. **Static architecture:** static export only, client code only for browser interactions,
   time-dependent text computed in the browser, base-path-safe links via the shared helpers,
   read `node_modules/next/dist/docs/` before changing framework behaviour.
5. **Optional Jamstacks form:** the full contract above, condensed. Public config only, never
   credentials. Keep the Pages workflow's `provisioning_id` input and run name.
6. **Commands and checks:** `npm run check` after every change (failures name what to fix),
   project-path build, browser-check light/dark. Report local checks separately from real
   deployments or delivered messages.
7. **Template publishing assets:** the `jamstacks/` rules below.

Don't add an AGENTS.md rule about the footer credit. It's the owner's website.

### README.md: for the owner

Cover: what the template is and that the sample content is fictitious; a pages table; quick
start; "Make it yours" (which file to edit for what) with a worked example of the core content
item and common tasks (sold out, seasonal, new section); hours/time zone and location/map if
applicable; appearance, fonts (with licences) and how styling works (Tailwind, changing or adding
colours in `tailwind.input.css`); footer credit (theirs to keep, reword or remove);
configuration (`site.config.json`, including replacing the demo `domain` with their own, and the
environment-variable table); Contact and Jamstacks
behaviour; Content Security Policy notes (including any map `frame-src`); GitHub Pages deployment;
local Jamstacks development; project structure; a "Before publishing" checklist; and the
optional `jamstacks/` folder.

### `jamstacks/`: the removable publishing folder

- `jamstacks/` exists only to publish the source template in the Jamstacks gallery. It contains
  `config.json`, `screenshots.json`, `home-light.jpg`, `home-dark.jpg` and `config.test.mjs`.
- `config.json`: `name` "Mexican cantina", `description` "A festive, colour-drenched theme for Mexican restaurants and cantinas: a painted menu of tacos, platos and bebidas with heat levels, papel-picado section banners, daily specials, a happy hour that lights up when it's on, opening hours, location and a Jamstacks contact component for group tables, celebrations and catering.", `tech`, `type`, `style`
  (the folder name must equal `tech-type-style`), `internal: false`, `components: ["support-form"]`,
  `configFile: "site.config.json"`, and `screenshots` with light/dark paths and
  `theme.strategy: "media"`.
- **Customer websites can delete the whole folder**, and Jamstacks provisioning removes it after
  verifying it. So nothing in the website code, normal tests, builds or the Pages workflow may import
  or read it. `site.config.json`, the embed integration and `.github/workflows/pages.yml` must stay
  *outside* it. Say this in both AGENTS.md and README.md.
- Generate the screenshots with the Jamstacks tool after a fresh `npm run build`:

  ```sh
  cd /home/mythz/src/mythz/jamstacks.net
  node tools/template-screenshots/capture.mjs --template /home/mythz/src/JamstackTemplates/next-mexican-cantina \
    --modes light,dark --executable /usr/bin/chromium
  ```

  Then run `node --test jamstacks/config.test.mjs` in the template.

### Verification before you finish

1. `npm run check` passes (tests, type check, static export), plus
   `PAGES_BASE_PATH=/mexican-preview npm run build`.
2. The embed contract holds. With `JAMSTACKS_SITE=site_test123`, only `out/contact/index.html`
   contains the host and the `embed.js` URL. Without it, nothing references the embed.
3. A normal build's canonical URLs, `og:image`, `out/sitemap.xml` and structured data use
   `https://next-mexican-cantina.jamstacks.net/`. Base-path builds produce correct links, canonical URLs,
   `og:image`, sitemap and structured data.
4. Serve `out/` and screenshot every page in light and dark at 1440px and 390px with a real
   browser. Fix layout issues you see (orphaned grid items, wrapping header, hard background
   edges, unreadable contrast). Exercise interactive parts (filters, anchors, badge, map) and
   confirm there are no page errors.
5. Gallery screenshots and `og.png` regenerated, and the publishing test passes. Compare the new
   `jamstacks/home-*.jpg` with the other templates' screenshots. If the layout reads as a reskin of one of
   them, rework it.
6. `gh api repos/JamstackTemplates/next-mexican-cantina/pages --jq .cname` prints `next-mexican-cantina.jamstacks.net`.
7. Report what was verified locally versus what was not (deployment, real form delivery,
   gallery review). Mention anything time-dependent captured in screenshots.

### Optional: live demo deployment (only when I ask)

Commit with a descriptive message. *Before* pushing, confirm the Pages custom domain is
`next-mexican-cantina.jamstacks.net` (see Domain and CNAME). Then push to `main`, watch the workflow, verify the live
site at `https://next-mexican-cantina.jamstacks.net/` in a browser, and enforce HTTPS
(`gh api -X PUT repos/JamstackTemplates/next-mexican-cantina/pages -F https_enforced=true`) once the certificate is
approved. Marking the repo as a GitHub template and adding it to the Jamstacks
catalog are separate, reviewed steps.
