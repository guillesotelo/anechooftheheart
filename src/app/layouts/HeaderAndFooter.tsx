"use client";

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const WithHeaderAndFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState<string[]>([])
    const pathname = usePathname()

    return (
        <>
            <main className="page__wrapper" style={{ paddingTop: pathname === '/' ? 0 : '' }}>
                <Header search={search} setSearch={setSearch} />
                {children}
                <Footer />
            </main>
        </>
    );
};

export default WithHeaderAndFooter;
