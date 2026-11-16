// Happy-hour deals resolved against the menu, so pages can show "Margarita de la casa · glass $11 → $7".
import { happyHour, type HappyHourDeal } from '../content/cantina.ts';
import { findItem, formatPrice, priceOf, type AnyItem } from '../content/menu.ts';

export interface ResolvedDeal {
  /** Stable React key. */
  key: string;
  /** What's on offer, e.g. "Margarita de la casa" or "$2 off draft cerveza". */
  label: string;
  /** e.g. "Glass" or "Taco". */
  size?: string;
  /** Happy-hour price. */
  price?: number;
  /** Normal price of the same size, for comparison. */
  normal?: number;
  /** The menu item, for a /menu/#id link. */
  item?: AnyItem;
}

export function resolveDeal(deal: HappyHourDeal): ResolvedDeal {
  if ('item' in deal) {
    const item = findItem(deal.item);
    return {
      key: `${deal.item}-${deal.size ?? ''}`,
      label: item?.name ?? deal.item,
      size: deal.size,
      price: deal.price,
      normal: item ? priceOf(item, deal.size) : undefined,
      item,
    };
  }
  return { key: deal.label, label: deal.label, price: deal.price };
}

export const deals: ResolvedDeal[] = happyHour.deals.map(resolveDeal);

/** Happy-hour prices for one menu item, e.g. [{ size: 'Glass', price: 7 }]. */
export function happyHourPrices(id: string): { size?: string; price: number }[] {
  return happyHour.deals.flatMap(deal => 'item' in deal && deal.item === id ? [{ size: deal.size, price: deal.price }] : []);
}

/** "Happy hour $7" or "Happy hour glass $7". */
export function happyHourLabel(id: string): string | undefined {
  const prices = happyHourPrices(id);
  if (!prices.length) return undefined;
  return prices.map(p => `${p.size ? `${p.size.toLowerCase()} ` : ''}${formatPrice(p.price)}`).join(', ');
}
