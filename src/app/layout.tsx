// src/app/layout.tsx

import '../styles/globals.css'
import '../styles/scss/app.scss'
import { AppProvider } from './context/AppContext'
import WithHeaderAndFooter from './layouts/HeaderAndFooter'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '../components/GoogleAnalytics/GoogleAnalytics'
import { Metadata } from 'next'
import {
    roboto,
    raleway,
    lora,
    bentham,
    cutiveMono,
    montserratAlternates,
    playfairDisplay,
    madelyn,
} from './fonts'

const title = 'An Echo of The Heart'
const description = 'An Echo of the Heart, by Daniela Garcia, is a reflective blog on motherhood, creativity, living abroad, and intentional living—alongside BESPOKEN, offering inspired floral designs, artisan gifts and handcrafted adornments.'

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://anechooftheheart.com' : 'http://localhost:3000'),
    title,
    description,
    authors: [{ name: 'Guillermo Sotelo', url: 'https://www.linkedin.com/in/guillermosotelo/' }],
    openGraph: {
        title,
        description,
        images: [{ url: 'https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg' }],
        url: 'https://anechooftheheart.com',
        type: 'website',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`
            ${roboto.variable} 
            ${raleway.variable} 
            ${lora.variable} 
            ${bentham.variable} 
            ${cutiveMono.variable} 
            ${montserratAlternates.variable} 
            ${playfairDisplay.variable} 
            ${madelyn.variable}
          `}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </head>
            <body>
                <AppProvider>
                    <WithHeaderAndFooter>
                        <GoogleAnalytics />
                        <Toaster />
                        {children}
                    </WithHeaderAndFooter>
                </AppProvider>
            </body>
        </html>
    )
}