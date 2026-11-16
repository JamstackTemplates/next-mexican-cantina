import { flagDesign } from '../lib/papel';
import { Flag } from './papel-banner';

/** The cantina's mark: one small papel-picado flag cut with a star, in marigold. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block w-7 flex-none sm:w-8 ${className}`} style={{ '--flag': 'var(--flag-marigold)' } as React.CSSProperties}>
      <Flag design={flagDesign('logo', 'star')} maskId="logo-flag" />
    </span>
  );
}
