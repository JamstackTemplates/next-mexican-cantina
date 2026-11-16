import { cantina, formatAddress } from '../content/cantina';
import { menu } from '../content/menu';
import { mapSearchUrl } from './maps';
import { absoluteUrl } from './paths';

/** schema.org Restaurant for search engines and maps. Built from the same content as the pages. */
export function cantinaStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: cantina.name,
    description: cantina.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: cantina.email,
    telephone: cantina.phone,
    servesCuisine: 'Mexican',
    // Walk-ins only; groups send an enquiry.
    acceptsReservations: false,
    priceRange: '$$',
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: cantina.address.street,
      addressLocality: cantina.address.locality,
      addressRegion: cantina.address.region,
      postalCode: cantina.address.postalCode,
      addressCountry: cantina.address.country,
    },
    hasMap: mapSearchUrl(formatAddress()),
    // One entry per service, so lunch and dinner each appear with their own hours.
    openingHoursSpecification: cantina.hours.flatMap(entry => entry.services.map(service => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${entry.day}`,
      opens: service.opens,
      closes: service.closes,
    }))),
    sameAs: cantina.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
