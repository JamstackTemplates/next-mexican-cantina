import type { Metadata } from 'next';
import { HappyHourSign, StatusLine, TodayHours } from '../../components/cantina-status';
import { Icon } from '../../components/icons';
import { MenuBoard } from '../../components/menu-board';
import { DietMarks, HeatMeter, SalsaBowl } from '../../components/painted';
import { PapelNav } from '../../components/papel-banner';
import { SiteLink } from '../../components/site-link';
import { cantina } from '../../content/cantina';
import { DIETS, formatPrice, menu, type Diet } from '../../content/menu';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `Antojitos, tacos, platos fuertes, postres and bebidas at ${cantina.name}, with heat levels, vegetarian and vegan options and happy-hour prices.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

/** Salsas, extras and allergy notes: a side panel on desktop, a collapsible panel on phones. */
function MenuNotes() {
  const subhead = 'lettered text-[1.5rem]';
  return (
    <div className="grid gap-6">
      <div>
        <h2 className={subhead}>Salsas</h2>
        <ul className="mt-2">
          {menu.salsas.map(salsa => (
            <li key={salsa.id} className="flex items-center gap-3 border-b-2 border-dotted border-line py-2">
              <SalsaBowl color={salsa.color} heat={salsa.heat} size={46} className="flex-none" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{salsa.name}</span>
                <span className="block text-[.85rem] leading-snug text-muted">{salsa.description}</span>
              </span>
              <span className="grid justify-items-end gap-1 text-accent">
                <HeatMeter heat={salsa.heat} size={14} />
                {salsa.diet?.includes('contains-nuts') ? <DietMarks diets={['contains-nuts']} /> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={subhead}>Extras</h2>
        <ul className="mt-2">
          {menu.extras.map(extra => (
            <li key={extra.name} className="flex justify-between gap-4 border-b-2 border-dotted border-line py-2 text-[.95rem]">
              <span>{extra.name}</span>
              <span className="font-bold whitespace-nowrap tabular-nums">{extra.price ? `+${formatPrice(extra.price)}` : 'Free'}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-2.5 text-[.92rem] text-muted">
        <h2 className={`${subhead} text-ink`}>Allergies</h2>
        <ul className="grid gap-1.5 text-ink">
          {(Object.keys(DIETS) as Diet[]).map(diet => (
            <li key={diet} className="flex items-center gap-2"><DietMarks diets={[diet]} /> {DIETS[diet].label}</li>
          ))}
          <li className="flex items-center gap-2"><HeatMeter heat={1} size={14} className="text-accent" /> One to three chillies: the heat</li>
        </ul>
        {menu.notes.map(note => <p key={note}>{note}</p>)}
        <p><SiteLink href="/contact/" className="text-link">Feeding a group? Tell us</SiteLink></p>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <>
      <header className="wrap pt-[clamp(2rem,5vw,3.5rem)]">
        <div className="grid items-end gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="eyebrow text-accent">Menu</p>
            <h1 className="sign-name lettered mt-2 text-[clamp(3rem,8vw,5.4rem)]">El menú</h1>
            <p className="mt-3 max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)] text-muted">
              Spanish names, plain English underneath. Chillies show the heat, and the kitchen can make most things milder. Tortillas
              pressed to order, salsas made this morning.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1">
            <div className="band-verde plaque grid gap-1.5 px-5 py-4">
              <StatusLine className="text-[1.08rem] font-bold" />
              <TodayHours className="text-[.92rem] text-band-muted" />
            </div>
            <div className="band-rosa plaque grid place-items-center p-3">
              <HappyHourSign className="w-full" />
            </div>
          </div>
        </div>
        <div className="mt-[clamp(1.5rem,4vw,2.5rem)]">
          <PapelNav sections={menu.sections} label="Menu sections" />
        </div>
      </header>

      <div className="wrap grid grid-cols-1 items-start gap-x-[clamp(1.5rem,3.5vw,3rem)] pt-6 pb-(--space-band) lg:grid-cols-[minmax(0,1fr)_18rem]">
        <details className="mb-4 rounded-card border-2 border-ink bg-surface lg:hidden print:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 font-bold">
            Salsas, extras &amp; allergies <Icon name="chevron" width={20} height={20} />
          </summary>
          <div className="border-t-2 border-dotted border-line px-4 pt-3 pb-5"><MenuNotes /></div>
        </details>

        <MenuBoard />

        <aside className="sticky top-[calc(var(--header-h)+1.5rem)] mt-[4.25rem] max-h-[calc(100vh-var(--header-h)-2.5rem)] overflow-y-auto rounded-card border-2 border-ink bg-surface p-5 shadow-[6px_8px_0_var(--surface-2)] max-lg:hidden" aria-label="Salsas, extras and allergies">
          <MenuNotes />
        </aside>
      </div>
    </>
  );
}
