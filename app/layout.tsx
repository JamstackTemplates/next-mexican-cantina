import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'jamstacks';
import { ThemeScript } from 'jamstacks/server';
import '@fontsource/shrikhand/latin-400.css';
import '@fontsource-variable/rubik/wght.css';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { cantina } from '../content/cantina';
import { site } from '../lib/site';
import './tailwind.input.css';

// Absolute URLs only when the deployed URL is known at build time. Never fall back to localhost.
const socialImage = site.url ? [{ url: `${site.url}/og.png`, width: 1200, height: 630, alt: `${cantina.name}: ${cantina.tagline}` }] : undefined;
const description = site.description || cantina.introduction;
const title = `${cantina.name} · Mexican cantina`;

export const metadata: Metadata = {
  title: { default: title, template: `%s · ${cantina.name}` },
  description,
  applicationName: site.name,
  ...(site.url ? { metadataBase: new URL(`${site.url}/`) } : {}),
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    ...(site.url ? { url: `${site.url}/` } : {}),
    images: socialImage,
  },
  twitter: { card: socialImage ? 'summary_large_image' : 'summary' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c2185b' },
    { media: '(prefers-color-scheme: dark)', color: '#7a1440' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <a className="absolute -top-16 left-4 z-[200] rounded-ui bg-ink px-4 py-2.5 font-bold text-bg no-underline focus:top-4" href="#main">Skip to content</a>
          <SiteHeader />
          <main id="main" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
