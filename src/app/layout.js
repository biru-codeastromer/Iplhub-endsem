import { Poiret_One, Recursive } from 'next/font/google';
import './globals.css';

export const poiretOne = Poiret_One({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-poiret',
});

export const recursive = Recursive({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-recursive',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poiretOne.variable} ${recursive.variable}`}>
      <body>{children}</body>
    </html>
  );
}