"use client";

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const WithHeaderAndFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState<string[]>([])
    const [bespokenLogo, setBespokenLogo] = useState('')
    const pathname = usePathname()

    useEffect(() => {
        if (pathname.includes('/bespoken') || pathname.includes('/store')) setBespokenLogo('/assets/logos/bespoken-white.png')
        else setBespokenLogo('')
    }, [pathname])

    return (
        <>
            <main className="page__wrapper" style={{ paddingTop: pathname === '/' ? 0 : '' }}>
                <Header search={search} setSearch={setSearch} bespokenLogo={bespokenLogo} />
                {children}
                <Footer />
            </main>
        </>
    );
};

export default WithHeaderAndFooter;
