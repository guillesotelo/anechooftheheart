"use client";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useState } from 'react';

const WithHeaderAndFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState<string[]>([])

    return (
        <>
            <main className="page__wrapper">
                <Header search={search} setSearch={setSearch} />
                {children}
                <Footer />
            </main>
        </>
    );
};

export default WithHeaderAndFooter;
