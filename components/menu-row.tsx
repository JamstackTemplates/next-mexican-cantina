import { BADGES, formatPrice, isFilling, itemDiets, type AnyItem } from '../content/menu';
import { happyHourPrices } from '../lib/deals';
import { DietMarks, HeatMeter } from './painted';
import { SiteLink } from './site-link';

/** "Glass $4 · Jug $14", "Taco $4 · Order of 3 $11", or a single price tag. */
export function Price({ item }: { item: AnyItem }) {
  const sizes = isFilling(item)
    ? [{ label: 'Taco', amount: item.price }, ...(item.orderOf3 ? [{ label: 'Order of 3', amount: item.orderOf3 }] : [])]
    : typeof item.price === 'number' ? null : item.price;
  if (!sizes) return <span className="price-tag text-[1.05rem]">{formatPrice(item.price as number)}</span>;
  return (
    <span className="flex flex-wrap justify-end gap-x-2 gap-y-1 text-[.98rem]">
      {sizes.map(size => (
        <span key={size.label} className="price-tag"><span className="text-[.78rem] font-semibold opacity-80">{size.label}</span> {formatPrice(size.amount)}</span>
      ))}
    </span>
  );
}

/** Happy-hour prices, shown beside the normal price. They light up while happy hour is on. */
export function HappyHourPrice({ id }: { id: string }) {
  const prices = happyHourPrices(id);
  if (!prices.length) return null;
  return (
    <span className="hh-price inline-flex items-center gap-1.5 rounded-md border-[1.5px] border-band-accent px-2 py-0.5 text-[.82rem] font-bold">
      Happy hour {prices.map(p => `${p.size ? `${p.size.toLowerCase()} ` : ''}${formatPrice(p.price)}`).join(' · ')}
    </span>
  );
}

/**
 * One row on a painted menu board: the Spanish name and price on one line with a dotted leader, the
 * English description below, then heat, diet marks and badges. On the home page the name links to the
 * item on the menu; on the menu the row is the anchor (`id`).
 */
export function MenuRow({ item, link = false, as: Tag = 'li' }: { item: AnyItem; link?: boolean; as?: 'li' | 'div' }) {
  const soldOut = !!item.soldOut;
  const alcoholFree = 'alcohol' in item && item.alcohol === false;
  return (
    <Tag id={link ? undefined : item.id} className="menu-row" data-sold-out={soldOut || undefined}>
      <div className="flex items-baseline gap-2">
        <h3 className="menu-name text-[1.15rem] leading-snug font-bold sm:text-[1.22rem]">
          {link ? <SiteLink href={`/menu/#${item.id}`} className="band-link no-underline hover:underline">{item.name}</SiteLink> : item.name}
        </h3>
        <span className="menu-leader" aria-hidden="true" />
        <Price item={item} />
      </div>
      <p className="max-w-[46ch] text-[.98rem] leading-normal text-band-muted">{item.description}</p>
      {soldOut || item.badge || item.heat || itemDiets(item).length || alcoholFree || happyHourPrices(item.id).length ? (
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {soldOut ? <span className="mark mark-soldout">Sold out today</span> : null}
          {item.badge ? <span className="mark">{BADGES[item.badge]}</span> : null}
          {item.heat ? <HeatMeter heat={item.heat} /> : null}
          <DietMarks diets={itemDiets(item)} />
          {alcoholFree ? <span className="text-[.8rem] font-semibold tracking-wide text-band-muted uppercase">Alcohol-free</span> : null}
          <HappyHourPrice id={item.id} />
        </p>
      ) : null}
    </Tag>
  );
}
