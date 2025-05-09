// src/app/layout.tsx

import '../styles/globals.css'
import '../styles/scss/app.scss'
import { AppProvider } from './context/AppContext'
import WithHeaderAndFooter from './layouts/HeaderAndFooter'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '../components/GoogleAnalytics/GoogleAnalytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
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