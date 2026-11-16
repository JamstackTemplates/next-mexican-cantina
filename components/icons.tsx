import type { SVGProps } from 'react';
import type { Amenity } from '../content/cantina';

// Small line icons. Decorative: always paired with visible text.
type IconName = Amenity['icon'] | 'pin' | 'mail' | 'arrow' | 'filter' | 'clock' | 'phone' | 'chevron';

const paths: Record<IconName, React.ReactNode> = {
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />,
  'walk-in': <><circle cx="13" cy="4.5" r="1.8" /><path d="M10 21l2-6 2.5 2.5V21M8 12l2.5-4.5h3L16 11l2.5 1M12.5 7.5L12 15" /></>,
  group: <><circle cx="8" cy="8" r="2.4" /><circle cx="16" cy="8" r="2.4" /><path d="M3.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5M11.5 19c0-3 2-5 4.5-5s4.5 2 4.5 5" /></>,
  kids: <><circle cx="8" cy="6" r="2" /><circle cx="16.5" cy="9" r="1.6" /><path d="M8 8v6m-3-3.5h6M6.5 20l1.5-6 1.5 6M16.5 10.6v4.4m-2-2.5h4M15 20l1.5-5 1.5 5" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19l8-8" /></>,
  glass: <><path d="M4.5 4.5h15l-6 6.5v6.5l3 2h-9l3-2V11z" /><path d="M7 7h10" /></>,
  access: <><circle cx="12" cy="4.5" r="1.7" /><path d="M6 8.5l6 1 6-1M12 9.5v5m0 0l-3 6m3-6l3 6" /></>,
  patio: <><path d="M3 9.5L12 4l9 5.5z" /><path d="M12 9.5V20M7 20h10M5 15h4m6 0h4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7l7.5 6 7.5-6" /></>,
  arrow: <><path d="M5 12h13" /><path d="M13 7l5 5-5 5" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  chevron: <path d="M7 10l5 5 5-5" />,
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
