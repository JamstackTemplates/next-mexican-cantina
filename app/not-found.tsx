import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { PageHead } from '../components/page-head';
import { Flag } from '../components/papel-banner';
import { SiteLink } from '../components/site-link';
import { flagDesign } from '../lib/papel';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="pb-(--space-band)" aria-labelledby="not-found-title">
      <PageHead id="not-found-title" eyebrow="404" title={<>¡Ay! This page went missing…</>}
        before={(
          <span className="mb-4 block w-20 rotate-[24deg]" style={{ '--flag': 'var(--flag-rosa)' } as CSSProperties} aria-hidden="true">
            <Flag design={flagDesign('lost#404', 'star')} maskId="lost-flag" />
          </span>
        )}>
        <p>It may have blown off the string. The link might be out of date, or the page may have moved. Try one of these:</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="text-link">The menu</SiteLink></li>
        <li><SiteLink href="/#find-us" className="text-link">Hours &amp; directions</SiteLink></li>
        <li><SiteLink href="/contact/" className="text-link">Contact</SiteLink></li>
      </ul>
    </section>
  );
}
