'use client'

import React, { useContext, useState } from 'react'
import { AppContext } from 'src/app/context/AppContext'
import Button from 'src/components/Button/Button'
import Carousel from "src/components/Carousel/Carousel"
import Player from 'src/components/Player/Player'
import SpotifyPlaylist from 'src/components/SpotifyPlaylist/SpotifyPlaylist'
const Track1 = '/assets/audio/Andrea-Vanzo-April.mp3'
const Track2 = '/assets/audio/Zamba-de-Abril.mp3'

const carouselImages = [
    { image: '/assets/images/abril/DSC01270.jpg' },
    { image: '/assets/images/abril/DSC01415.jpg' },
    { image: '/assets/images/abril/DSC01284.jpg' },
    { image: '/assets/images/abril/DSC01448.jpg' },
    { image: '/assets/images/abril/DSC01327.jpg' },
    { image: '/assets/images/abril/DSC01406.jpg' },
    { image: '/assets/images/abril/DSC01258.jpg' },
    { image: '/assets/images/abril/DSC01410.jpg' },
    { image: '/assets/images/abril/DSC01232.jpg' },
    { image: '/assets/images/abril/DSC01379.jpg' },
    { image: '/assets/images/abril/DSC01446.jpg' },
    { image: '/assets/images/abril/DSC01289.jpg' },
    { image: '/assets/images/abril/DSC01422.jpg' },
    { image: '/assets/images/abril/DSC01341.jpg' },
    { image: '/assets/images/abril/DSC01285.jpg' },
    { image: '/assets/images/abril/DSC01425.jpg' },
    { image: '/assets/images/abril/DSC01400.jpg' },
    { image: '/assets/images/abril/DSC01248.jpg' },
    { image: '/assets/images/abril/DSC01436.jpg' },
    { image: '/assets/images/abril/DSC01382.jpg' },
    { image: '/assets/images/abril/DSC01230.jpg' },
    { image: '/assets/images/abril/DSC01408.jpg' },
    { image: '/assets/images/abril/DSC01366.jpg' },
    { image: '/assets/images/abril/DSC01294.jpg' },
    { image: '/assets/images/abril/DSC01429.jpg' },
    { image: '/assets/images/abril/DSC01405.jpg' },
    { image: '/assets/images/abril/DSC01374.jpg' },
    { image: '/assets/images/abril/DSC01420.jpg' },
]

export default function BienvenidaAbril() {
    const [message, setMessage] = useState('')
    const [showPlayer, setShowPlayer] = useState(true)
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
    const { isMobile } = useContext(AppContext)

    const sendMessage = async () => {
        if (!message.trim()) return
        setStatus('sending')
        try {
            const res = await fetch('/api/family/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            if (!res.ok) throw new Error('Failed')
            setMessage('')
            setStatus('sent')
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="bienvenida-abril__container">
            <div className="bienvenida-abril__content">
                <h1 className='bienvenida-abril__title'>Bienvenida chiquitina</h1>
                <p className='bienvenida-abril__subtitle'>Fecha probable de parto: 24 de abril de 2026</p>
                <h3>Significado del nombre</h3>
                <p>
                    Abril nace del latín Aprilis, el mes en que la tierra despierta y la vida vuelve a florecer. Su nombre evoca la apertura de la primavera: renovación, esperanza y nuevos comienzos.
                </p>
                <p>
                    Como la primera flor después del invierno, Abril simboliza la suavidad de lo que llega para transformar. Un recordatorio de que cada vida trae su propia luz, equilibrio y nuevas formas de mirar el mundo.
                </p>
                <img src="/assets/images/abril/flowers.png" className='bienvenida-abril__image' />
                <p>
                    Mientras hemos ido navegando la mapaternidad en este país, poco a poco hemos comprendido la importancia de la inclusión familiar, del acompañamiento y de cómo algo tan simple como una conversación, un regalo o un saludo puede aportar a la vida de un niño.
                </p>
                <p>
                    Nuestro mundo cambió y, a su vez, nos convertimos en el mundo de nuestros chiquitos. Por eso, sentimos profundamente la presencia, la inclusión y el acompañamiento —incluso en la distancia— de cada uno de ustedes, especialmente mientras entendemos y disfrutamos la decisión de haber elegido a Suecia como el lugar para vivir esta etapa de nuestra vida.            </p>
                <p>
                    El aprendizaje ha sido inmenso, especialmente gracias a Benja. Ahora Abril llega a nuestra familia en un momento de mayor estabilidad y con unos padres que ya han aprendido mucho en el camino, pero que aún se siguen abriendo al cambio y la expansión.
                </p>
                <p>
                    Soñamos con un nacimiento hermoso y natural. Esperamos que Abril sea esa persona en la familia que traiga nuevas energías y equilibrio; que, a través de su forma de ser, su mirada y sus pensamientos, nos enseñe aún más sobre nosotros mismos y el mundo.
                </p>
                <p>
                    Gracias por leer estas palabras. Dejaremos un pequeño espacio para que puedan escribirle algún deseo, consejo o algo que pueda leer más adelante. Y, si sienten las ganas de enviarle un regalo simbólico, también compartimos una opción más abajo para quienes ya nos han preguntado. Sepan que esta parte es completamente opcional; solo queremos crear el espacio para quien lo desee.
                </p>
                <p>
                    Todos los mensajes que recibamos serán impresos y guardados en su libro del primer año.
                </p>
                <p style={{ marginTop: '2rem' }}>
                    Acá les dejamos unas fotitos de nuestro photo shoot.
                </p>
            </div>

            <div className='bienvenida-abril-carousel'>
                <Carousel cards={carouselImages} speed={180} style={{ height: isMobile ? '60vh' : '70vh' }} />
            </div>
            <div className="bienvenida-abril__content">
                <h3>Deja tu mensajito. No olvides escribir tu nombre!</h3>
                {status === 'sent' ? '' : <div className="bienvenida-abril__message">
                    {/* <img src="/assets/images/abril/box-msg.png" width='700' height='450' className='bienvenida-abril__image' /> */}
                    <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    className="bienvenida-abril__message-input" 
                    rows={20} 
                    cols={55} 
                    placeholder='Hola Abril...'/>
                </div>}
                <div className='bienvenida-abril__row'>
                    {status === 'sent' ? '' :
                        <Button
                            label={status === 'sending' ? 'Enviando...' : 'Enviar'}
                            handleClick={sendMessage}
                        />}
                    {status === 'sent' && <p style={{ color: 'darkgreen' }}>Mensaje enviado 💚</p>}
                    {status === 'error' && <p style={{ color: 'red' }}>Ocurrió un error, intenta de nuevo!</p>}
                </div>
            </div>
            <div className="bienvenida-abril__content" style={{ marginBottom: '16rem' }}>
                <h3>Fotos del primer añito</h3>
                <p style={{ fontFamily: 'Playfair Display, serif', color: '#938787' }}>
                    Coming soon...
                </p><br />
                <h3>¿Querés hacerle un regalito?</h3>
                <p style={{ textAlign: 'left' }}>
                    Si querés dejarlo, podés hacerlo a través de este link: <span><a href='https://revolut.me/dgarciasanguino' target='_blank'>https://revolut.me/dgarciasanguino</a> 🫶🏼</span> o a nuestras cuentas bancarias personales en Colombia o Argentina.
                </p>
                <div className='bienvenida-abril__row' style={{ margin: '2rem 0 4rem 0', justifyContent: 'center' }}>
                    <div className='bienvenida-abril__bankcard'>
                        <p>
                            <strong>Colombia</strong><br /><br />
                            C/A: 4884 3649 0327<br />
                            Luz Angela Sanguino Garcia
                        </p>
                    </div>
                    <div className='bienvenida-abril__bankcard'>
                        <p>
                            <strong>Argentina</strong><br /><br />
                            Alias: mp.guillermo.sotelo
                        </p>
                    </div>
                </div>

                <p>
                    Un abrazo enorme a todos, y GRACIAS por ser parte de esta bienvenida junto a nosotros.<br />
                </p>
                <p>Los amamos,</p>
                <p style={{ fontFamily: 'var(--font-madelyn), sans-serif', fontSize: '2.5rem' }}>Familia Sotelo Garcia</p>
            </div>
            {/* <SpotifyPlaylist playlist='https://open.spotify.com/embed/playlist/63EAKaQUy1C40YbQvsVHnq?utm_source=generator'/> */}
            {showPlayer ? <Player 
            filePath={[Track1, Track2]}
             setShowPlayer={setShowPlayer}
              autoplay
              titles={['Andrea Venzo - Abril', 'Raly Barrionuevo - Zamba de Abril']} /> : ''}
        </div>
    )
}