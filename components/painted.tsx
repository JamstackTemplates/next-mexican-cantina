// Small painted illustrations: the heat meter, salsa bowls, band ornaments and diet marks.
// Inline SVG coloured by CSS tokens (or the current text colour), so they change with light/dark
// and with the band they sit on. No image files.
import type { CSSProperties } from 'react';
import { DIETS, type Diet } from '../content/menu';

const HEAT_LABELS = ['No heat', 'Mild', 'Medium heat', 'Very hot'] as const;

const chilli = 'M2.5 12.5C5 13.6 10.6 12.6 14 7.6c1.1-1.7-.3-3.1-1.8-1.9C9.4 8 5.6 9.9 2 10.7c-.8.2-.6 1.5.5 1.8z';

/** 0–3 chillies in the current text colour. Filled chillies show the heat; the rest are faint outlines. */
export function HeatMeter({ heat = 0, className = '', size = 17 }: { heat?: number; className?: string; size?: number }) {
  const level = Math.max(0, Math.min(3, Math.round(heat)));
  return (
    <span className={`inline-flex items-center ${className}`} role="img" aria-label={HEAT_LABELS[level]} title={HEAT_LABELS[level]}>
      {[1, 2, 3].map(n => (
        <svg key={n} viewBox="0 0 18 16" width={size} height={size * 16 / 18} aria-hidden="true" focusable="false">
          <path d={chilli} fill={n <= level ? 'currentColor' : 'none'} stroke="currentColor" strokeOpacity={n <= level ? 1 : .4} strokeWidth="1.3" />
          <path d="M13.4 5.4c.5-1.4 1.6-2.4 3-2.6" fill="none" stroke="currentColor" strokeOpacity={n <= level ? 1 : .4} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}
    </span>
  );
}

/** VG, V, GF, N as small stamped letters, with the full meaning in a tooltip and for screen readers. */
export function DietMarks({ diets, className = '' }: { diets: readonly Diet[]; className?: string }) {
  if (!diets.length) return null;
  return (
    <span className={`inline-flex flex-wrap items-center gap-1 ${className}`}>
      {diets.map(diet => (
        <abbr key={diet} className="diet-mark" data-diet={diet} title={DIETS[diet].label}>
          <span aria-hidden="true">{DIETS[diet].short}</span>
          <span className="sr-only">{DIETS[diet].label}</span>
        </abbr>
      ))}
    </span>
  );
}

/** A painted clay bowl of salsa, tinted by the salsa's colour, with chilli flecks for the heat. */
export function SalsaBowl({ color, heat, size = 72, className = '' }: { color: string; heat: number; size?: number; className?: string }) {
  const flecks = [[30, 25], [44, 22], [56, 26], [38, 28], [50, 24], [62, 23]].slice(0, heat * 2);
  return (
    <svg className={`salsa-bowl ${className}`} viewBox="0 0 92 64" width={size} height={size * 64 / 92} aria-hidden="true" focusable="false"
      style={{ '--salsa': color } as CSSProperties}>
      <ellipse cx="46" cy="58" rx="30" ry="4.5" fill="#000" opacity=".16" />
      {/* Molcajete-style clay bowl with a painted rim band. */}
      <path d="M6 24h80c0 18-16 32-40 32S6 42 6 24z" fill="var(--clay)" />
      <path d="M10 33c10 2 62 2 72 0" stroke="var(--glaze)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="1 7" />
      <path d="M14 42c12 4 52 4 64 0" stroke="var(--clay-dark)" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
      <ellipse cx="46" cy="24" rx="40" ry="9" fill="var(--clay-dark)" />
      <ellipse cx="46" cy="24" rx="35" ry="6.6" fill="var(--salsa)" />
      <ellipse cx="38" cy="22.4" rx="12" ry="2" fill="#fff" opacity=".22" />
      {flecks.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="#fff4d6" opacity=".75" />)}
    </svg>
  );
}

/** A lime wedge, an agave or an ear of corn: small painted ornaments for the bands. */
export function Ornament({ kind, size = 56, className = '' }: { kind: 'lime' | 'agave' | 'corn'; size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
      {kind === 'lime' ? (
        <>
          <path d="M6 40a26 26 0 0 0 52 0z" fill="var(--lime-fruit)" />
          <path d="M10 40a22 22 0 0 0 44 0z" fill="var(--lime-pith)" />
          <path d="M13 40a19 19 0 0 0 38 0z" fill="var(--lime-fruit)" opacity=".75" />
          {[-60, -30, 0, 30, 60].map(a => (
            <path key={a} d="M32 40v17" stroke="var(--lime-pith)" strokeWidth="2" transform={`rotate(${a} 32 40)`} />
          ))}
        </>
      ) : kind === 'agave' ? (
        <>
          {[-62, -40, -20, 0, 20, 40, 62].map((a, i) => {
            const length = 52 - Math.abs(a) / 3;
            return (
              <path key={a} fill="var(--agave)" opacity={i % 2 ? .78 : 1} transform={`rotate(${a} 32 58)`}
                d={`M32 58C27 ${58 - length * .3} 29 ${58 - length * .72} 32 ${58 - length}C35 ${58 - length * .72} 37 ${58 - length * .3} 32 58Z`} />
            );
          })}
        </>
      ) : (
        <>
          <path d="M32 6c9 0 12 17 10 34-1 9-5 14-10 14s-9-5-10-14C20 23 23 6 32 6z" fill="var(--corn)" />
          {[14, 21, 28, 35, 42].map(y => <path key={y} d={`M24 ${y}h16`} stroke="#000" strokeOpacity=".14" strokeWidth="1.6" />)}
          <path d="M32 58C20 56 12 44 14 26c6 10 12 20 18 32zM32 58c12-2 20-14 18-32-6 10-12 20-18 32z" fill="var(--agave)" />
        </>
      )}
    </svg>
  );
}
