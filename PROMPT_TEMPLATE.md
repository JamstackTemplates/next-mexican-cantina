# Prompt template: new Jamstacks website template

Use this to ask an AI coding agent to build a new customer template in `JamstackTemplates`.
Fill in the **Brief**, delete any optional sections that don't apply, and paste everything
from "Prompt" down. The requirements reflect what `next-cafe-lofi` established; it is the
reference implementation for contracts, tooling and quality, *not* for layout or design. Each
template should look like it was designed for its own industry and content.

---

## Brief (fill in)

| Field | Value | Example |
| --- | --- | --- |
| Template ID | `{{TECH}}-{{TYPE}}-{{STYLE}}` | `next-cafe-lofi` |
| Type (one industry/vertical) | `{{TYPE}}` | `cafe`, `bakery`, `plumber`, `salon` |
| Style word (shared vocabulary) | `{{STYLE}}` | `lofi`, `warm`, `minimal`, `bold`, `classic` |
| Gallery name | `{{NAME}}` | `Lofi cafe` |
| Gallery description (one sentence, ≤500 chars) | `{{DESCRIPTION}}` | "A cosy, illustrated lofi theme for coffee shops and cafés, with an editable menu, opening hours, location and a Jamstacks contact component for enquiries and catering requests." |
| Sample business name | `{{BUSINESS}}` | `Lofi Café` (or `Acme Plumbing`) |
| Sample address (real public landmark, if location matters) | `{{ADDRESS}}` | `20 Times Square (northeast corner of 7th Avenue and 47th Street), New York, NY 10036` |
| Time zone (IANA, if it has opening hours) | `{{TIME_ZONE}}` | `America/New_York` |
| What visitors most want first | `{{TOP_QUESTION}}` | "Where is it and is it open?" |
| Core editable content | `{{CONTENT}}` | menu items with sizes, prices, dietary tags, sold-out flag |
| Contact form purpose/copy | `{{FORM_PURPOSE}}` | "Events, catering & enquiries" |
| schema.org type | `{{SCHEMA_TYPE}}` | `CafeOrCoffeeShop`, `Bakery`, `Plumber` |
| Look, feel and layout | `{{VISUAL_DIRECTION}}` | "pastel morning in light mode, rainy night in dark mode, illustrated window scene, grain texture" (a plumber might be "a bold job-ticket layout: emergency number first, services as a numbered price sheet, a service-area map") |
| Domain (always the folder name + `.jamstacks.net`) | `{{TEMPLATE_ID}}.jamstacks.net` | `next-cafe-lofi.jamstacks.net` |

---

## Prompt

Create a new Jamstacks website template **`{{TEMPLATE_ID}}`** in
`/home/mythz/src/JamstackTemplates/{{TEMPLATE_ID}}`: a template for {{TYPE}} businesses with a
**{{STYLE}}** style. Make it visually stunning and as close as possible to what a real {{TYPE}}
owner wants out of the box. {{VISUAL_DIRECTION}}

The sample business is **{{BUSINESS}}**. Its core editable content is: {{CONTENT}}.

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
`https://<repo>.jamstacks.net`. For this template that's **`{{TEMPLATE_ID}}.jamstacks.net`**.

1. Set `"domain": "{{TEMPLATE_ID}}.jamstacks.net"` in `site.config.json` (see Content model).
2. Set the repo's GitHub Pages custom domain (its CNAME) to the same value, using the GitHub Actions source.
   If Pages isn't enabled yet, enable it first:

   ```sh
   gh api repos/JamstackTemplates/{{TEMPLATE_ID}}/pages --jq .build_type \
     || gh api -X POST repos/JamstackTemplates/{{TEMPLATE_ID}}/pages -f build_type=workflow
   gh api -X PUT repos/JamstackTemplates/{{TEMPLATE_ID}}/pages -f build_type=workflow -f cname={{TEMPLATE_ID}}.jamstacks.net
   gh api repos/JamstackTemplates/{{TEMPLATE_ID}}/pages --jq .cname   # must print {{TEMPLATE_ID}}.jamstacks.net
   ```

3. Don't add a `public/CNAME` file. Deployments from a GitHub Actions workflow ignore it, and the custom domain
   lives in the Pages settings.
4. DNS is a CNAME record from `{{TEMPLATE_ID}}.jamstacks.net` to `jamstacktemplates.github.io`. I manage it, so
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
- **Domain:** the checked-in `site.config.json` sets `"domain": "{{TEMPLATE_ID}}.jamstacks.net"`, i.e. the folder
  name plus `.jamstacks.net`. That is the template's live demo, and GitHub Pages serves it under the same custom
  domain (CNAME). Never leave it empty, and never use another host. Jamstacks provisioning replaces it with the
  customer's domain. Keep the tests' own config fixtures independent of this value.
- Text is rendered as plain text, never HTML. Use realistic, specific placeholder copy, not
  lorem ipsum. Use a fictitious business, contact details (`hello@example.com`, a 555 phone
  number) and track/people names. Don't invent reviews, awards or claims that could be read as real.

### Page structure

- **Home page:** answer {{TOP_QUESTION}} immediately, on the first screen. For local businesses,
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
  `site.config.json` (`{{TIME_ZONE}}`), which the Jamstacks portal writes for real customers.
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

Templates in the gallery must not look alike. Design this one from what {{TYPE}} businesses and their
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
- The form supports name, email and message only. Page copy ({{FORM_PURPOSE}}) must not promise
  bookings, ordering, attachments or extra fields.

### SEO and sharing

- Site metadata, per-page titles/descriptions and canonical URLs via `absoluteUrl()` (omitted,
  never guessed, when the deployed URL is unknown). `sitemap.ts`/`robots.ts` with
  `dynamic = 'force-static'`.
- schema.org `{{SCHEMA_TYPE}}` JSON-LD built from `content/` (escape `<` in the inline JSON).
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
- `config.json`: `name` "{{NAME}}", `description` "{{DESCRIPTION}}", `tech`, `type`, `style`
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
  node tools/template-screenshots/capture.mjs --template /home/mythz/src/JamstackTemplates/{{TEMPLATE_ID}} \
    --modes light,dark --executable /usr/bin/chromium
  ```

  Then run `node --test jamstacks/config.test.mjs` in the template.

### Verification before you finish

1. `npm run check` passes (tests, type check, static export), plus
   `PAGES_BASE_PATH=/{{TYPE}}-preview npm run build`.
2. The embed contract holds. With `JAMSTACKS_SITE=site_test123`, only `out/contact/index.html`
   contains the host and the `embed.js` URL. Without it, nothing references the embed.
3. A normal build's canonical URLs, `og:image`, `out/sitemap.xml` and structured data use
   `https://{{TEMPLATE_ID}}.jamstacks.net/`. Base-path builds produce correct links, canonical URLs,
   `og:image`, sitemap and structured data.
4. Serve `out/` and screenshot every page in light and dark at 1440px and 390px with a real
   browser. Fix layout issues you see (orphaned grid items, wrapping header, hard background
   edges, unreadable contrast). Exercise interactive parts (filters, anchors, badge, map) and
   confirm there are no page errors.
5. Gallery screenshots and `og.png` regenerated, and the publishing test passes. Compare the new
   `jamstacks/home-*.jpg` with the other templates' screenshots. If the layout reads as a reskin of one of
   them, rework it.
6. `gh api repos/JamstackTemplates/{{TEMPLATE_ID}}/pages --jq .cname` prints `{{TEMPLATE_ID}}.jamstacks.net`.
7. Report what was verified locally versus what was not (deployment, real form delivery,
   gallery review). Mention anything time-dependent captured in screenshots.

### Optional: live demo deployment (only when I ask)

Commit with a descriptive message. *Before* pushing, confirm the Pages custom domain is
`{{TEMPLATE_ID}}.jamstacks.net` (see Domain and CNAME). Then push to `main`, watch the workflow, verify the live
site at `https://{{TEMPLATE_ID}}.jamstacks.net/` in a browser, and enforce HTTPS
(`gh api -X PUT repos/JamstackTemplates/{{TEMPLATE_ID}}/pages -F https_enforced=true`) once the certificate is
approved. Marking the repo as a GitHub template and adding it to the Jamstacks
catalog are separate, reviewed steps.
