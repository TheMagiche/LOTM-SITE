import type { Metadata } from 'next';
import { Cinzel, EB_Garamond } from 'next/font/google';
import './globals.css';
import './landing.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lord of the Mysteries — Desktop Download',
  description:
    'Download the local-first Lord of the Mysteries AI narrative RPG for Windows, macOS, and Linux. Bring your own key. Campaigns stay on your machine.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${garamond.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
