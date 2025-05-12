"use client"

import React, { useContext } from 'react'
import { AppContext } from '../../app/context/AppContext';
import { TEXT } from '../../constants/lang';
import { useRouter } from 'next/navigation';

type Props = {}

export default function Footer({ }: Props) {
    const router = useRouter()
    const { lang, isMobile } = useContext(AppContext)

    return (
        <div className="footer__container">
            <div className="footer__nav">
                <h4 className="footer__nav-link" onClick={() => router.push('/about')}>{TEXT[lang]['about2']}</h4>
                <h4 className="footer__nav-link" onClick={() => router.push('/policy')}>{isMobile ? TEXT[lang]['privacy'] : TEXT[lang]['privacy_policy']}</h4>
                <h4 className="footer__nav-link" onClick={() => router.push('/contact')}>{isMobile ? TEXT[lang]['contact2'] : TEXT[lang]['contact_me']}</h4>
                <h4 className="footer__nav-link" onClick={() => router.push('/subscribe')}>{TEXT[lang]['subscribe2']}</h4>
            </div>
            <div className="footer__social">
                <img className="footer__social-svg" draggable={false} onClick={() => window.open('https://www.instagram.com/its_danielagarcia/', '_blank', 'noreferrer')} src={'/assets/icons/instagram.svg'} />
                <img className="footer__social-svg" draggable={false} onClick={() => window.open('https://www.pinterest.se/bespoken_ar/', '_blank', 'noreferrer')} src={'/assets/icons/pinterest.svg'} />
                <img className="footer__social-svg" draggable={false} onClick={() => window.open('https://www.youtube.com/@bydanygarcia5800', '_blank', 'noreferrer')} src={'/assets/icons/youtube.svg'} />
            </div>
            <div className="footer__info">
                <h4 className="footer__signature"><i>With love, Dany</i></h4>
            </div>
            <div className="footer__info">
                <h4 className="footer__copyright no-pointer">© 2025</h4>
            </div>
        </div>
    )
}