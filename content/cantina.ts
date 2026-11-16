// Cantina details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious cantina. The sample address is a public
// landmark (Main Plaza in downtown San Antonio) so the map has something real to show; replace it
// with yours. Plain strings only: text is rendered as text, never as HTML.
import type { DayHours, HappyHourTimes } from '../lib/hours';

// ---------------------------------------------------------------------------------------------
// Happy hour: the edit you'll make most often, so it lives at the top.
// `deals` point at a menu item id (from content/menu.ts) with its happy-hour price, or are a short
// label with an optional price. The menu shows each item's happy-hour price beside its normal one.
// ---------------------------------------------------------------------------------------------
export const happyHour: HappyHour = {
  days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  starts: '16:00',
  ends: '18:00',
  deals: [
    { item: 'margarita-de-la-casa', size: 'Glass', price: 7 },
    { item: 'agua-de-jamaica', size: 'Glass', price: 3 },
    { item: 'al-pastor', size: 'Taco', price: 3 },
    { item: 'guacamole', price: 9 },
    { label: '$2 off draft cerveza' },
    { label: 'Half-price chips and salsa' },
  ],
};

export type HappyHourDeal =
  /** A menu item at a happy-hour price. `size` picks which size (e.g. "Glass") when the item has several. */
  | { item: string; size?: string; price: number }
  /** A short line such as "$2 off draft cerveza", with an optional price. */
  | { label: string; price?: number };

export interface HappyHour extends HappyHourTimes {
  deals: HappyHourDeal[];
}

export interface Amenity {
  /** Icon name from components/icons.tsx. */
  icon: 'walk-in' | 'group' | 'kids' | 'leaf' | 'glass' | 'access' | 'patio';
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SocialLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Cantina {
  name: string;
  /** Short line under the name on the home page. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** Home page story paragraphs: the family, the recipes and the morning salsas. */
  story: string[];
  /** 3–4 short points beside the story, e.g. "Tortillas pressed to order". */
  points: { title: string; detail: string }[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(210) 555-0164". */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional landmark or cross streets shown under the address. */
    note?: string;
  };
  /** How to find you: parking, transit, step-free access. */
  directions: string[];
  /**
   * Every day of the week, Monday first, with its services in local time (the time zone is `timeZone`
   * in site.config.json). `services: []` means closed all day.
   */
  hours: DayHours[];
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  amenities: Amenity[];
  /** Group tables, birthdays and catering: the home page "Celebrations" band. */
  celebrations: { title: string; detail: string }[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: SocialLink[];
}

const lunch = { label: 'Lunch', opens: '11:00', closes: '15:00' } as const;
const dinner = { label: 'Dinner', opens: '16:00', closes: '22:00' } as const;

export const cantina: Cantina = {
  name: 'Acme Cantina',
  tagline: 'Tacos · platos · bebidas · on the plaza',
  introduction:
    'A family-run cantina on Main Plaza. Tortillas pressed to order, salsas made every morning, and a happy hour that brings the whole street in after work.',
  story: [
    'The recipes started in an abuela’s kitchen: a mole that takes two days, a pozole for Fridays and a salsa verde that every grandchild learned to make before they could reach the stove. When the family opened the cantina, those recipes came with them, written on index cards that still hang by the line.',
    'Every morning starts the same way. Tomatillos and chiles go on the comal before the doors open, the salsas are ground fresh for the day, and the masa is pressed into tortillas a few at a time, so the ones on your plate were made minutes ago.',
  ],
  points: [
    { title: 'Salsas every morning', detail: 'Five salsas, roasted and ground fresh before we open.' },
    { title: 'Tortillas pressed in house', detail: 'Corn masa pressed to order, a few at a time.' },
    { title: 'Family recipes', detail: 'Mole, pozole and barbacoa the way they were taught to us.' },
    { title: 'Mild to very hot', detail: 'Every dish shows its heat. Ask and we’ll make it milder.' },
  ],
  email: 'hello@example.com',
  phone: '(210) 555-0164',
  address: {
    street: 'Main Plaza, 115 N Main Ave',
    locality: 'San Antonio',
    region: 'TX',
    postalCode: '78205',
    country: 'US',
    note: 'On Main Plaza, between Commerce Street and Dolorosa Street, in front of San Fernando Cathedral',
  },
  directions: [
    'VIA buses stop on Commerce Street and Dolorosa Street, a minute’s walk from the plaza.',
    'A ten-minute walk from the River Walk: take the stairs up at Commerce Street and head west.',
    'Paid parking in the garages on Dolorosa Street and at Market Square; metered parking around the plaza.',
    'Step-free entrance from the plaza and an accessible restroom.',
  ],
  hours: [
    { day: 'Monday', services: [] },
    { day: 'Tuesday', services: [lunch, dinner] },
    { day: 'Wednesday', services: [lunch, dinner] },
    { day: 'Thursday', services: [lunch, dinner] },
    { day: 'Friday', services: [lunch, { label: 'Dinner', opens: '16:00', closes: '23:00' }] },
    { day: 'Saturday', services: [{ label: 'All day', opens: '11:00', closes: '23:00' }] },
    { day: 'Sunday', services: [{ label: 'All day', opens: '11:00', closes: '21:00' }] },
  ],
  notice: '',
  amenities: [
    { icon: 'walk-in', title: 'Walk-ins welcome', detail: 'No booking needed. Groups of 8 or more, send us a note first.' },
    { icon: 'kids', title: 'Kids welcome', detail: 'High chairs, a kids’ plate and crayons for the paper tablecloths.' },
    { icon: 'patio', title: 'Plaza patio', detail: 'Tables outside under the lights when the weather’s good.' },
    { icon: 'access', title: 'Step-free', detail: 'Level entrance from the plaza and an accessible restroom.' },
  ],
  celebrations: [
    { title: 'Group tables', detail: 'Long tables for 8 to 30, with family-style platters to share.' },
    { title: 'Birthdays', detail: 'Bring the cake, or let us bring out tres leches with a candle.' },
    { title: 'Catering', detail: 'Taco bars, trays of enchiladas and aguas frescas by the jug.' },
  ],
  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'We’re walk-in only, and tables turn quickly. For groups of 8 or more, send us a message through the Contact page a few days ahead and we’ll do our best to set up a long table.',
    },
    {
      question: 'Is there happy hour every day?',
      answer: 'Happy hour is Tuesday to Friday, 4 to 6pm, at the bar and on the patio. There’s no happy hour on weekends or holidays.',
    },
    {
      question: 'Do you have vegetarian and vegan options?',
      answer: 'Yes. The menu marks every vegetarian and vegan dish, including the guacamole, the mushroom and cauliflower al pastor tacos and the calabacitas. Our beans are cooked without lard, and the aguas frescas are dairy-free.',
    },
    {
      question: 'Is the food gluten-free?',
      answer: 'Corn tortillas, most salsas and many dishes are made with gluten-free ingredients, and the menu marks them. We share one kitchen and one fryer with flour tortillas and battered fish, so we can’t promise anything is free from traces of gluten.',
    },
    {
      question: 'How spicy is it? Can I have it milder?',
      answer: 'Every dish shows its heat from zero to three chillies. Most of the heat is in the salsas, which you add yourself, and the kitchen can make most dishes milder if you ask.',
    },
    {
      question: 'Are kids welcome?',
      answer: 'Always. We have high chairs, a kids’ plate of a quesadilla or two small tacos with rice and beans, and crayons for the paper tablecloths.',
    },
    {
      question: 'Do you cater?',
      answer: 'Yes, for offices, birthdays and family parties: taco bars, trays of enchiladas, salsas and aguas frescas by the jug. Send us the date, the number of guests and any allergies through the Contact page and we’ll reply with what we can do.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = cantina.links.filter(link => link.url.trim() !== '');

/** Single-line postal address, also used for the map and directions. */
export function formatAddress(address = cantina.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** tel: link for a number written for people, e.g. "(210) 555-0164" → "tel:2105550164". */
export function telHref(phone = cantina.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
