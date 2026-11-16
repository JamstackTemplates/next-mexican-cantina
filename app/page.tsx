import type { Metadata } from 'next';
import { HappyHourSign, HappyScope, StatusLine, TodayHours, TodaySpecial, WeekSpecials } from '../components/cantina-status';
import { GoogleMap } from '../components/google-map';
import { Icon } from '../components/icons';
import { MenuRow } from '../components/menu-row';
import { HeatMeter, Ornament, SalsaBowl } from '../components/painted';
import { cycleSections, PapelBanner } from '../components/papel-banner';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { cantina, formatAddress, happyHour, telHref } from '../content/cantina';
import { featuredItems, formatPrice, menu } from '../content/menu';
import { deals } from '../lib/deals';
import { formatDays, formatRange, groupedHours } from '../lib/hours';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl } from '../lib/paths';
import { cantinaStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

// Repeated text styles, kept here so every band matches.
const bandTitle = 'lettered mt-3 text-[clamp(2.3rem,5.5vw,3.9rem)]';
const kicker = 'eyebrow text-band-muted';

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(cantinaStructuredData()) }} />

      {/* Hero: papel picado, the painted name, and a plaque that answers "are you open?" */}
      <section className="band-lime wash relative overflow-hidden pb-[clamp(3rem,6vw,4.5rem)]" aria-labelledby="hero-title">
        <PapelBanner flags={cycleSections(menu.sections, 22)} idPrefix="hero-flag" />
        <Ornament kind="agave" size={150} className="pointer-events-none absolute bottom-6 -left-6 opacity-90 max-lg:hidden" />
        <Ornament kind="lime" size={120} className="pointer-events-none absolute right-2 bottom-10 rotate-[-18deg] max-lg:hidden" />
        <div className="wrap relative text-center">
          <p className="eyebrow mt-[clamp(1rem,2.5vw,1.75rem)] text-accent">{cantina.tagline}</p>
          <h1 id="hero-title" className="sign-name lettered mt-2 text-[clamp(3.3rem,11.2vw,9.25rem)] leading-[1.02]">{cantina.name}</h1>
          <p className="mx-auto mt-4 max-w-[44rem] text-[clamp(1.05rem,1.6vw,1.22rem)] text-muted">{cantina.introduction}</p>

          <div className="mx-auto mt-[clamp(1.5rem,3vw,2.25rem)] grid max-w-[56rem] items-stretch gap-4 text-left md:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="band-verde plaque grid content-center gap-3 px-[clamp(1.25rem,3vw,2rem)] py-[clamp(1.25rem,2.5vw,1.6rem)]">
              <StatusLine className="text-[clamp(1.15rem,2.2vw,1.4rem)] leading-snug font-bold" />
              <TodayHours className="text-[.98rem] text-band-muted" />
              <p className="flex items-start gap-2 text-[.98rem]">
                <Icon name="pin" width={18} height={18} className="mt-0.5 flex-none" />
                <a className="band-link font-medium" href="#find-us">{formatAddress()}</a>
              </p>
              <p className="mt-1 flex flex-wrap gap-3">
                <SiteLink href="/menu/" className="button button-band">See the menu <Icon name="arrow" width={18} height={18} /></SiteLink>
                <a className="button button-band-ghost" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions</a>
              </p>
            </div>
            <div className="band-rosa plaque grid p-3.5">
              <HappyHourSign glass className="h-full w-full py-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Find us: directly under the hero. */}
      <section id="find-us" className="band-anil wash edge-scallop band-y relative" aria-labelledby="find-us-title">
        <div className="wrap grid items-start gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className={kicker}>Find us</p>
            <h2 id="find-us-title" className={bandTitle}>On the plaza</h2>
            <p className="mt-4 text-[1.2rem] font-bold">{formatAddress()}</p>
            {cantina.address.note ? <p className="mt-1 text-band-muted">{cantina.address.note}</p> : null}
            <p className="mt-5 flex flex-wrap gap-3">
              <a className="button button-band" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <Icon name="arrow" width={18} height={18} /></a>
              <a className="button button-band-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
            </p>
            {cantina.directions.length ? (
              <ul className="mt-6 grid list-['✦__'] gap-1.5 pl-5 text-[.98rem] text-band-muted marker:text-band-accent">
                {cantina.directions.map(line => <li key={line}>{line}</li>)}
              </ul>
            ) : null}
            {cantina.notice ? (
              <p className="mt-5 rounded-lg bg-band-panel px-4 py-3 font-semibold">{cantina.notice}</p>
            ) : null}
            <h3 className="mt-8 flex items-center gap-2 text-[1.3rem]"><Icon name="clock" width={20} height={20} />Opening hours</h3>
            <ul className="mt-2">
              {groupedHours(cantina.hours).map(group => (
                <li key={group.label} className="grid grid-cols-[minmax(5.5rem,auto)_1fr] gap-x-4 border-b-2 border-dotted border-band-line py-2.5 sm:grid-cols-[8rem_1fr]">
                  <span className="font-bold">{group.label}</span>
                  <span className="grid gap-0.5">
                    {group.services.length ? group.services.map(service => (
                      <span key={service.label} className="flex flex-wrap justify-between gap-x-3">
                        <span className="text-band-muted">{service.label}</span><span className="tabular-nums">{service.hours}</span>
                      </span>
                    )) : <span className="text-band-muted">Closed</span>}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[.95rem]">
              <span className="font-bold text-band-accent">Happy hour</span> {formatDays(happyHour.days)}, {formatRange(happyHour.starts, happyHour.ends)}
            </p>
            <TimeZoneNote className="text-band-muted" />
          </div>
          <GoogleMap className="min-h-[24rem] lg:min-h-[34rem]" />
        </div>
      </section>

      {/* Hoy: today's special, chosen in the browser, beside the week. */}
      <section id="hoy" className="band-marigold wash edge-picado band-y relative" aria-labelledby="hoy-title">
        <h2 id="hoy-title" className="sr-only">Today’s special and the week of specials</h2>
        <div className="wrap grid items-center gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <TodaySpecial />
          <div className="plaque px-[clamp(1rem,3vw,1.75rem)] py-5">
            <p className="lettered mb-2 px-2 text-[1.7rem]">La semana</p>
            <WeekSpecials />
          </div>
        </div>
      </section>

      {/* Happy hour: a painted board that lights up when it's on. */}
      <HappyScope as="section" id="happy-hour" className="band-rosa wash edge-scallop band-y relative" aria-labelledby="happy-hour-title">
        <div className="wrap grid items-center gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className={kicker}>{formatDays(happyHour.days)} · {formatRange(happyHour.starts, happyHour.ends)}</p>
            <h2 id="happy-hour-title" className={bandTitle}>Happy hour on the plaza</h2>
            <p className="mt-4 max-w-md text-[1.1rem] text-band-muted">
              After work, at the bar and on the patio. Two hours of cheaper margaritas, tacos and aguas frescas, and the lights come on.
            </p>
            <HappyHourSign size="lg" className="mt-7 max-w-sm" />
          </div>
          <div className="hh-sign plaque px-[clamp(1.1rem,3vw,2rem)] py-[clamp(1.1rem,3vw,1.75rem)]">
            <p className="lettered text-[1.7rem]">Las ofertas</p>
            <ul className="mt-2">
              {deals.map(deal => (
                <li key={deal.key} className="flex items-baseline gap-2 border-b-2 border-dotted border-band-line py-3 last:border-b-0">
                  <span className="font-bold">
                    {deal.item ? <SiteLink href={`/menu/#${deal.item.id}`} className="band-link no-underline hover:underline">{deal.label}</SiteLink> : deal.label}
                    {deal.size ? <span className="ml-1.5 text-[.85rem] font-semibold text-band-muted">{deal.size.toLowerCase()}</span> : null}
                  </span>
                  <span className="menu-leader" aria-hidden="true" />
                  {deal.normal !== undefined ? <s className="text-[.95rem] text-band-muted tabular-nums"><span className="sr-only">usually </span>{formatPrice(deal.normal)}</s> : null}
                  {deal.price !== undefined ? <span className="price-tag hh-price text-[1.05rem]">{formatPrice(deal.price)}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HappyScope>

      {/* De la casa: featured dishes and drinks as painted menu rows, and the salsa bar. */}
      <section className="band-verde wash edge-picado band-y relative" aria-labelledby="casa-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className={kicker}>De la casa</p>
              <h2 id="casa-title" className={bandTitle}>What we’re known for</h2>
            </div>
            <SiteLink href="/menu/" className="button button-band">The whole menu <Icon name="arrow" width={18} height={18} /></SiteLink>
          </div>
          <ul className="mt-6 grid gap-x-12 md:grid-cols-2 [&>li:nth-last-child(2):nth-child(odd)]:md:border-b-0">
            {featuredItems.map(item => <MenuRow key={item.id} item={item} link />)}
          </ul>

          <div className="plaque mt-12 px-[clamp(1.1rem,3vw,2rem)] py-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="lettered text-[1.8rem] font-normal">La barra de salsas</h3>
              <p className="text-[.95rem] text-band-muted">Made every morning. Help yourself, from mild to very hot.</p>
            </div>
            <ul className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-x-4 gap-y-6">
              {menu.salsas.map(salsa => (
                <li key={salsa.id} className="grid justify-items-center gap-1 text-center">
                  <SalsaBowl color={salsa.color} heat={salsa.heat} size={88} />
                  <span className="mt-1 font-bold">{salsa.name}</span>
                  <span className="text-[.85rem] leading-snug text-band-muted">{salsa.description}</span>
                  <HeatMeter heat={salsa.heat} size={15} />
                  {salsa.diet?.includes('contains-nuts') ? <span className="text-[.78rem] font-bold tracking-wide uppercase">Contains nuts</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The family story. */}
      <section className="band-terracotta wash edge-scallop band-y relative overflow-hidden" aria-labelledby="story-title">
        <Ornament kind="corn" size={170} className="pointer-events-none absolute -right-8 bottom-0 rotate-[14deg] opacity-80 max-lg:hidden" />
        <div className="wrap grid items-start gap-[clamp(2rem,5vw,4.5rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className={kicker}>Nuestra historia</p>
            <h2 id="story-title" className={bandTitle}>Recipes from the family kitchen</h2>
            {cantina.story.map(paragraph => <p key={paragraph} className="mt-5 max-w-(--measure) text-[1.08rem] text-band-muted">{paragraph}</p>)}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-1">
            {cantina.points.map((point, i) => (
              <li key={point.title} className="plaque flex items-start gap-4 px-5 py-4">
                <span className="lettered text-[2rem] leading-none text-band-accent" aria-hidden="true">{i + 1}</span>
                <span>
                  <strong className="block text-[1.08rem]">{point.title}</strong>
                  <span className="block text-[.95rem] leading-normal text-band-muted">{point.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Celebrations: group tables, birthdays and catering, by enquiry. */}
      <section className="band-marigold wash edge-picado band-y relative" aria-labelledby="celebrations-title">
        <div className="wrap">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <p className={kicker}>Celebraciones</p>
              <h2 id="celebrations-title" className={bandTitle}>Group tables, birthdays &amp; catering</h2>
              <p className="mt-4 max-w-(--measure) text-[1.1rem] text-band-muted">
                Walk-ins never need a booking. For 8 or more, a birthday or a catering order, send us the date and how many,
                and we’ll reply to work it out together.
              </p>
            </div>
            <p className="flex flex-wrap gap-3">
              <SiteLink href="/contact/" className="button">Send an enquiry <Icon name="arrow" width={18} height={18} /></SiteLink>
              <a className="button button-band-ghost" href={telHref()}>Call {cantina.phone}</a>
            </p>
          </div>
          <ul className="mt-9 grid gap-4 md:grid-cols-3">
            {cantina.celebrations.map(item => (
              <li key={item.title} className="plaque px-6 py-5">
                <p className="lettered text-[1.6rem]">{item.title}</p>
                <p className="mt-1.5 text-band-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {cantina.faqs.length ? (
        <section id="faq" className="band-lime wash edge-scallop band-y relative" aria-labelledby="faq-title">
          <div className="wrap grid gap-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
            <div>
              <p className="eyebrow text-accent">Preguntas</p>
              <h2 id="faq-title" className={`${bandTitle} sign-name`}>Good to know</h2>
              <ul className="mt-7 grid gap-3">
                {cantina.amenities.map(amenity => (
                  <li key={amenity.title} className="flex items-start gap-3">
                    <Icon name={amenity.icon} width={22} height={22} className="mt-0.5 flex-none text-accent" />
                    <span><strong className="block">{amenity.title}</strong><span className="text-[.95rem] text-muted">{amenity.detail}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="grid">
                {cantina.faqs.map(faq => (
                  <details key={faq.question} className="faq border-b-2 border-dotted border-line">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[1.1rem] font-bold">{faq.question}</summary>
                    <p className="max-w-(--measure) pb-5 text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
              <p className="mt-6 text-muted">
                Something else? Call <a className="text-link" href={telHref()}>{cantina.phone}</a> or{' '}
                <SiteLink href="/contact/" className="text-link">send us a message</SiteLink>.
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
