import type { ReactNode } from 'react';

/** Heading block for inner pages: a kicker, a big sign-painted title and a lede, on the lime-wash wall. */
export function PageHead({ eyebrow, title, children, id, before, after }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the eyebrow. */
  before?: ReactNode;
  /** Optional content under the lede. */
  after?: ReactNode;
}) {
  return (
    <header className="wrap pt-[clamp(2.75rem,6vw,4.5rem)] pb-[clamp(1.5rem,3vw,2.5rem)]">
      {before}
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h1 id={id} className="sign-name mt-3 mb-5 max-w-[18ch] text-[clamp(2.6rem,7vw,4.8rem)] leading-[1.02]">{title}</h1>
      {children ? <div className="max-w-(--measure) text-[clamp(1.08rem,1.6vw,1.22rem)] text-muted">{children}</div> : null}
      {after}
    </header>
  );
}
