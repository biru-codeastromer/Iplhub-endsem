import { Rubik_80s_Fade, Audiowide } from 'next/font/google';
import './globals.css';

export const rubik80sFade = Rubik_80s_Fade({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik',
});

export const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-audiowide',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rubik80sFade.variable} ${audiowide.variable}`}>
      <body>{children}</body>
    </html>
  );
}