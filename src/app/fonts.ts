// app/fonts.ts
import { Roboto, Raleway, Lora, Cutive_Mono, Montserrat_Alternates, Playfair_Display, Bentham } from 'next/font/google'
import localFont from 'next/font/local'

// Google Fonts
export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
})

export const raleway = Raleway({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-raleway',
})

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-lora',
})

export const bentham = Bentham({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bentham',
})

export const cutiveMono = Cutive_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-cutive-mono',
})

export const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat-alternates',
})

export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
})

// Local Font (Madelyn)
export const madelyn = localFont({
  src: './fonts/Madelyn.woff2',
  display: 'swap',
  variable: '--font-madelyn',
})
