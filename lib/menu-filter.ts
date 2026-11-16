import type { Diet } from '../content/menu';

/** Filters offered on the menu page. Each one narrows the menu; several together must all match. */
export type MenuFilter = 'vegetarian' | 'vegan' | 'mild' | 'no-alcohol';

export const MENU_FILTERS: { id: MenuFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'mild', label: 'Mild' },
  { id: 'no-alcohol', label: 'No alcohol' },
];

/** What a filter needs to know about an item. */
export interface FilterFacts {
  diets: readonly Diet[];
  heat?: number;
  /** true for alcoholic drinks; food and alcohol-free drinks leave it out or set false. */
  alcohol?: boolean;
}

/** "Mild" means at most one chilli. */
export const MILD_MAX_HEAT = 1;

/** Vegan items count as vegetarian even when not tagged twice. */
export function matchesFilter(item: FilterFacts, filter: MenuFilter): boolean {
  switch (filter) {
    case 'vegan': return item.diets.includes('vegan');
    case 'vegetarian': return item.diets.includes('vegetarian') || item.diets.includes('vegan');
    case 'mild': return (item.heat ?? 0) <= MILD_MAX_HEAT;
    case 'no-alcohol': return !item.alcohol;
  }
}

export function matchesAll(item: FilterFacts, filters: readonly MenuFilter[]): boolean {
  return filters.every(filter => matchesFilter(item, filter));
}
