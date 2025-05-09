"use client";
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useState } from 'react';

const WithHeaderAndFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [search, setSearch] = useState<string[]>([])

    return (
        <>
            <Header search={search} setSearch={setSearch} />
            <main className="page__container">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default WithHeaderAndFooter;
