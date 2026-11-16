'use client';

import { useEffect, useState } from 'react';
import { happyHour } from '../content/cantina';
import {
  BADGES, formatPrice, itemDiets, menu, tortillasFor, type AnyItem, type Band, type DishSection, type MenuItem, type MenuSection, type TacoFilling,
} from '../content/menu';
import { happyHourState } from '../lib/hours';
import { MENU_FILTERS, matchesAll, type MenuFilter } from '../lib/menu-filter';
import { Icon } from './icons';
import { HappyHourPrice, MenuRow } from './menu-row';
import { DietMarks, HeatMeter } from './painted';
import { PapelBanner } from './papel-banner';
import { useCantinaClock } from './use-cantina-clock';

// Written out in full so Tailwind finds every class.
const BAND_CLASS: Record<Band, string> = {
  rosa: 'band-rosa',
  verde: 'band-verde',
  anil: 'band-anil',
  marigold: 'band-marigold',
  terracotta: 'band-terracotta',
};

const facts = (item: AnyItem) => ({ diets: itemDiets(item), heat: item.heat, alcohol: 'alcohol' in item ? item.alcohol : undefined });

function TacoBoard({ fillings }: { fillings: TacoFilling[] }) {
  const { tortillas } = menu.tacos;
  const cell = 'px-2 py-3.5 align-top sm:px-3';
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Taco fillings, the tortillas they come on, and prices per taco and per order of three</caption>
      <thead>
        <tr className="border-b-[3px] border-band-line text-[.8rem] font-bold tracking-[.12em] text-band-muted uppercase">
          <th scope="col" className={`${cell} pl-0`}>Relleno <span className="font-semibold normal-case tracking-normal">· filling</span></th>
          <th scope="col" className={`${cell} text-center max-sm:hidden`}>{tortillas.corn.label}</th>
          <th scope="col" className={`${cell} text-center max-sm:hidden`}>{tortillas.flour.label}</th>
          <th scope="col" className={`${cell} text-right`}>Taco</th>
          <th scope="col" className={`${cell} pr-0 text-right whitespace-nowrap`}>Orden de 3</th>
        </tr>
      </thead>
      <tbody>
        {fillings.map(filling => {
          const on = tortillasFor(filling);
          const soldOut = !!filling.soldOut;
          return (
            <tr key={filling.id} id={filling.id} className="menu-row table-row border-b-2 border-dotted border-band-line last:border-b-0" data-sold-out={soldOut || undefined}>
              <th scope="row" className={`${cell} pl-0 font-normal`}>
                <span className="menu-name block text-[1.15rem] leading-snug font-bold sm:text-[1.22rem]">{filling.name}</span>
                <span className="mt-0.5 block max-w-[44ch] text-[.95rem] leading-normal text-band-muted">{filling.description}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  {soldOut ? <span className="mark mark-soldout">Sold out today</span> : null}
                  {filling.badge ? <span className="mark">{BADGES[filling.badge]}</span> : null}
                  {filling.heat ? <HeatMeter heat={filling.heat} /> : null}
                  <DietMarks diets={itemDiets(filling)} />
                  <span className="text-[.82rem] font-semibold text-band-muted sm:hidden">{on.map((t, i) => i ? tortillas[t].label.toLowerCase() : tortillas[t].label).join(' or ')}</span>
                  <HappyHourPrice id={filling.id} />
                </span>
              </th>
              {(['corn', 'flour'] as const).map(tortilla => (
                <td key={tortilla} className={`${cell} text-center max-sm:hidden`}>
                  {on.includes(tortilla)
                    ? <span className="inline-block size-3.5 translate-y-1.5 rounded-full bg-current" title={`On ${tortillas[tortilla].label.toLowerCase()}`}><span className="sr-only">Yes</span></span>
                    : <span className="text-band-muted" title={`Not on ${tortillas[tortilla].label.toLowerCase()}`}>–<span className="sr-only">No</span></span>}
                </td>
              ))}
              <td className={`${cell} text-right`}><span className="price-tag text-[1.05rem]">{formatPrice(filling.price)}</span></td>
              <td className={`${cell} pr-0 text-right`}>{filling.orderOf3 ? <span className="price-tag text-[1.05rem]">{formatPrice(filling.orderOf3)}</span> : <span className="text-band-muted">–</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DishRows({ section, items }: { section: DishSection; items: MenuItem[] }) {
  const grid = 'grid gap-x-12 md:grid-cols-2';
  if (!section.groups?.length) {
    return <ul className={grid}>{items.map(item => <MenuRow key={item.id} item={item} />)}</ul>;
  }
  return (
    <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
      {section.groups.map(group => {
        const rows = items.filter(item => item.group === group);
        if (!rows.length) return null;
        return (
          <div key={group}>
            <h3 className="mt-2 border-b-[3px] border-band-line pb-1.5 text-[.85rem] font-bold tracking-[.16em] text-band-accent uppercase">{group}</h3>
            <ul>{rows.map(item => <MenuRow key={item.id} item={item} />)}</ul>
          </div>
        );
      })}
    </div>
  );
}

function Board({ section, filters }: { section: MenuSection; filters: MenuFilter[] }) {
  const items: AnyItem[] = section.kind === 'tacos' ? menu.tacos.fillings : section.items;
  const shown = items.filter(item => matchesAll(facts(item), filters));
  return (
    <section id={section.id} className="scroll-mt-16 pt-4" aria-labelledby={`${section.id}-title`}>
      <PapelBanner idPrefix={`${section.id}-flag`} className="mb-1.5"
        flags={Array.from({ length: 16 }, (_, i) => ({ key: `${section.id}#${i}`, motif: section.motif, band: section.band }))} />
      <div className={`${BAND_CLASS[section.band]} wash plaque px-[clamp(1.1rem,3.5vw,2.75rem)] pt-[clamp(2rem,4vw,3rem)] pb-[clamp(1.25rem,3vw,2.25rem)] max-sm:-mx-(--gutter) max-sm:rounded-none`}>
        <header className="mb-4 grid gap-1">
          <p className="eyebrow text-band-muted">{section.subtitle}</p>
          <h2 id={`${section.id}-title`} className="lettered mt-1 text-[clamp(2.4rem,6vw,4rem)]">{section.title}</h2>
          <p className="max-w-(--measure) text-band-muted">{section.description}</p>
        </header>
        {shown.length ? (
          section.kind === 'tacos'
            ? <>
                <TacoBoard fillings={shown as TacoFilling[]} />
                <p className="mt-4 border-t-[3px] border-band-line pt-3 text-[.9rem] text-band-muted">
                  {menu.tacos.tortillas.corn.label}: {menu.tacos.tortillas.corn.note} {menu.tacos.tortillas.flour.label}: {menu.tacos.tortillas.flour.note} {menu.tacos.note}
                </p>
              </>
            : <DishRows section={section} items={shown as MenuItem[]} />
        ) : (
          <p className="rounded-lg border-2 border-dashed border-band-line p-5">Nothing here matches those filters. Ask us: the kitchen can often leave something off.</p>
        )}
      </div>
    </section>
  );
}

/**
 * The menu boards with filters. The full menu is always in the static HTML; filtering is a progressive
 * enhancement that appears once JavaScript runs and only hides non-matching rows. While happy hour is on,
 * data-happy="on" lights up the happy-hour prices.
 */
export function MenuBoard() {
  const [filters, setFilters] = useState<MenuFilter[]>([]);
  const [ready, setReady] = useState(false);
  const now = useCantinaClock();
  const happy = now ? happyHourState(now.day, now.minutes, happyHour).status === 'on' : false;
  useEffect(() => setReady(true), []);

  const total = menu.sections.reduce((sum, section) =>
    sum + (section.kind === 'tacos' ? menu.tacos.fillings : section.items).filter(item => matchesAll(facts(item), filters)).length, 0);
  const toggle = (id: MenuFilter) =>
    setFilters(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);

  return (
    <div data-happy={now ? (happy ? 'on' : 'off') : undefined}>
      <div hidden={!ready} className="sticky top-[calc(var(--header-h)+8px)] z-20 -mx-1 mb-2 bg-bg/92 px-1 py-2.5 backdrop-blur-md print:hidden">
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto" role="group" aria-label="Menu filters">
          <span className="inline-flex items-center gap-1.5 pr-1 text-[.88rem] font-bold whitespace-nowrap text-muted"><Icon name="filter" width={16} height={16} />Show only</span>
          {MENU_FILTERS.map(filter => (
            <button key={filter.id} type="button" aria-pressed={filters.includes(filter.id)} onClick={() => toggle(filter.id)}
              className="min-h-10 rounded-[8px_11px_7px_10px] border-2 border-ink px-3.5 text-[.92rem] font-semibold whitespace-nowrap hover:bg-surface-2 aria-pressed:bg-ink aria-pressed:text-bg">
              {filter.label}
            </button>
          ))}
          {filters.length ? (
            <button type="button" className="min-h-10 px-2 text-[.9rem] font-semibold whitespace-nowrap text-accent underline underline-offset-4" onClick={() => setFilters([])}>Clear</button>
          ) : null}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{filters.length ? `${total} items match.` : ''}</p>
      </div>
      <div className="grid grid-cols-1 gap-[clamp(2rem,5vw,3.5rem)]">
        {menu.sections.map(section => <Board key={section.id} section={section} filters={filters} />)}
      </div>
    </div>
  );
}
