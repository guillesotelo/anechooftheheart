"use client"

import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { TEXT } from '../../constants/lang'
import { useRouter } from 'next/navigation'

export default function Bespoken() {
    const router = useRouter()
    const { lang } = useContext(AppContext)

    return (
        <div className="bespoken__container">
            <div className="bespoken__section-card" onClick={() => router.push('/store')}>
                <h2 className="bespoken__section-title">{lang === 'es' ? 'TIENDA' : 'STORE'}</h2>
            </div>
            <div className="bespoken__section-card" onClick={() => router.push('/bespoken/story')}>
                <h2 className="bespoken__section-title">{TEXT[lang]['story']}</h2>
                {/* <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'Un pedacito de la historia de la marca' :
                            `A bit of the brand's router`
                        }
                    </h3> */}
            </div>
            <div className="bespoken__section-card" onClick={() => router.push('/bespoken/products')}>
                <h2 className="bespoken__section-title">{TEXT[lang]['products']}</h2>
                {/* <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'Mira lo que se hace en el taller' :
                            `See what's being made at the workshop`
                        }
                    </h3> */}
            </div>
            <div className="bespoken__section-card" onClick={() => router.push('/bespoken/our_handcrafted_wedding')}>
                <h2 className="bespoken__section-title">{TEXT[lang]['our_handcrafted_wedding']}</h2>
                {/* <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'Nuestra forma de celebrar el compromiso' :
                            `Our way of celebrating commitment`
                        }
                    </h3> */}
            </div>
            {/* <div className="bespoken__section-card" onClick={() => router.push('/bespoken/values')}>
                    <h2 className="bespoken__section-title">{TEXT[lang]['values']}</h2>
                    <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'El latido de corazón al hacer' :
                            `The heartbeat upon the making`
                        }
                    </h3>
                </div> */}
        </div>
    )

}