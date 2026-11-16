import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { Icon } from '../../components/icons';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { cycleSections, PapelBanner } from '../../components/papel-banner';
import { cantina, telHref } from '../../content/cantina';
import { menu } from '../../content/menu';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Group tables, celebrations & catering',
  description: `Enquiries about group tables, birthdays and catering at ${cantina.name}. Walk-ins never need a booking.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'lettered mb-1 text-[1.45rem]';
const tips = ['The date and time', 'How many guests', 'The occasion', 'Catering or dine-in', 'Any allergies'];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return (
    <>
      <PageHead eyebrow="Contact" title={<>Group tables, celebrations &amp; catering</>}>
        <p>
          Planning a birthday, a long table for the office or a taco bar for a family party? Send us an enquiry and someone
          from the cantina will reply, usually within a day. It’s an enquiry, not a booking: nothing is booked or ordered
          until we reply to confirm.
        </p>
      </PageHead>

      <div className="wrap">
        <p className="band-verde plaque flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 text-[1rem]">
          <Icon name="walk-in" width={20} height={20} className="flex-none" />
          <span><strong>Just coming in to eat?</strong> Walk-ins never need a booking. Only groups of 8 or more need to get in touch first.</span>
        </p>
      </div>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(2rem,4vw,3rem)] pb-(--space-band) lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={cantina.email} />
          ) : (
            <div className="band-rosa wash plaque grid justify-items-start gap-[1.1rem] overflow-hidden p-[clamp(1.5rem,4vw,2.75rem)] pt-0">
              <PapelBanner flags={cycleSections(menu.sections, 10, ['rosa'])} idPrefix="contact-flag" className="-mx-[clamp(1.5rem,4vw,2.75rem)] self-stretch" />
              <h2 className="lettered text-[clamp(1.9rem,3.2vw,2.5rem)]">Write to us directly</h2>
              <p className="max-w-[34rem] text-band-muted">
                Email is the best way to reach us about group tables, birthdays and catering. Tell us what you’re planning
                and we’ll reply with what we can do. It’s an enquiry, not a booking, until we confirm.
              </p>
              <p><a className="button button-band" href={`mailto:${cantina.email}?subject=${encodeURIComponent('Group table, celebration or catering enquiry')}`}>Email {cantina.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 pt-1" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="text-[1.25rem] font-bold wrap-anywhere"><a className="text-link" href={`mailto:${cantina.email}`}>{cantina.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={cantina.email} /></p>

          <h2 className={`mt-5 ${subhead}`}>Phone</h2>
          <p><a className="text-link" href={telHref()}>{cantina.phone}</a></p>
          <p className="text-[.92rem] text-muted">For quick questions during opening hours.</p>

          <h2 className={`mt-5 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 text-muted">
            {tips.map(tip => (
              <li key={tip} className="relative pl-6 before:absolute before:top-[.1em] before:left-0 before:text-accent before:content-['✦']">{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
