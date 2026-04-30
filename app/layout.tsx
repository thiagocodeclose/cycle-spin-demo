// @ts-nocheck
import type { Metadata } from 'next';
import { Bebas_Neue, Barlow } from 'next/font/google';
import './globals.css';

const bebas = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-bebas' });
const barlow = Barlow({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-barlow' });

export const metadata: Metadata = {
  title: 'Cycle House | Indoor Cycling NYC',
  description: 'Premium indoor cycling studio in New York City. Power rides, rhythm rides and sprint sessions that transform your cardio game.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${barlow.variable}`}>{children}</body>
    </html>
  );
}
