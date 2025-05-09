import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext';
import { TEXT } from '../../constants/lang';
import Instagram from '../../assets/icons/instagram.svg'
import Pinterest from '../../assets/icons/pinterest.svg'
import Youtube from '../../assets/icons/youtube.svg'
import { history } from '../../helpers';

type Props = {}

export default function Footer({ }: Props) {
    const history = useHistory()
    const { lang, isMobile } = useContext(AppContext)

    return (
        <div className="footer__container">
            <div className="footer__nav">
                <h4 className="footer__nav-link" onClick={() => history.push('/about')}>{TEXT[lang]['about2']}</h4>
                <h4 className="footer__nav-link" onClick={() => history.push('/privacyPolicy')}>{isMobile ? TEXT[lang]['privacy'] : TEXT[lang]['privacy_policy']}</h4>
                <h4 className="footer__nav-link" onClick={() => history.push('/contact')}>{isMobile ? TEXT[lang]['contact2'] : TEXT[lang]['contact_me']}</h4>
                <h4 className="footer__nav-link" onClick={() => history.push('/subscribe')}>{TEXT[lang]['subscribe2']}</h4>
            </div>
            <div className="footer__social">
                <img className="footer__social-svg" draggable={false} onClick={() => window.open('https://www.instagram.com/its_danielagarcia/', '_blank', 'noreferrer')} src={Instagram} />
                <img className="footer__social-svg" draggable={false} onClick={() => window.open('https://www.pinterest.se/bespoken_ar/', '_blank', 'noreferrer')} src={Pinterest} />
                <img className="footer__social-svg" draggable={false} onClick={() => window.open('https://www.youtube.com/@bydanygarcia5800', '_blank', 'noreferrer')} src={Youtube} />
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