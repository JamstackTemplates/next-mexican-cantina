// Content invariants for the cantina, its menu, specials and happy hour. Runs with Node's built-in
// TypeScript type stripping. When one of these fails after an edit, the message names the item or day to fix.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { cantina, formatAddress, happyHour, publicLinks, telHref } from '../content/cantina.ts';
import {
  allItems, BADGES, BANDS, DIETS, dishSections, featuredItems, findItem, formatPrice, menu, MOTIFS, priceOf, resolveSpecial,
  specials, startingPrice, type AnyItem,
} from '../content/menu.ts';
import { deals, happyHourPrices } from '../lib/deals.ts';
import { DAYS, formatService, formatTime, groupedHours, openDays, SERVICE_LABELS, toMinutes } from '../lib/hours.ts';
import { matchesAll, matchesFilter } from '../lib/menu-filter.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const HEX = /^#[0-9a-f]{6}$/i;
const validPrice = (amount: number) => Number.isFinite(amount) && amount >= 0 && Math.round(amount * 100) === amount * 100;
const sectionItems = (id: string) => {
  const section = menu.sections.find(s => s.id === id);
  assert.ok(section, `menu.sections needs a section with id "${id}"`);
  return section.kind === 'tacos' ? menu.tacos.fillings : section.items;
};

function checkPrice(id: string, price: number | { label: string; amount: number }[]) {
  if (typeof price === 'number') {
    assert.ok(validPrice(price) && price > 0, `${id}: price ${price} must be a positive amount with at most two decimals`);
    return;
  }
  assert.ok(price.length >= 1, `${id}: give at least one size, or a single number`);
  for (const size of price) {
    assert.ok(size.label.trim(), `${id}: every size needs a label`);
    assert.ok(validPrice(size.amount) && size.amount > 0, `${id} ${size.label}: price ${size.amount}`);
  }
  assert.equal(new Set(price.map(size => size.label)).size, price.length, `${id} repeats a size label`);
}

function checkTags(item: AnyItem) {
  for (const diet of item.diet ?? []) assert.ok(diet in DIETS, `${item.id} has unknown diet "${diet}" (use ${Object.keys(DIETS).join(', ')})`);
  assert.equal(new Set(item.diet).size, item.diet?.length ?? 0, `${item.id} repeats a diet tag`);
  assert.ok(!(item.diet?.includes('vegan') && item.diet.includes('vegetarian')), `${item.id}: vegan already implies vegetarian, keep just 'vegan'`);
  if (item.heat !== undefined) assert.ok([0, 1, 2, 3].includes(item.heat), `${item.id}.heat must be 0, 1, 2 or 3`);
  if (item.badge) assert.ok(item.badge in BADGES, `${item.id} has unknown badge "${item.badge}" (use ${Object.keys(BADGES).join(', ')})`);
  // Nuts are easy to miss: a description that mentions them must carry the tag.
  if (/\b(peanut|almond|walnut|pecan|cashew|pistachio|hazelnut)s?\b/i.test(item.description)) {
    assert.ok(item.diet?.includes('contains-nuts'), `${item.id} mentions nuts in its description; add 'contains-nuts' to its diet`);
  }
}

test('sections, items, fillings and salsas have unique, URL-safe ids', () => {
  const ids = [
    ...menu.sections.map(section => section.id), ...allItems.map(item => item.id), ...menu.salsas.map(salsa => salsa.id),
  ];
  for (const id of ids) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique across sections, items, fillings and salsas: ${duplicates.join(', ')}`);
});

test('every section is complete, with a motif and a band colour', () => {
  assert.deepEqual(menu.sections.map(s => s.id), ['antojitos', 'tacos', 'platos-fuertes', 'postres', 'bebidas'],
    'Keep the five boards in order (rename titles freely; the ids are anchors).');
  assert.equal(menu.sections.filter(s => s.kind === 'tacos').length, 1, 'There is exactly one taco board.');
  for (const section of menu.sections) {
    for (const key of ['title', 'subtitle', 'description'] as const) assert.ok(section[key].trim(), `section ${section.id} needs a ${key}`);
    assert.ok(MOTIFS.includes(section.motif), `section ${section.id}: motif must be one of ${MOTIFS.join(', ')}`);
    assert.ok(BANDS.includes(section.band), `section ${section.id}: band must be one of ${BANDS.join(', ')}`);
    if (section.short) assert.ok(section.short.length <= 9, `section ${section.id}: keep short under 10 letters so the flag label fits`);
    if (section.kind === 'dishes') assert.ok(section.items.length >= 1, `section ${section.id} has no items`);
  }
});

test('every dish and drink is complete', () => {
  for (const section of dishSections) {
    for (const item of section.items) {
      assert.ok(item.name.trim(), `${item.id}.name`);
      assert.ok(item.description.trim(), `${item.id}.description`);
      checkPrice(item.id, item.price);
      checkTags(item);
      if (section.groups) {
        assert.ok(item.group && section.groups.includes(item.group), `${item.id}.group must be one of ${section.groups.join(', ')}`);
      } else {
        assert.equal(item.group, undefined, `${item.id}: only sections with groups use group`);
      }
    }
  }
});

test('drinks say whether they contain alcohol', () => {
  const drinks = sectionItems('bebidas');
  for (const drink of drinks) {
    assert.equal(typeof (drink as { alcohol?: boolean }).alcohol, 'boolean', `${drink.id}: set alcohol: true or false`);
  }
  assert.ok(drinks.filter(drink => (drink as { alcohol?: boolean }).alcohol === false).length >= 3, 'Keep at least three alcohol-free drinks.');
});

test('the taco board is complete', () => {
  const { tortillas, fillings } = menu.tacos;
  for (const key of ['corn', 'flour'] as const) assert.ok(tortillas[key].label.trim() && tortillas[key].note.trim(), `tacos.tortillas.${key}`);
  for (const filling of fillings) {
    assert.ok(filling.name.trim() && filling.description.trim(), `${filling.id} needs a name and description`);
    checkPrice(filling.id, filling.price);
    checkTags(filling);
    if (filling.orderOf3 !== undefined) {
      checkPrice(`${filling.id} order of 3`, filling.orderOf3);
      assert.ok(filling.orderOf3 > filling.price && filling.orderOf3 <= filling.price * 3,
        `${filling.id}: an order of 3 (${filling.orderOf3}) should cost more than one taco and no more than three`);
    }
    for (const tortilla of filling.tortillas ?? []) assert.ok(tortilla in tortillas, `${filling.id}: unknown tortilla "${tortilla}"`);
    if (filling.tortillas) assert.ok(filling.tortillas.length >= 1, `${filling.id}: list at least one tortilla, or leave tortillas out for both`);
  }
});

test('the salsa bar is complete, and nuts are marked', () => {
  assert.ok(menu.salsas.length >= 3, 'Keep at least three salsas.');
  for (const salsa of menu.salsas) {
    assert.ok(salsa.name.trim() && salsa.description.trim(), `salsa ${salsa.id} needs a name and description`);
    assert.match(salsa.color, HEX, `salsa ${salsa.id}: color must be a hex colour such as #6f9b3c`);
    assert.ok([0, 1, 2, 3].includes(salsa.heat), `salsa ${salsa.id}.heat must be 0, 1, 2 or 3`);
    if (/peanut|almond|walnut|pecan|cashew|nut\b/i.test(salsa.description)) {
      assert.ok(salsa.diet?.includes('contains-nuts'), `salsa ${salsa.id} contains nuts; add 'contains-nuts' to its diet`);
    }
  }
  assert.ok(menu.salsas.find(s => s.id === 'salsa-macha')?.diet?.includes('contains-nuts'), 'Salsa macha (with peanuts) must be marked contains-nuts.');
  for (const extra of menu.extras) assert.ok(extra.name.trim() && validPrice(extra.price), `extra "${extra.name}"`);
  assert.ok(menu.notes.some(note => /gluten/i.test(note)), 'Keep an allergy note about gluten and the shared kitchen.');
});

test('the menu has the range a cantina needs', () => {
  const count = (id: string, min: number, max: number) => {
    const n = sectionItems(id).length;
    assert.ok(n >= min && n <= max, `${id} has ${n} items; the layout is designed for ${min}–${max}`);
  };
  count('antojitos', 3, 8);
  count('tacos', 4, 10);
  count('platos-fuertes', 3, 8);
  count('postres', 2, 6);
  assert.ok(allItems.some(item => item.soldOut), 'Sample content shows one sold-out item.');
  for (const heat of [0, 1, 2, 3]) assert.ok(allItems.some(item => (item.heat ?? 0) === heat), `Include an item with heat ${heat}.`);
  const vegan = allItems.filter(item => item.diet?.includes('vegan') && !('alcohol' in item));
  assert.ok(vegan.length >= 3, `Keep at least three vegan dishes (now ${vegan.length}).`);
  // The diet label never promises "gluten-free" outright: the kitchen is shared.
  assert.match(DIETS['gluten-free'].label, /ingredients/i);
});

test('the home page has 4–6 featured dishes and drinks, all available', () => {
  assert.ok(featuredItems.length >= 4 && featuredItems.length <= 6, `Mark 4–6 items with featured: true (now ${featuredItems.length})`);
  for (const item of featuredItems) assert.ok(!item.soldOut, `${item.id} is featured but sold out`);
});

test('daily specials fall on open days and point at real items', () => {
  const open = openDays(cantina.hours);
  for (const [day, special] of Object.entries(specials)) {
    assert.ok(DAYS.includes(day as never), `specials: "${day}" is not a weekday name`);
    assert.ok(open.includes(day as never), `specials.${day}: the cantina is closed on ${day}`);
    assert.ok(special.title.trim(), `specials.${day}.title`);
    if (special.item) assert.ok(findItem(special.item), `specials.${day}.item "${special.item}" isn't a menu item or taco filling id`);
    else assert.ok(special.name?.trim() && special.description?.trim(), `specials.${day} needs an item id, or a name and description`);
    if (special.price !== undefined) checkPrice(`specials.${day}`, special.price);
    else assert.ok(special.item, `specials.${day} needs a price`);
    const resolved = resolveSpecial(special);
    assert.ok(resolved.name && resolved.description, `specials.${day} resolves to a name and description`);
  }
});

test('happy hour runs on open days, inside a service, with real discounts', () => {
  const { days, starts, ends } = happyHour;
  assert.match(starts, TIME, 'happyHour.starts must be "HH:MM"');
  assert.match(ends, TIME, 'happyHour.ends must be "HH:MM"');
  assert.ok(toMinutes(starts) < toMinutes(ends), 'happyHour must start before it ends');
  assert.ok(days.length >= 1, 'happyHour.days needs at least one day');
  for (const day of days) {
    const services = cantina.hours.find(entry => entry.day === day)?.services ?? [];
    assert.ok(services.length, `happyHour.days includes ${day}, but the cantina is closed on ${day}`);
    assert.ok(services.some(s => toMinutes(s.opens) <= toMinutes(starts) && toMinutes(ends) <= toMinutes(s.closes)),
      `happy hour (${starts}–${ends}) must fall inside one of ${day}'s services`);
  }
  assert.ok(happyHour.deals.length >= 1, 'happyHour.deals needs at least one deal');
  for (const deal of happyHour.deals) {
    if ('item' in deal) {
      const item = findItem(deal.item);
      assert.ok(item, `happy-hour deal "${deal.item}" isn't a menu item or taco filling id`);
      const normal = priceOf(item, deal.size);
      assert.ok(normal !== undefined, `happy-hour deal "${deal.item}": size "${deal.size}" isn't one of its sizes`);
      checkPrice(`happy-hour deal ${deal.item}`, deal.price);
      assert.ok(deal.price < normal, `happy-hour price for ${deal.item} (${deal.price}) must be below its normal price (${normal})`);
    } else {
      assert.ok(deal.label.trim() && deal.label.length <= 48, `happy-hour deal "${deal.label}": keep labels short`);
      if (deal.price !== undefined) checkPrice(`happy-hour deal "${deal.label}"`, deal.price);
    }
  }
  assert.equal(deals.length, happyHour.deals.length);
  assert.deepEqual(happyHourPrices('margarita-de-la-casa'), [{ size: 'Glass', price: 7 }]);
});

test('opening hours list each day once, with valid services in order', () => {
  assert.deepEqual(cantina.hours.map(entry => entry.day), [...DAYS], 'List every day once, Monday first.');
  for (const entry of cantina.hours) {
    let previousClose = -1;
    for (const service of entry.services) {
      const name = `${entry.day} ${service.label}`;
      assert.ok(SERVICE_LABELS.includes(service.label), `${name}: label must be one of ${SERVICE_LABELS.join(', ')}`);
      assert.match(service.opens, TIME, `${name}.opens must be "HH:MM"`);
      assert.match(service.closes, TIME, `${name}.closes must be "HH:MM"`);
      assert.ok(toMinutes(service.opens) < toMinutes(service.closes), `${name} must open before it closes`);
      assert.ok(toMinutes(service.opens) >= previousClose, `${name} overlaps or comes before the service listed above it`);
      previousClose = toMinutes(service.closes);
    }
  }
  assert.ok(cantina.hours.some(entry => entry.services.length), 'Open on at least one day.');
});

test('menu filters: vegan implies vegetarian; mild means one chilli at most; no alcohol hides drinks with it', () => {
  assert.ok(matchesFilter({ diets: ['vegan'] }, 'vegetarian'));
  assert.ok(!matchesFilter({ diets: ['vegetarian'] }, 'vegan'));
  assert.ok(matchesFilter({ diets: [], heat: 1 }, 'mild'));
  assert.ok(!matchesFilter({ diets: [], heat: 2 }, 'mild'));
  assert.ok(matchesFilter({ diets: [] }, 'no-alcohol'));
  assert.ok(!matchesFilter({ diets: ['vegan'], alcohol: true }, 'no-alcohol'));
  assert.ok(matchesAll({ diets: [] }, []));
});

test('prices and hours format for people', () => {
  assert.equal(formatPrice(16.5), '$16.50');
  assert.equal(formatPrice(16), '$16');
  assert.equal(formatPrice(0), 'Free');
  assert.equal(startingPrice(findItem('agua-de-jamaica')!), 4);
  assert.equal(priceOf(findItem('al-pastor')!, 'Order of 3'), 11);
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
  assert.equal(formatTime('11:00'), '11am');
  assert.equal(formatTime('16:30'), '4:30pm');
  assert.equal(formatService({ opens: '11:00', closes: '15:00' }), '11am – 3pm');
  assert.deepEqual(groupedHours(cantina.hours).map(group => group.label), ['Monday', 'Tue – Thu', 'Friday', 'Saturday', 'Sunday']);
});

test('contact details and links are publishable', () => {
  assert.match(cantina.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.match(telHref(), /^tel:\+?\d{7,15}$/);
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(cantina.story.length >= 1 && cantina.points.length >= 3 && cantina.points.length <= 4, 'Write 3–4 story points.');
  assert.ok(cantina.faqs.length >= 1 && cantina.amenities.length >= 1 && cantina.celebrations.length >= 1);
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
  // The contact form takes a name, email and message: the copy must not promise bookings or orders.
  const contact = readFileSync(new URL('../app/contact/page.tsx', import.meta.url), 'utf8');
  assert.match(contact, /nothing is booked or ordered/i);
  assert.doesNotMatch(contact, /book (?:now|online)|order online|attach/i);
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/Chicago'), 'Central Time');
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(cantina.address[key].trim(), `address.${key}`);
  assert.match(cantina.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, 'Main Plaza, 115 N Main Ave, San Antonio, TX 78205');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=Main%20Plaza'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sMain+Plaza%2C+115+N+Main+Ave%2C+San+Antonio%2C+TX+78205!6i16');
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
