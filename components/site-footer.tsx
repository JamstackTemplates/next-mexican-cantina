import { cantina, formatAddress, happyHour, publicLinks, telHref } from '../content/cantina';
import { menu } from '../content/menu';
import { formatHappyHour, groupedHours } from '../lib/hours';
import { cycleSections, PapelBanner } from './papel-banner';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 font-sans text-[.8rem] font-bold tracking-[.18em] text-band-muted uppercase';

/** The last painted band, in añil, with papel picado strung along its top edge. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer band-anil wash edge-scallop relative mt-[14px]">
      <PapelBanner flags={cycleSections(menu.sections, 24, ['anil'])} idPrefix="footer-flag" className="-mb-2" style={{ "--flag-w": "clamp(40px, 4.6vw, 64px)" } as React.CSSProperties} />
      <div className="wrap grid gap-x-12 gap-y-9 pt-10 pb-9 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.2fr_.8fr]">
        <div>
          <p className="lettered text-[clamp(2.2rem,4vw,2.8rem)] leading-none text-band-accent">{cantina.name}</p>
          <p className="mt-2.5 mb-5 text-[.95rem] text-band-muted">{cantina.tagline}</p>
          <address className="leading-[1.8] not-italic">
            {formatAddress()}
            {cantina.address.note ? <><br /><span className="text-[.92rem] text-band-muted">{cantina.address.note}</span></> : null}
            <br /><a className="band-link" href={telHref()}>{cantina.phone}</a>
            <br /><a className="band-link" href={`mailto:${cantina.email}`}>{cantina.email}</a>
          </address>
        </div>
        <div>
          <h2 className={heading}>Hours</h2>
          <ul className="text-[.95rem]">
            {groupedHours(cantina.hours).map(group => (
              <li key={group.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b-2 border-dotted border-band-line py-2">
                <span className="font-bold">{group.label}</span>
                <span className="grid gap-0.5">
                  {group.services.length ? group.services.map(service => (
                    <span key={service.label} className="flex justify-between gap-3">
                      <span className="text-band-muted">{service.label}</span><span className="whitespace-nowrap tabular-nums">{service.hours}</span>
                    </span>
                  )) : <span className="text-band-muted">Closed</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[.9rem]"><span className="font-bold text-band-accent">Happy hour</span> {formatHappyHour(happyHour)}</p>
          <TimeZoneNote className="text-band-muted" />
        </div>
        <div>
          <h2 className={heading}>Around the plaza</h2>
          <ul className="grid gap-2 font-semibold [&_a]:no-underline [&_a:hover]:underline">
            <li><SiteLink href="/menu/">Menu</SiteLink></li>
            <li><SiteLink href="/#hoy">Today’s special</SiteLink></li>
            <li><SiteLink href="/#happy-hour">Happy hour</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/#faq">FAQs</SiteLink></li>
            <li><SiteLink href="/contact/">Group tables &amp; catering</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 border-t-2 border-dotted border-band-line pt-5 pb-8 text-[.9rem] text-band-muted">
        <span>© {year} {cantina.name} · salsas made every morning</span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-band-accent hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </p>
    </footer>
  );
}
