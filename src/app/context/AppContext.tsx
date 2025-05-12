"use client";

import React, { createContext, useEffect, useState } from 'react'
import { AppContextType } from '../types'
import { verifyToken } from '../../services/user'
import { getUser } from '../../helpers'
import ReactGA from 'react-ga4';
import { usePathname } from 'next/navigation';

export const AppContext = createContext<AppContextType>({
    lang: 'en',
    setLang: () => { },
    search: [],
    setSearch: () => { },
    isMobile: false,
    isLoggedIn: null,
    setIsLoggedIn: () => { },
    darkMode: false,
    children: <></>,
})

type Props = {
    children?: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    const isInstagram = (navigator.userAgent.indexOf('Instagram') > -1) ? true : false
    const [isMobile, setIsMobile] = useState(false)
    const [lang, setLang] = useState<string>('en')
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const [search, setSearch] = useState<string[]>([])
    const [windowLoading, setWindowLoading] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowLoading(false)
            setLang(localStorage.getItem('lang') || 'en')
        }

        setIsMobile(isMobileDevice())
        const checkWidth = () => setIsMobile(window.innerWidth <= 768)

        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        ReactGA.send({
            hitType: 'pageview',
            page: pathname
        })

    }, [pathname])

    const isMobileDevice = () => {
        if (typeof window === 'undefined') return false // Server-side check

        const width = window.innerWidth
        const userAgent = window.navigator.userAgent.toLowerCase()

        const mobileKeywords = [
            'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'
        ]

        const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword))
        const isSmallScreen = width <= 768

        return isMobile || isSmallScreen
    }

    const getPreferredScheme = () => {
        const savedMode = localStorage.getItem('preferredMode')
        const mode = JSON.parse(localStorage.getItem('preferredMode') || 'false')
        setDarkMode(savedMode ? mode : window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches)
    }

    const verifyUser = async () => {
        try {
            const verified = await verifyToken(getUser().token)
            if (verified && verified.token) {
                setIsLoggedIn(true)
            } else setIsLoggedIn(false)
        } catch (error) {
            setIsLoggedIn(false)
        }
    }

    const contextValue = React.useMemo(() => ({
        lang,
        setLang,
        search,
        setSearch,
        isMobile,
        isLoggedIn,
        setIsLoggedIn,
        darkMode,
        children
    }), [
        lang,
        setLang,
        search,
        setSearch,
        isMobile,
        isLoggedIn,
        setIsLoggedIn,
        darkMode,
        children
    ])


    return windowLoading ? null : <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
}
