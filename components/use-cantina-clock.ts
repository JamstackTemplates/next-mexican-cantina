'use client';

import { useEffect, useState } from 'react';
import { zonedNow, type Day } from '../lib/hours';

/**
 * The current weekday and minutes after midnight in the cantina's time zone, refreshed every minute.
 * `null` on the server, before hydration and when no time zone is configured, so the static HTML never
 * bakes in the time it was built and makes no claim about what's on now.
 */
export function useCantinaClock(): { day: Day; minutes: number } | null {
  // Inlined at build time from site.config.json `timeZone` (see next.config.mjs). Client components read
  // this one public value rather than importing lib/site.ts.
  const timeZone = process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '';
  const [now, setNow] = useState<{ day: Day; minutes: number } | null>(null);

  useEffect(() => {
    if (!timeZone) return;
    const update = () => {
      try {
        const next = zonedNow(timeZone);
        setNow(current => current && current.day === next.day && current.minutes === next.minutes ? current : next);
      } catch {
        setNow(null);
      }
    };
    update();
    // Re-check just after each minute ticks over, then every minute.
    let timer: ReturnType<typeof setInterval> | undefined;
    const align = setTimeout(() => { update(); timer = setInterval(update, 60_000); }, 60_000 - (Date.now() % 60_000) + 250);
    return () => { clearTimeout(align); clearInterval(timer); };
  }, [timeZone]);

  return now;
}
