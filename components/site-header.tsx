import { DarkModeToggle } from 'jamstacks';
import { cantina } from '../content/cantina';
import { Logo } from './logo';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/menu/', label: 'Menu', current: 'section' as const },
  { href: '/#happy-hour', label: 'Happy hour', current: undefined },
  { href: '/contact/', label: 'Contact', current: 'page' as const },
];

/** A slim strip painted rosa, with a papel-picado edge cut along its bottom. */
export function SiteHeader() {
  return (
    <header className="site-header band-rosa edge-hang sticky top-0 z-50">
      <div className="wrap flex h-(--header-h) items-center justify-between gap-2 sm:gap-4">
        <SiteLink href="/" className="inline-flex min-w-0 items-center gap-2.5 no-underline" aria-label={`${cantina.name}, home`}>
          <Logo className="-mt-1" />
          <span className="lettered text-[1.3rem] leading-none whitespace-nowrap max-[26rem]:sr-only sm:text-[1.5rem]">{cantina.name}</span>
        </SiteLink>
        <div className="flex items-center gap-1 sm:gap-3 print:hidden">
          <nav aria-label="Main">
            <ul className="flex">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent={item.current}
                    className="inline-block rounded-md px-2 py-1.5 text-[.95rem] font-semibold whitespace-nowrap no-underline transition-colors hover:bg-band-panel aria-[current]:underline aria-[current]:decoration-band-accent aria-[current]:decoration-[3px] aria-[current]:underline-offset-[.4em] sm:px-3 sm:text-base">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </header>
  );
}
