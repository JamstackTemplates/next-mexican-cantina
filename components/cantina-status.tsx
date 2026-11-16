'use client';

// Everything that depends on "now": the open/happy-hour status, today's hours, the happy-hour sign and
// today's special. Each renders a neutral, always-true version in the static HTML, then the browser
// works out the time in the cantina's zone (useCantinaClock) and fills in the live version.
import type { ElementType, ReactNode } from 'react';
import { cantina, happyHour } from '../content/cantina';
import { formatPrice, resolveSpecial, specials } from '../content/menu';
import {
  cantinaState, DAYS, describeHappyHour, describeStatus, describeToday, forDay, formatDays, formatHappyHour, happyHourState, openDays,
} from '../lib/hours';
import { documentHref } from '../lib/paths';
import { useCantinaClock } from './use-cantina-clock';

/** "Open · happy hour now until 6pm" with a status dot. Static: "Open Tuesday–Sunday". */
export function StatusLine({ className = '' }: { className?: string }) {
  const now = useCantinaClock();
  const status = now ? describeStatus(cantinaState(now.day, now.minutes, cantina.hours, happyHour)) : null;
  return (
    <p className={`flex items-center gap-2.5 ${className}`} data-tone={status?.tone} role="status" aria-live="polite" aria-atomic="true">
      <span className="status-dot" aria-hidden="true" />
      <span>{status?.text ?? `Open ${formatDays(openDays(cantina.hours))}`}</span>
    </p>
  );
}

/** "Today · Lunch 11am – 3pm · Dinner 4pm – 10pm". Static: the open days and a link to the full hours. */
export function TodayHours({ className = '' }: { className?: string }) {
  const now = useCantinaClock();
  if (!now) {
    return (
      <p className={className}>
        Lunch and dinner, {formatDays(openDays(cantina.hours))} · <a className="band-link" href={documentHref('/#find-us')}>See the hours</a>
      </p>
    );
  }
  const today = describeToday(now.day, cantina.hours);
  if (today === 'Closed today') return <p className={className}><span className="font-bold">Closed today</span> · <a className="band-link" href={documentHref('/#find-us')}>See the hours</a></p>;
  return <p className={className}><span className="font-bold">Today</span> · {today}</p>;
}

/** Wraps content that lights up during happy hour: sets data-happy="on" once the browser knows it's on. */
export function HappyScope({ as: Tag = 'div', children, ...rest }: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-labelledby'?: string;
}) {
  const now = useCantinaClock();
  const on = now ? happyHourState(now.day, now.minutes, happyHour).status === 'on' : false;
  return <Tag data-happy={now ? (on ? 'on' : 'off') : undefined} {...rest}>{children}</Tag>;
}

/**
 * The happy-hour sign: a quiet painted outline that lights up like neon while happy hour is on.
 * Static: "Tuesday–Friday, 4–6pm".
 */
export function HappyHourSign({ className = '', size = 'md', glass = false }: { className?: string; size?: 'md' | 'lg'; glass?: boolean }) {
  const now = useCantinaClock();
  const state = now ? happyHourState(now.day, now.minutes, happyHour) : null;
  const text = state && now ? describeHappyHour(state, happyHour, now.day) : formatHappyHour(happyHour);
  return (
    <a href={documentHref('/#happy-hour')} data-happy={state?.status === 'on' ? 'on' : 'off'}
      className={`hh-sign group grid content-center justify-items-center gap-1 rounded-[14px_18px_13px_19px/18px_13px_19px_14px] border-[3px] border-current px-5 py-3 text-center no-underline ${className}`}>
      {glass ? <GlassMark /> : null}
      <span className={`hh-sign__word lettered ${size === 'lg' ? 'text-[clamp(1.9rem,4vw,2.6rem)]' : 'text-[1.55rem]'} leading-none`}>Happy hour</span>
      <span className="text-[.92rem] font-semibold group-hover:underline">{text}</span>
    </a>
  );
}

/** A little margarita glass painted above the sign's lettering. */
function GlassMark() {
  return (
    <svg viewBox="0 0 48 40" width="44" height="37" className="hh-sign__word mb-0.5" aria-hidden="true" focusable="false">
      <path d="M6 6h36L27 20v11l7 4v2H14v-2l7-4V20z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M10 10h28" stroke="currentColor" strokeWidth="2.6" strokeDasharray="1.5 3" />
      <circle cx="40" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

/** The home page "Hoy" slot: today's special in big lettering. Static: an invitation to check the week. */
export function TodaySpecial() {
  const now = useCantinaClock();
  if (!now) {
    const titles = DAYS.flatMap(day => specials[day] ? [specials[day].title] : []);
    return (
      <div>
        <p className="eyebrow text-band-muted">Hoy · today</p>
        <p className="lettered mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">Every day has its special</p>
        <p className="mt-4 max-w-md text-[1.1rem]">
          {titles.length > 1 ? `From ${titles[0]} to ${titles.at(-1)}, here’s the week.` : 'Here’s the week.'} Ask your server what’s on today.
        </p>
      </div>
    );
  }
  const special = forDay(specials, now.day);
  const closed = !cantina.hours.find(entry => entry.day === now.day)?.services.length;
  if (!special) {
    return (
      <div>
        <p className="eyebrow text-band-muted">Hoy · {now.day}</p>
        <p className="lettered mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">{closed ? 'We’re closed today' : 'No special today'}</p>
        <p className="mt-4 max-w-md text-[1.1rem]">
          {closed ? 'The comal is cooling off. See you tomorrow, and here’s what’s coming up this week.' : 'The whole menu’s on, and there’s always something good from the comal. Here’s the rest of the week.'}
        </p>
      </div>
    );
  }
  const resolved = resolveSpecial(special);
  return (
    <div>
      <p className="eyebrow text-band-muted">Hoy · {now.day}</p>
      <p className="lettered mt-3 text-[clamp(2.4rem,6vw,4.2rem)]">{resolved.title}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[1.3rem] font-bold">
        <span>{resolved.name}</span>
        {resolved.price !== undefined ? <span className="price-tag text-[1.15rem]">{formatPrice(resolved.price)}</span> : null}
      </p>
      <p className="mt-2 max-w-md text-[1.08rem]">{resolved.description}</p>
      {resolved.item ? (
        <p className="mt-4"><a className="band-link" href={documentHref(`/menu/#${resolved.item.id}`)}>Find it on the menu</a></p>
      ) : null}
    </div>
  );
}

/** The week of specials. Static: the whole week; once the browser knows the day, today's row is marked. */
export function WeekSpecials() {
  const now = useCantinaClock();
  const week = DAYS.filter(day => cantina.hours.find(entry => entry.day === day)?.services.length);
  return (
    <ul className="grid">
      {week.map(day => {
        const special = specials[day];
        const resolved = special ? resolveSpecial(special) : undefined;
        const today = now?.day === day;
        return (
          <li key={day} data-today={today || undefined}
            className="grid grid-cols-[6.2rem_1fr_auto] items-baseline gap-x-3 rounded-lg border-b-2 border-dotted border-band-line px-2 py-2.5 last:border-b-0 max-xs:grid-cols-[4.6rem_1fr_auto]">
            <span className="font-bold">
              <span className="xs:hidden">{day.slice(0, 3)}</span><span className="max-xs:hidden">{day}</span>
              {today ? <span className="sr-only"> (today)</span> : null}
            </span>
            <span className="min-w-0">
              {resolved ? (
                <>
                  <span className="block font-semibold">{resolved.title}</span>
                  <span className="block text-[.92rem] text-band-muted">{resolved.name}</span>
                </>
              ) : <span className="text-band-muted">The full menu</span>}
            </span>
            <span className="font-bold tabular-nums">{resolved?.price !== undefined ? formatPrice(resolved.price) : ''}</span>
          </li>
        );
      })}
    </ul>
  );
}
