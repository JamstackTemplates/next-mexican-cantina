import type { CSSProperties, ReactNode } from 'react';
import type { Band, MenuSection, Motif } from '../content/menu';
import { FLAG_SIZE, flagDesign, flagWidthCss, type FlagDesign } from '../lib/papel';

export interface FlagSpec {
  /** Seeds the cut pattern, e.g. "tacos#2". The same key always gives the same flag. */
  key: string;
  motif: Motif;
  band: Band;
}

const FLAG_COLOR: Record<Band, string> = {
  rosa: 'var(--flag-rosa)',
  verde: 'var(--flag-verde)',
  anil: 'var(--flag-anil)',
  marigold: 'var(--flag-marigold)',
  terracotta: 'var(--flag-terracotta)',
};

/** Flags cycling through the menu sections: each in its section's colour, cut with its section's motif. */
export function cycleSections(sections: readonly Pick<MenuSection, 'id' | 'motif' | 'band'>[], count: number, skip: Band[] = []): FlagSpec[] {
  const usable = sections.filter(section => !skip.includes(section.band));
  return Array.from({ length: count }, (_, i) => {
    const section = usable[i % usable.length];
    return { key: `${section.id}#${Math.floor(i / usable.length)}`, motif: section.motif, band: section.band };
  });
}

/** One cut-paper flag as an SVG mask over a rectangle of colour. */
export function Flag({ design, maskId }: { design: FlagDesign; maskId: string }) {
  return (
    <svg viewBox={`0 0 ${design.width} ${design.height}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={design.width} height={design.height}>
          <path d={design.outline} fill="#fff" />
          {design.ops.map((op, i) => <path key={i} d={op.d} transform={op.transform} fill={op.kind === 'cut' ? '#000' : '#fff'} />)}
        </mask>
      </defs>
      <rect width={design.width} height={design.height} fill="var(--flag)" mask={`url(#${maskId})`} />
      {/* The hem folded over the string. */}
      <rect width={design.width} height="4" y="3" fill="#000" opacity=".12" />
    </svg>
  );
}

/**
 * A string of papel-picado flags. Decorative by default (hidden from assistive tech); flags keep a
 * sensible width on every screen (lib/papel.ts FLAG_SIZE), and extra flags are clipped at the edges.
 * String lights between the flags only show in dark mode.
 */
export function PapelBanner({ flags, idPrefix, className = '', style }: {
  flags: FlagSpec[];
  /** Unique on the page: mask ids are built from it. */
  idPrefix: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`papel print:hidden ${className}`} aria-hidden="true"
      style={{ '--flag-w': flagWidthCss(), '--flag-gap': `${FLAG_SIZE.gap}px`, ...style } as CSSProperties}>
      <span className="papel__string" />
      {flags.map((flag, i) => (
        <span key={`${flag.key}-${i}`} className="papel__flag" style={{ '--i': i, '--flag': FLAG_COLOR[flag.band] } as CSSProperties}>
          <span className="papel__bulb" style={{ left: `calc(var(--flag-gap) / -2)` }} />
          <Flag design={flagDesign(flag.key, flag.motif)} maskId={`${idPrefix}-${i}`} />
        </span>
      ))}
    </div>
  );
}

/**
 * Section navigation as a papel-picado banner: one flag per menu section, each a link to its board.
 * The flags share the row, never wider than a normal flag (see navFlagWidth in lib/papel.ts).
 */
export function PapelNav({ sections, label, after }: {
  sections: readonly MenuSection[];
  label: string;
  after?: ReactNode;
}) {
  const count = sections.length;
  return (
    <nav aria-label={label} className="relative print:hidden">
      <span className="papel__string" aria-hidden="true" />
      <ul className="relative flex justify-between gap-(--flag-gap) pt-1.5"
        style={{ '--flag-gap': `${FLAG_SIZE.gap}px`, '--flag-w': `min(${FLAG_SIZE.max + 18}px, calc((100% - ${FLAG_SIZE.gap * (count - 1)}px) / ${count}))` } as CSSProperties}>
        {sections.map((section, i) => (
          <li key={section.id} className="w-(--flag-w) flex-none">
            <a href={`#${section.id}`} className="group block no-underline">
              <span className="papel__flag w-full" style={{ '--i': i, '--flag': FLAG_COLOR[section.band] } as CSSProperties}>
                <span className="papel__bulb" aria-hidden="true" style={{ left: `calc(var(--flag-gap) / -2)` }} />
                <Flag design={flagDesign(`${section.id}#nav`, section.motif)} maskId={`nav-${section.id}`} />
              </span>
              <span className="mt-1.5 block text-center text-[clamp(.78rem,2.6vw,.95rem)] leading-tight font-bold text-ink group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                {section.short ?? section.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {after}
    </nav>
  );
}
