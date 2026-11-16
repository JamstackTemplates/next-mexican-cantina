// The menu. Add, remove, reorder or reprice dishes here; every page reads from this file.
// Names and prices are placeholders: replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.
import type { Day } from '../lib/hours';

// ---------------------------------------------------------------------------------------------
// Daily specials: the edit you'll make most often, so they live at the top.
// One optional special per weekday. Leave a day out for no special. A special can point at a menu
// item by `item` id (its name and description are reused), or stand alone with `name` and `description`.
// The home page "Hoy" band shows today's special, worked out in the visitor's browser.
// ---------------------------------------------------------------------------------------------
export const specials: Partial<Record<Day, DailySpecial>> = {
  Tuesday: {
    title: 'Martes de tacos',
    item: 'al-pastor',
    description: 'Al pastor tacos all day, on corn or flour, with pineapple, onion and cilantro.',
    price: 2.5,
  },
  Thursday: {
    title: 'Jueves de mole',
    item: 'mole-poblano',
    description: 'The family’s two-day mole poblano, $3 off all day.',
    price: 19,
  },
  Friday: {
    title: 'Viernes de pozole',
    name: 'Pozole verde',
    description: 'Chicken and hominy in a green broth of pumpkin seeds, tomatillo and poblano, with radish, lettuce and tostadas.',
    price: 16,
  },
  Saturday: {
    title: 'Sábado de barbacoa',
    name: 'Barbacoa por libra',
    description: 'A pound of beef-cheek barbacoa with a stack of corn tortillas, onion, cilantro, lime and a cup of consommé. Until it runs out.',
    price: 26,
  },
  Sunday: {
    title: 'Domingo en familia',
    name: 'Parrillada familiar',
    description: 'A sizzling platter for four: carne asada, al pastor, grilled nopales and spring onions, with tortillas, rice and beans.',
    price: 68,
  },
};

export interface DailySpecial {
  /** The day's lettered name, e.g. "Martes de tacos". */
  title: string;
  /** Optional id of a menu item or taco filling this special is about. Its name and description are reused. */
  item?: string;
  /** Dish name, when the special isn't on the regular menu. */
  name?: string;
  /** One or two sentences. Falls back to the item's description. */
  description?: string;
  /** The special's price. Falls back to the item's price. */
  price?: number;
}

/** Dietary markers shown beside items and used by the menu filters. */
export type Diet = 'vegan' | 'vegetarian' | 'gluten-free' | 'contains-nuts';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegan: { label: 'Vegan', short: 'VG' },
  vegetarian: { label: 'Vegetarian', short: 'V' },
  // Gluten-free *ingredients*: the kitchen and fryer are shared, so the menu never promises "gluten-free".
  'gluten-free': { label: 'Gluten-free ingredients (shared kitchen)', short: 'GF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

export type Badge = 'house' | 'seasonal' | 'new';

export const BADGES: Record<Badge, string> = {
  house: 'De la casa',
  seasonal: 'Seasonal',
  new: 'New',
};

/**
 * The cut-out on a section's papel-picado banner (see lib/papel.ts). Every motif is drawn in code,
 * so a new section needs no image file.
 */
export type Motif = 'taco' | 'chilli' | 'agave' | 'lime' | 'corn' | 'star' | 'flower' | 'glass';

export const MOTIFS: readonly Motif[] = ['taco', 'chilli', 'agave', 'lime', 'corn', 'star', 'flower', 'glass'];

/** A painted band colour from app/tailwind.input.css. */
export type Band = 'rosa' | 'verde' | 'anil' | 'marigold' | 'terracotta';

export const BANDS: readonly Band[] = ['rosa', 'verde', 'anil', 'marigold', 'terracotta'];

export interface SizePrice {
  /** e.g. "Glass" or "Pitcher". */
  label: string;
  amount: number;
}

export interface MenuItem {
  /** Unique, URL-safe id used for links such as /menu/#guacamole. */
  id: string;
  /** Spanish name, properly accented, e.g. "Elote asado". */
  name: string;
  /** Plain English description shown under the name. */
  description: string;
  /** One price, or a price per size. Amounts are in `menu.currency`, e.g. 12.5. */
  price: number | SizePrice[];
  /** Chilli heat from 0 (none) to 3 (very hot). Leave out for none. */
  heat?: 0 | 1 | 2 | 3;
  diet?: Diet[];
  badge?: Badge;
  /** Show on the home page "De la casa" band (4–6 items across the menu). */
  featured?: boolean;
  /** Set to true to keep the item listed as "Sold out today" without deleting it. */
  soldOut?: boolean;
  /** Drinks only: true for alcoholic drinks, false for alcohol-free ones. */
  alcohol?: boolean;
  /** Drinks only: the sub-heading it sits under, one of the section's `groups`. */
  group?: string;
}

export type Tortilla = 'corn' | 'flour';

export interface TacoFilling {
  /** Unique, URL-safe id used for links such as /menu/#al-pastor. */
  id: string;
  name: string;
  description: string;
  heat?: 0 | 1 | 2 | 3;
  /** Diet tags for the filling. Corn tortillas are gluten-free ingredients; flour tortillas are not. */
  diet?: Diet[];
  /** Price for one taco. */
  price: number;
  /** Optional price for an order of three. */
  orderOf3?: number;
  /** Which tortillas it comes on. Leave out for both. */
  tortillas?: Tortilla[];
  badge?: Badge;
  featured?: boolean;
  soldOut?: boolean;
}

export interface Salsa {
  id: string;
  name: string;
  /** A few plain words, e.g. "roasted tomatillo and serrano". */
  description: string;
  heat: 0 | 1 | 2 | 3;
  /** Colour of the salsa in its bowl, as a hex colour such as "#6a9a3a". */
  color: string;
  diet?: Diet[];
}

interface SectionBase {
  /** Unique, URL-safe id used for links such as /menu/#tacos. It also seeds the section's banner. */
  id: string;
  /** Spanish title, lettered big on the board. */
  title: string;
  /** English subtitle, e.g. "Small plates". */
  subtitle: string;
  /** Short line under the title. */
  description: string;
  /** Cut-out on the section's papel-picado flags. */
  motif: Motif;
  /** Band colour for the section's board and flags. */
  band: Band;
  /** Optional 2–5 letter nav label for the flag, when the title is long. */
  short?: string;
}

export interface DishSection extends SectionBase {
  kind: 'dishes';
  /** Optional sub-headings, e.g. for drinks. Items list theirs in `group`. */
  groups?: string[];
  items: MenuItem[];
}

/** The taco board: its fillings and tortillas live in `menu.tacos`. */
export interface TacoSection extends SectionBase {
  kind: 'tacos';
}

export type MenuSection = DishSection | TacoSection;

export interface Menu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  /** The menu boards, in order. */
  sections: MenuSection[];
  /** The taco board. */
  tacos: {
    tortillas: Record<Tortilla, { label: string; note: string }>;
    fillings: TacoFilling[];
    /** Small print under the taco board. */
    note: string;
  };
  /** The salsa bar, shown as a row of painted bowls. */
  salsas: Salsa[];
  /** Add-ons, shown in the menu's side panel. */
  extras: { name: string; price: number }[];
  /** Allergy and kitchen notes. Be plain about gluten and nuts. */
  notes: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  sections: [
    {
      kind: 'dishes',
      id: 'antojitos',
      title: 'Antojitos',
      subtitle: 'Small plates to share',
      description: 'Something to start, or a few to share with a round of margaritas.',
      motif: 'corn',
      band: 'marigold',
      items: [
        {
          id: 'guacamole', name: 'Guacamole', price: 13, heat: 1, diet: ['vegan', 'gluten-free'], badge: 'house', featured: true,
          description: 'Avocado crushed to order with lime, white onion, cilantro and serrano, with warm totopos.',
        },
        {
          id: 'elote', name: 'Elote asado', price: 7, heat: 1, diet: ['vegetarian', 'gluten-free'],
          description: 'Grilled corn on the cob with crema, cotija, chile piquín and lime.',
        },
        {
          id: 'queso-fundido', name: 'Queso fundido', price: 12, heat: 1, diet: ['vegetarian'],
          description: 'Melted Chihuahua cheese and roasted poblano rajas in a hot clay dish, with flour tortillas.',
        },
        {
          id: 'ceviche', name: 'Ceviche de pescado', price: 15, heat: 2, diet: ['gluten-free'], soldOut: true,
          description: 'White fish cured in lime with tomato, cucumber, red onion and avocado, on crisp tostadas.',
        },
        {
          id: 'tostadas-de-tinga', name: 'Tostadas de tinga', price: 11, heat: 2, diet: ['gluten-free'],
          description: 'Two crisp tostadas with chipotle-braised chicken, refried beans, crema and queso fresco.',
        },
      ],
    },
    {
      kind: 'tacos',
      id: 'tacos',
      title: 'Tacos',
      subtitle: 'By the taco or by three',
      description: 'Every taco comes on a tortilla pressed to order, with onion, cilantro and lime. Add salsas from the bar.',
      motif: 'taco',
      band: 'rosa',
    },
    {
      kind: 'dishes',
      id: 'platos-fuertes',
      title: 'Platos fuertes',
      subtitle: 'Main plates',
      short: 'Platos',
      description: 'Big plates with rice, beans and warm tortillas.',
      motif: 'chilli',
      band: 'terracotta',
      items: [
        {
          id: 'mole-poblano', name: 'Mole poblano', price: 22, heat: 1, diet: ['contains-nuts'], badge: 'house', featured: true,
          description: 'Chicken leg in the family’s two-day mole of ancho, mulato, chocolate, sesame and peanuts, with rice and tortillas.',
        },
        {
          id: 'enchiladas-verdes', name: 'Enchiladas verdes', price: 17, heat: 2, diet: ['gluten-free'],
          description: 'Three corn tortillas rolled around chicken, bathed in tomatillo salsa, with crema, queso fresco, rice and beans.',
        },
        {
          id: 'pozole-rojo', name: 'Pozole rojo', price: 16, heat: 2, diet: ['gluten-free'],
          description: 'Pork and hominy in a red guajillo broth, with radish, cabbage, oregano and tostadas on the side.',
        },
        {
          id: 'carne-asada', name: 'Carne asada', price: 26, heat: 0, diet: ['gluten-free'], featured: true,
          description: 'Grilled skirt steak with a charred spring onion, guacamole, frijoles charros and tortillas.',
        },
        {
          id: 'calabacitas', name: 'Calabacitas con elote', price: 15, heat: 1, diet: ['vegan', 'gluten-free'], badge: 'new',
          description: 'Squash, corn, poblano and tomato stewed with epazote, with rice, black beans and corn tortillas.',
        },
      ],
    },
    {
      kind: 'dishes',
      id: 'postres',
      title: 'Postres',
      subtitle: 'Desserts',
      description: 'Made in house every day.',
      motif: 'flower',
      band: 'anil',
      items: [
        {
          id: 'churros', name: 'Churros con chocolate', price: 8, diet: ['vegetarian'], featured: true,
          description: 'Fried to order and rolled in cinnamon sugar, with a cup of Mexican hot chocolate for dipping.',
        },
        {
          id: 'flan', name: 'Flan de cajeta', price: 7, diet: ['vegetarian', 'gluten-free'],
          description: 'Silky baked custard under a pool of goat’s-milk caramel.',
        },
        {
          id: 'tres-leches', name: 'Pastel de tres leches', price: 8, diet: ['vegetarian'],
          description: 'Sponge cake soaked in three milks, with whipped cream and fresh strawberries.',
        },
      ],
    },
    {
      kind: 'dishes',
      id: 'bebidas',
      title: 'Bebidas',
      subtitle: 'Drinks',
      description: 'Aguas frescas by the glass or the jug, margaritas, cerveza, mezcal and plenty without alcohol.',
      motif: 'glass',
      band: 'verde',
      groups: ['Aguas frescas', 'Margaritas', 'Cerveza', 'Mezcal y tequila', 'Sin alcohol'],
      items: [
        {
          id: 'agua-de-jamaica', name: 'Agua de jamaica', group: 'Aguas frescas', alcohol: false, diet: ['vegan', 'gluten-free'],
          price: [{ label: 'Glass', amount: 4 }, { label: 'Jug', amount: 14 }],
          description: 'Hibiscus flowers steeped and chilled, tart and ruby red.',
        },
        {
          id: 'horchata', name: 'Horchata', group: 'Aguas frescas', alcohol: false, diet: ['vegan', 'gluten-free'],
          price: [{ label: 'Glass', amount: 4 }, { label: 'Jug', amount: 14 }],
          description: 'Rice, cinnamon and vanilla, blended and strained. Made without dairy.',
        },
        {
          id: 'agua-de-tamarindo', name: 'Agua de tamarindo', group: 'Aguas frescas', alcohol: false, diet: ['vegan', 'gluten-free'],
          price: [{ label: 'Glass', amount: 4 }, { label: 'Jug', amount: 14 }],
          description: 'Sweet-sour tamarind pods simmered, sieved and served over ice.',
        },
        {
          id: 'margarita-de-la-casa', name: 'Margarita de la casa', group: 'Margaritas', alcohol: true, badge: 'house', featured: true,
          price: [{ label: 'Glass', amount: 11 }, { label: 'Pitcher', amount: 42 }],
          description: 'Blanco tequila, fresh lime and agave, shaken hard and poured over ice with a salt rim.',
        },
        {
          id: 'margarita-de-tamarindo', name: 'Margarita de tamarindo y chile', group: 'Margaritas', alcohol: true, badge: 'seasonal', heat: 1,
          price: [{ label: 'Glass', amount: 13 }],
          description: 'Reposado tequila, tamarind and lime with a chile-salt rim. Here while the tamarind lasts.',
        },
        {
          id: 'cerveza-de-barril', name: 'Cerveza de barril', group: 'Cerveza', alcohol: true,
          price: [{ label: 'Pint', amount: 7 }],
          description: 'Mexican-style lager on draft, ice cold, with a wedge of lime.',
        },
        {
          id: 'michelada', name: 'Michelada', group: 'Cerveza', alcohol: true, heat: 2,
          price: 10,
          description: 'Lager with lime, salsa negra and tomato over ice, in a chile-salt rimmed glass.',
        },
        {
          id: 'vuelo-de-mezcal', name: 'Vuelo de mezcal', group: 'Mezcal y tequila', alcohol: true,
          price: 24,
          description: 'A flight of three ¾-ounce pours: espadín, tobalá and an ensamble, with orange and sal de gusano.',
        },
        {
          id: 'tequila-reposado', name: 'Tequila reposado', group: 'Mezcal y tequila', alcohol: true,
          price: [{ label: 'Pour', amount: 10 }],
          description: 'Rested in oak for a few months: soft, vanilla and agave. Ask about the shelf.',
        },
        {
          id: 'limonada-de-pepino', name: 'Limonada de pepino', group: 'Sin alcohol', alcohol: false, diet: ['vegan', 'gluten-free'],
          price: 5,
          description: 'Cucumber, lime and mint, topped with sparkling water.',
        },
        {
          id: 'refresco', name: 'Refresco mexicano', group: 'Sin alcohol', alcohol: false, diet: ['vegan', 'gluten-free'],
          price: 4,
          description: 'Mexican sodas in glass bottles: tamarind, mandarin or grapefruit.',
        },
        {
          id: 'cafe-de-olla', name: 'Café de olla', group: 'Sin alcohol', alcohol: false, diet: ['vegan', 'gluten-free'],
          price: 4,
          description: 'Coffee simmered in a clay pot with piloncillo, cinnamon and orange peel.',
        },
      ],
    },
  ],
  tacos: {
    tortillas: {
      corn: { label: 'Corn', note: 'Masa pressed in house. Gluten-free ingredients.' },
      flour: { label: 'Flour', note: 'Made with vegetable shortening. Contains wheat.' },
    },
    fillings: [
      {
        id: 'al-pastor', diet: ['gluten-free'], name: 'Al pastor', price: 4, orderOf3: 11, heat: 1, badge: 'house', featured: true,
        description: 'Pork marinated in achiote and guajillo, shaved from the trompo, with pineapple.',
      },
      {
        id: 'carnitas', diet: ['gluten-free'], name: 'Carnitas', price: 4, orderOf3: 11, heat: 1,
        description: 'Pork slow-cooked until tender and crisp at the edges, with salsa verde.',
      },
      {
        id: 'suadero', diet: ['gluten-free'], name: 'Suadero', price: 4.5, orderOf3: 12.5, heat: 0,
        description: 'Brisket confited and crisped on the plancha, Mexico City style.',
      },
      {
        id: 'barbacoa', diet: ['gluten-free'], name: 'Barbacoa', price: 4.5, orderOf3: 12.5, heat: 1,
        description: 'Beef cheek braised overnight with guajillo and bay, with consommé for dipping.',
      },
      {
        id: 'pescado', name: 'Pescado estilo Baja', price: 5, orderOf3: 14, heat: 1, tortillas: ['flour', 'corn'],
        description: 'Beer-battered white fish, cabbage, pickled onion and chipotle crema. Battered in wheat flour.',
      },
      {
        id: 'camaron-a-la-diabla', diet: ['gluten-free'], name: 'Camarón a la diabla', price: 5.5, orderOf3: 15, heat: 3,
        description: 'Shrimp in a fiery sauce of chile de árbol and chipotle, with cabbage and lime.',
      },
      {
        id: 'hongos', name: 'Hongos al ajillo', price: 4, orderOf3: 11, heat: 2, diet: ['vegetarian', 'gluten-free'],
        description: 'Oyster and cremini mushrooms with garlic, guajillo and epazote, topped with queso fresco.',
      },
      {
        id: 'coliflor-al-pastor', name: 'Coliflor al pastor', price: 4, orderOf3: 11, heat: 1, diet: ['vegan', 'gluten-free'], badge: 'new',
        description: 'Roasted cauliflower in our al pastor marinade, with pineapple and salsa verde.',
      },
    ],
    note: 'Fillings marked GF are gluten-free ingredients on corn tortillas. Flour tortillas and the battered fish contain wheat.',
  },
  salsas: [
    { id: 'salsa-verde', name: 'Salsa verde', description: 'roasted tomatillo and serrano', heat: 1, color: '#6f9b3c', diet: ['vegan', 'gluten-free'] },
    { id: 'pico-de-gallo', name: 'Pico de gallo', description: 'fresh tomato, onion, cilantro and jalapeño', heat: 1, color: '#d4523a', diet: ['vegan', 'gluten-free'] },
    { id: 'salsa-roja', name: 'Salsa roja', description: 'charred tomato and chile de árbol', heat: 2, color: '#a92b1d', diet: ['vegan', 'gluten-free'] },
    { id: 'salsa-de-habanero', name: 'Habanero', description: 'habanero, carrot and lime', heat: 3, color: '#ee8a1f', diet: ['vegan', 'gluten-free'] },
    { id: 'salsa-macha', name: 'Salsa macha', description: 'dried chiles fried in oil with peanuts and sesame', heat: 3, color: '#7a2c17', diet: ['vegan', 'gluten-free', 'contains-nuts'] },
  ],
  extras: [
    { name: 'Extra tortillas (3)', price: 1.5 },
    { name: 'Guacamole on the side', price: 4 },
    { name: 'Chorizo in the queso fundido', price: 3 },
    { name: 'Rice and black beans', price: 4 },
    { name: 'Crema or queso fresco', price: 1 },
    { name: 'Chips and salsa refill', price: 0 },
  ],
  notes: [
    'GF marks dishes made with gluten-free ingredients. We share one kitchen and one fryer with flour tortillas and battered fish, so we can’t promise anything is free from traces of gluten.',
    'The mole and the salsa macha contain peanuts and sesame. Please tell us about any allergy when you order.',
    'Our beans are cooked without lard, and the kitchen can make most dishes milder. Just ask.',
  ],
};

// ---------------------------------------------------------------------------------------------
// Helpers used by the pages. You shouldn't need to edit below this line.
// ---------------------------------------------------------------------------------------------

/** Sections with dish rows. */
export const dishSections: DishSection[] = menu.sections.filter((section): section is DishSection => section.kind === 'dishes');

/** Every dish and drink, in menu order. */
export const allDishes: MenuItem[] = dishSections.flatMap(section => section.items);

/** A menu item or a taco filling: anything with an id, name, price and description. */
export type AnyItem = MenuItem | TacoFilling;

/** Everything a visitor can order, in menu order (tacos sit where the taco board is). */
export const allItems: AnyItem[] = menu.sections.flatMap(section => section.kind === 'tacos' ? menu.tacos.fillings : section.items);

/** Items shown on the home page "De la casa" band. */
export const featuredItems: AnyItem[] = allItems.filter(item => item.featured);

export function findItem(id: string): AnyItem | undefined {
  return allItems.find(item => item.id === id);
}

export function isFilling(item: AnyItem): item is TacoFilling {
  return menu.tacos.fillings.includes(item as TacoFilling);
}

/** The section an item belongs to. */
export function sectionOf(item: AnyItem): MenuSection {
  return menu.sections.find(section => section.kind === 'tacos' ? isFilling(item) : section.items.includes(item as MenuItem))!;
}

const formatter = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });

/** "$16.50", or "$16" for whole amounts. */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** The normal price of an item, or of one size of it ("Glass", or "Taco" / "Order of 3" for fillings). */
export function priceOf(item: AnyItem, size?: string): number | undefined {
  if (isFilling(item)) {
    if (!size || size === 'Taco') return item.price;
    return size === 'Order of 3' ? item.orderOf3 : undefined;
  }
  if (typeof item.price === 'number') return size ? undefined : item.price;
  return size ? item.price.find(entry => entry.label === size)?.amount : item.price[0]?.amount;
}

/** Lowest price, for compact rows. */
export function startingPrice(item: AnyItem): number {
  if (isFilling(item)) return item.price;
  return typeof item.price === 'number' ? item.price : Math.min(...item.price.map(size => size.amount));
}

/** Tortillas a filling comes on. */
export function tortillasFor(filling: TacoFilling): Tortilla[] {
  return filling.tortillas ?? ['corn', 'flour'];
}

/** Diet tags for any item. */
export function itemDiets(item: AnyItem): Diet[] {
  return item.diet ?? [];
}

export interface ResolvedSpecial {
  title: string;
  name: string;
  description: string;
  price?: number;
  /** The menu item it points at, for a /menu/#id link. */
  item?: AnyItem;
}

/** A special with its item's name, description and price filled in. */
export function resolveSpecial(special: DailySpecial): ResolvedSpecial {
  const item = special.item ? findItem(special.item) : undefined;
  return {
    title: special.title,
    name: special.name ?? item?.name ?? special.title,
    description: special.description ?? item?.description ?? '',
    price: special.price ?? (item ? startingPrice(item) : undefined),
    item,
  };
}
