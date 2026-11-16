// The open / happy-hour / today's-special status: pure logic, so every case runs without a browser or a clock.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  cantinaState, describeHappyHour, describeStatus, describeToday, forDay, formatDays, formatHappyHour, formatRange,
  happyHourState, toMinutes, zonedNow, type Day, type DayHours, type HappyHourTimes,
} from '../lib/hours.ts';

const lunch = { label: 'Lunch', opens: '11:00', closes: '15:00' } as const;
const dinner = { label: 'Dinner', opens: '16:00', closes: '22:00' } as const;
const week: DayHours[] = [
  { day: 'Monday', services: [] },
  { day: 'Tuesday', services: [lunch, dinner] },
  { day: 'Wednesday', services: [lunch, dinner] },
  { day: 'Thursday', services: [lunch, dinner] },
  { day: 'Friday', services: [lunch, { label: 'Dinner', opens: '16:00', closes: '23:00' }] },
  { day: 'Saturday', services: [{ label: 'All day', opens: '11:00', closes: '23:00' }] },
  { day: 'Sunday', services: [{ label: 'All day', opens: '11:00', closes: '21:00' }] },
];
const happyHour: HappyHourTimes = { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], starts: '16:00', ends: '18:00' };
const status = (day: Day, time: string, hours = week) => describeStatus(cantinaState(day, toMinutes(time), hours, happyHour));

test('before opening', () => {
  assert.deepEqual(status('Tuesday', '09:15'), { text: 'Closed · opens today at 11am', tone: 'closed' });
  assert.deepEqual(status('Saturday', '10:59'), { text: 'Closed · opens today at 11am', tone: 'closed' });
});

test('during a service, with happy hour still to come', () => {
  assert.deepEqual(status('Tuesday', '11:00'), { text: 'Open until 3pm · happy hour from 4pm', tone: 'open' });
  assert.deepEqual(status('Wednesday', '14:59'), { text: 'Open until 3pm · happy hour from 4pm', tone: 'open' });
});

test('between services', () => {
  assert.deepEqual(status('Thursday', '15:00'), { text: 'Between services · dinner from 4pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '15:59'), { text: 'Between services · dinner from 4pm', tone: 'closed' });
});

test('the moment happy hour starts and ends', () => {
  assert.deepEqual(status('Thursday', '15:59'), { text: 'Between services · dinner from 4pm', tone: 'closed' });
  assert.deepEqual(status('Thursday', '16:00'), { text: 'Open · happy hour now until 6pm', tone: 'happy' });
  assert.deepEqual(status('Thursday', '17:59'), { text: 'Open · happy hour now until 6pm', tone: 'happy' });
  assert.deepEqual(status('Thursday', '18:00'), { text: 'Open until 10pm', tone: 'open' });
  assert.deepEqual(happyHourState('Thursday', toMinutes('15:59'), happyHour), { status: 'later', starts: '16:00' });
  assert.deepEqual(happyHourState('Thursday', toMinutes('16:00'), happyHour), { status: 'on', ends: '18:00' });
  assert.deepEqual(happyHourState('Thursday', toMinutes('18:00'), happyHour), { status: 'over' });
});

test('a happy-hour day versus a non-happy-hour day', () => {
  assert.deepEqual(status('Friday', '16:30'), { text: 'Open · happy hour now until 6pm', tone: 'happy' });
  assert.deepEqual(status('Saturday', '16:30'), { text: 'Open until 11pm', tone: 'open' });
  assert.deepEqual(happyHourState('Saturday', toMinutes('16:30'), happyHour), { status: 'none' });
  // The happy-hour sign: live wording on happy-hour days, the neutral week otherwise.
  const sign = (day: Day, time: string) => describeHappyHour(happyHourState(day, toMinutes(time), happyHour), happyHour, day);
  assert.equal(sign('Tuesday', '12:00'), 'Today from 4pm');
  assert.equal(sign('Tuesday', '17:00'), 'On now until 6pm');
  assert.equal(sign('Tuesday', '19:00'), 'Done for today · back tomorrow at 4pm');
  assert.equal(sign('Friday', '19:00'), 'Done for today · back Tuesday at 4pm');
  assert.equal(sign('Sunday', '12:00'), 'Tuesday–Friday, 4–6pm');
});

test('after closing and on closed days', () => {
  assert.deepEqual(status('Thursday', '22:00'), { text: 'Closed · opens tomorrow at 11am', tone: 'closed' });
  assert.deepEqual(status('Friday', '22:45'), { text: 'Open until 11pm', tone: 'open' });
  assert.deepEqual(status('Monday', '12:30'), { text: 'Closed · opens tomorrow at 11am', tone: 'closed' });
  assert.equal(describeToday('Monday', week), 'Closed today');
  assert.equal(describeToday('Tuesday', week), 'Lunch 11am – 3pm · Dinner 4pm – 10pm');
  assert.equal(describeToday('Sunday', week), '11am – 9pm');
});

test('the next opening across a closed Monday', () => {
  assert.deepEqual(status('Sunday', '21:00'), { text: 'Closed · opens Tuesday at 11am', tone: 'closed' });
  assert.deepEqual(status('Sunday', '23:30'), { text: 'Closed · opens Tuesday at 11am', tone: 'closed' });
  // Several closed days in a row, wrapping round the end of the week.
  const short: DayHours[] = week.map(entry => ({ ...entry, services: entry.day === 'Thursday' ? [dinner] : [] }));
  assert.deepEqual(status('Saturday', '13:00', short), { text: 'Closed · opens Thursday at 4pm', tone: 'closed' });
  // No services at all never claims an opening.
  assert.deepEqual(status('Monday', '13:00', week.map(entry => ({ ...entry, services: [] }))), { text: 'Closed', tone: 'closed' });
});

test('a weekday with no special', () => {
  const specials: Partial<Record<Day, { title: string }>> = { Tuesday: { title: 'Martes de tacos' }, Friday: { title: 'Viernes de pozole' } };
  assert.equal(forDay(specials, 'Tuesday')?.title, 'Martes de tacos');
  assert.equal(forDay(specials, 'Wednesday'), undefined);
  assert.equal(forDay(specials, 'Monday'), undefined);
});

test('the neutral, static wording', () => {
  assert.equal(formatHappyHour(happyHour), 'Tuesday–Friday, 4–6pm');
  assert.equal(formatRange('11:00', '15:00'), '11am–3pm');
  assert.equal(formatRange('16:30', '18:00'), '4:30–6pm');
  assert.equal(formatDays(['Friday', 'Saturday']), 'Friday and Saturday');
  assert.equal(formatDays(['Monday', 'Wednesday', 'Friday']), 'Monday, Wednesday and Friday');
  assert.equal(formatDays(['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday']), 'Tuesday–Sunday');
});

test('the browser clock is read in the cantina’s time zone', () => {
  // 2026-11-17 22:30 UTC is 4:30pm on Tuesday in San Antonio (UTC−6, standard time).
  assert.deepEqual(zonedNow('America/Chicago', new Date('2026-11-17T22:30:00Z')), { day: 'Tuesday', minutes: 16 * 60 + 30 });
  // Daylight saving: 2026-07-15 02:05 UTC is 9:05pm on Tuesday (UTC−5).
  assert.deepEqual(zonedNow('America/Chicago', new Date('2026-07-15T02:05:00Z')), { day: 'Tuesday', minutes: 21 * 60 + 5 });
});
