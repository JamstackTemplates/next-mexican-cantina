// Opening hours, happy hour, daily specials and the "Open · happy hour now" status. Pure functions with
// no imports, so they are unit tested directly and the browser only supplies the current time in the
// cantina's own time zone (see components/use-cantina-clock.ts).

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export type ServiceLabel = 'Lunch' | 'Dinner' | 'All day';

export const SERVICE_LABELS: readonly ServiceLabel[] = ['Lunch', 'Dinner', 'All day'];

export interface Service {
  /** Shown beside the times, e.g. "Lunch". */
  label: ServiceLabel;
  /** 24-hour "HH:MM" local time, e.g. "11:00". */
  opens: string;
  /** 24-hour "HH:MM" local time, e.g. "22:00". Must be later than `opens` on the same day. */
  closes: string;
}

export interface DayHours {
  day: Day;
  /** Zero or more services, earliest first. An empty list means closed all day. */
  services: Service[];
}

export interface HappyHourTimes {
  /** The days happy hour runs. Each must be a day the cantina is open. */
  days: Day[];
  /** 24-hour "HH:MM" local time happy hour starts, e.g. "16:00". */
  starts: string;
  /** 24-hour "HH:MM" local time happy hour ends, e.g. "18:00". Must fall inside one service. */
  ends: string;
}

/** Minutes after midnight for "HH:MM". */
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

/** "07:30" → "7:30am", "18:00" → "6pm". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

/** "11am – 3pm". */
export function formatService(service: Pick<Service, 'opens' | 'closes'>): string {
  return `${formatTime(service.opens)} – ${formatTime(service.closes)}`;
}

/** A compact range that shares am/pm when it can: "4–6pm", "11am–3pm". */
export function formatRange(opens: string, closes: string): string {
  const a = formatTime(opens);
  const b = formatTime(closes);
  const suffix = (value: string) => value.slice(-2);
  return suffix(a) === suffix(b) ? `${a.slice(0, -2)}–${b}` : `${a}–${b}`;
}

/** Day names as a run where they are consecutive: "Tuesday–Friday", "Friday and Saturday", "Monday, Wednesday and Friday". */
export function formatDays(days: readonly Day[]): string {
  const sorted = [...new Set(days)].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
  if (!sorted.length) return '';
  if (sorted.length === 7) return 'every day';
  const consecutive = sorted.every((day, i) => i === 0 || DAYS.indexOf(day) === DAYS.indexOf(sorted[i - 1]) + 1);
  if (consecutive && sorted.length >= 3) return `${sorted[0]}–${sorted.at(-1)}`;
  if (sorted.length === 1) return sorted[0];
  return `${sorted.slice(0, -1).join(', ')} and ${sorted.at(-1)}`;
}

/** Neutral, always-true happy hour line for the static page: "Tuesday–Friday, 4–6pm". */
export function formatHappyHour(happyHour: HappyHourTimes): string {
  return `${formatDays(happyHour.days)}, ${formatRange(happyHour.starts, happyHour.ends)}`;
}

export interface HoursGroup {
  /** "Tue – Fri" or "Monday". */
  label: string;
  /** Services for these days; empty when closed. */
  services: { label: ServiceLabel; hours: string }[];
}

/** Consecutive days with identical services, e.g. Tue – Fri: Lunch 11am – 3pm, Dinner 4pm – 10pm. */
export function groupedHours(hours: readonly DayHours[]): HoursGroup[] {
  const key = (entry: DayHours) => entry.services.map(s => `${s.label} ${s.opens}-${s.closes}`).join('|');
  const groups: { days: Day[]; key: string; entry: DayHours }[] = [];
  for (const entry of hours) {
    const last = groups.at(-1);
    if (last && last.key === key(entry)) last.days.push(entry.day);
    else groups.push({ days: [entry.day], key: key(entry), entry });
  }
  const short = (day: Day) => day.slice(0, 3);
  return groups.map(group => ({
    label: group.days.length === 1 ? group.days[0] : `${short(group.days[0])} – ${short(group.days.at(-1)!)}`,
    services: group.entry.services.map(service => ({ label: service.label, hours: formatService(service) })),
  }));
}

/** The days with at least one service. */
export function openDays(hours: readonly DayHours[]): Day[] {
  return hours.filter(entry => entry.services.length).map(entry => entry.day);
}

export interface NextService {
  day: Day;
  service: Service;
  /** 0 = later today, 1 = tomorrow, and so on. */
  daysAhead: number;
}

/** The next service that opens after `minutes` today, or on a following day (up to a week ahead). */
export function nextService(day: Day, minutes: number, hours: readonly DayHours[]): NextService | undefined {
  const start = DAYS.indexOf(day);
  for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
    const candidate = DAYS[(start + daysAhead) % 7];
    const services = hours.find(entry => entry.day === candidate)?.services ?? [];
    for (const service of services) {
      if (daysAhead === 0 && toMinutes(service.opens) <= minutes) continue;
      return { day: candidate, service, daysAhead };
    }
  }
  return undefined;
}

export type HappyHourState =
  /** Happy hour is on right now, until `ends`. */
  | { status: 'on'; ends: string }
  /** It's a happy-hour day and happy hour starts later today. */
  | { status: 'later'; starts: string }
  /** It's a happy-hour day, and today's happy hour is over. */
  | { status: 'over' }
  /** No happy hour today. */
  | { status: 'none' };

export function happyHourState(day: Day, minutes: number, happyHour: HappyHourTimes): HappyHourState {
  if (!happyHour.days.includes(day)) return { status: 'none' };
  const starts = toMinutes(happyHour.starts);
  const ends = toMinutes(happyHour.ends);
  if (minutes < starts) return { status: 'later', starts: happyHour.starts };
  if (minutes < ends) return { status: 'on', ends: happyHour.ends };
  return { status: 'over' };
}

export type CantinaState =
  /** Inside a service. */
  | { status: 'open'; service: Service; happyHour: HappyHourState }
  /** A service has run today and another starts later today. */
  | { status: 'between'; next: NextService; happyHour: HappyHourState }
  /** Nothing has been served yet today, the day is over, or the whole day is closed. */
  | { status: 'closed'; next?: NextService; happyHour: HappyHourState };

/**
 * Whether the cantina is open at a local day/time. `minutes` is minutes after midnight in the cantina's
 * own time zone.
 */
export function cantinaState(day: Day, minutes: number, hours: readonly DayHours[], happyHour: HappyHourTimes): CantinaState {
  const today = hours.find(entry => entry.day === day)?.services ?? [];
  const hh = happyHourState(day, minutes, happyHour);
  const service = today.find(s => minutes >= toMinutes(s.opens) && minutes < toMinutes(s.closes));
  if (service) return { status: 'open', service, happyHour: hh };
  const next = nextService(day, minutes, hours);
  const servedToday = today.some(s => toMinutes(s.opens) <= minutes);
  if (next && next.daysAhead === 0 && servedToday) return { status: 'between', next, happyHour: hh };
  return { status: 'closed', next, happyHour: hh };
}

export type StatusTone = 'happy' | 'open' | 'closed';

/** Words for the status plaque, e.g. "Open · happy hour now until 6pm". */
export function describeStatus(state: CantinaState): { text: string; tone: StatusTone } {
  if (state.status === 'open') {
    const hh = state.happyHour;
    if (hh.status === 'on') return { text: `Open · happy hour now until ${formatTime(hh.ends)}`, tone: 'happy' };
    const until = `Open until ${formatTime(state.service.closes)}`;
    if (hh.status === 'later') return { text: `${until} · happy hour from ${formatTime(hh.starts)}`, tone: 'open' };
    return { text: until, tone: 'open' };
  }
  if (state.status === 'between') {
    const label = state.next.service.label === 'All day' ? 'back' : state.next.service.label.toLowerCase();
    return { text: `Between services · ${label} from ${formatTime(state.next.service.opens)}`, tone: 'closed' };
  }
  if (!state.next) return { text: 'Closed', tone: 'closed' };
  const when = state.next.daysAhead === 0 ? 'today' : state.next.daysAhead === 1 ? 'tomorrow' : state.next.day;
  return { text: `Closed · opens ${when} at ${formatTime(state.next.service.opens)}`, tone: 'closed' };
}

/** Words for the happy-hour sign: "On now until 6pm", "Today from 4pm", "Back tomorrow at 4pm" or the neutral week. */
export function describeHappyHour(state: HappyHourState, happyHour: HappyHourTimes, day: Day): string {
  if (state.status === 'on') return `On now until ${formatTime(state.ends)}`;
  if (state.status === 'later') return `Today from ${formatTime(state.starts)}`;
  if (state.status === 'over') {
    const next = nextHappyHourDay(day, happyHour.days);
    const when = next.daysAhead === 1 ? 'tomorrow' : next.day;
    return `Done for today · back ${when} at ${formatTime(happyHour.starts)}`;
  }
  return formatHappyHour(happyHour);
}

/** The next happy-hour day after `day` (a week ahead when it is the only one). */
export function nextHappyHourDay(day: Day, days: readonly Day[]): { day: Day; daysAhead: number } {
  const start = DAYS.indexOf(day);
  for (let daysAhead = 1; daysAhead <= 7; daysAhead++) {
    const candidate = DAYS[(start + daysAhead) % 7];
    if (days.includes(candidate)) return { day: candidate, daysAhead };
  }
  return { day, daysAhead: 7 };
}

/** Today's services as "Lunch 11am – 3pm · Dinner 4pm – 10pm", or "Closed today". */
export function describeToday(day: Day, hours: readonly DayHours[]): string {
  const services = hours.find(entry => entry.day === day)?.services ?? [];
  if (!services.length) return 'Closed today';
  return services.map(s => (services.length === 1 ? formatService(s) : `${s.label} ${formatService(s)}`)).join(' · ');
}

/** Current weekday and minutes after midnight in an IANA time zone. */
export function zonedNow(timeZone: string, date = new Date()): { day: Day; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: string) => parts.find(item => item.type === type)?.value ?? '';
  const day = part('weekday') as Day;
  return { day: DAYS.includes(day) ? day : 'Monday', minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

/** Today's entry from a weekday-keyed list (e.g. daily specials), or undefined for a day with none. */
export function forDay<T>(byDay: Partial<Record<Day, T>>, day: Day): T | undefined {
  return byDay[day];
}
