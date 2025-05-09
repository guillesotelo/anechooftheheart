import React, { createContext, useState, useLocation, useEffect } from 'react'
import { postType } from './types'

type AppContextType = {
    children: React.ReactNode
}

export const AppContext = createContext<AppContextType>({children} as AppContextType);

export const AppProvider: React.FC<AppContextType> = () => {
    const preferedLang = localStorage.getItem('preferedLang')
    const localLang = preferedLang ? preferedLang : navigator.language.startsWith('es') ? 'es' : 'en'
    const isInstagram = (navigator.userAgent.indexOf('Instagram') > -1) ? true : false
    const [search, setSearch] = useState<string[]>([])
    const [isMobile, setIsMobile] = useState(isInstagram || window.screen.width <= 640)
    const [lang, setLang] = useState<string>('en')
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const location = useLocation()

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth <= 768)

        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        ReactGA.send({
            hitType: 'pageview',
            page: window.location.pathname
        })

    }, [location, window.location.pathname])

    return (
        <AppContext.Provider value={{
            lang,
            setLang,
            search,
            setSearch,
            isMobile,
            setIsLoggedIn,
            isLoggedIn,
            darkMode,
            children
        }}>{children}</AppContext.Provider>
    )
}
