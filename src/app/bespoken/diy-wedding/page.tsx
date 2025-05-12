"use client"

import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "src/app/context/AppContext"
import { TEXT } from "src/constants/lang"
import { getScrappedImages } from "src/services/app"

export const renderDiyWedding = () => {
    const [wedding, setWedding] = useState<any>([])
    const [loading, setLoading] = useState({ products: false, wedding: false, adornments: false, gifts: false })
    const [showPin, setShowPin] = useState(-1)
    const { isMobile } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        getPinterestImages()
    }, [])

    const getPinterestImages = async () => {
        try {
            setLoading({ ...loading, wedding: true })
            const _wedding = await getScrappedImages('wedding')
            if (_wedding && Array.isArray(_wedding)) setWedding(_wedding.filter(img => img))
            setLoading({ ...loading, wedding: false })
        } catch (err) {
            console.error(err)
        }
    }

    const getPinterestUrl = (url: string) => `https://www.pinterest.se/pin/create/button/?url=${encodeURIComponent(url)}`

    return (
        <div className="bespoken__container">
            <div className="home__landing-image-wrapper" style={{ marginTop: isMobile ? '-1rem' : '-5rem' }}>
                <img src={'/assets/images/bespoken-wedding-landing.png'} alt="Bespoken" className="home__landing-image" />
            </div>
            <p className="bespoken__product-goback" onClick={() => router.push('/')}>↩ An Echo of The Heart</p>
            <div className="page__header">
                <h1 className="page__header-title">Our DIY Wedding</h1>
            </div>
            <div className="bespoken__row">
                <div className="bespoken__col" style={{ width: isMobile ? '' : '70vw' }}>
                    <h2 className="bespoken__subtitle">
                        Proposal
                    </h2>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        Guille proposed to me an afternoon when we were coming back from a weekend coast trip in the summer. We passed by a field of sunflowers and made a stop because he “wanted to make a video with his drone”. As I was holding Indie and picking up flowers (completely unaware of what was happening), he asked me to take his control remote for a minute, and suddenly I saw how he was down on one knee, with a red little box holding a beautiful ring. I was in shock at what was happening and felt a deep pressure in my body. A rush of thoughts came to my mind, along with a bit of adrenaline and happiness. Of course, I said yes!
                    </p>
                    <br /><br />
                    <h2 className="bespoken__subtitle">
                        Planning
                    </h2>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        And so, little by little, the planning started. This was the year 2021; we were in the middle of covid and also in a year when we had both left our jobs to become entrepreneurs and make a change in our career path, so setting up a date (and budget) took us a bit of time, but we finally decided for March 2022.
                    </p>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        Both Guille and I love being hosts and are great at doing things. I had also just finished a three-year job as event manager, so we knew from the start who would be our wedding’s planners (us, of course).
                    </p>

                    <h2 className="bespoken__subtitle">
                        Step-by-step list
                    </h2>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        1. We thought about what type of wedding we wanted and where. We agreed on a Bohemian/country wedding style in Buenos Aires.
                        <br /><br />2. Overviewed venues, places and prices. We chose <a href='https://hosteriaelcazador.com.ar/' target='_blank' style={{ color: '#5D8C8C' }}>Hostería el Cazador</a>, a beautiful historical venue in Escobar.
                        <br /><br />3. Guille created our personal <a href='https://danyguille.vercel.app/' target='_blank' style={{ color: '#5D8C8C' }}>wedding website</a>.
                        <br /><br />4. We made the guest list, designed the invitations and sent them out.
                        <br /><br />5. In the middle, I took a 3-month trip to Colombia, where I was able to spend some time with my family and also have my dress done by the family dressmaker, Estelita. I had a surprise Bachelorette party from my mom with very close family friends.
                        <br /><br />6. Budgets, planning, suppliers, food tasting, make-up and hair stylists, photographers, and cake designers.
                        <br /><br />7. Pinterest “brain-image storm” and shopping for decor. We loved hitting Tigre, where we found so many hand-made products.
                        <br /><br />8. Designs, event layout, logistics, payments, seating charts, and music playlists!
                        <br /><br />9. Pre-wedding shoot.
                        <br /><br />10. Arrange family visits, accommodations, and travel; compose my flower crown and boutonnieres, among other things.
                    </p>

                    <h2 className="bespoken__subtitle">
                        The day
                    </h2>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        We expected around 120 guests. We had no idea how much work we would have to do that day and the day before...I was a bit naive about timings and putting together flower arrangements and decoration, plus all the details that you need to attend. So we were lucky to have more then 15 people (friends and family members) helping us out everywhere! It was intense, but we enjoyed every moment of it. Although, I have to say that if I organise or advice someone about a DIY wedding, I definitely know now what are the things that you need to delegate and approximate timings.
                    </p>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        We did have our wedding coordinator during the event, which is something you cannot miss. Plus, the catering, music and part of the setting was all hired to work without any of our help. Also, within the venue, there was a little side-house where we were able to ready.
                    </p>
                    <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                        That day the weather wasn't sunny and there was in fact some rain predicted in the forecast, so we had to move the wedding inside the building. Talk about plans changing and readjusting! But, it turned out amazing and we enjoyed it so much!
                    </p>
                    {wedding.length ?
                        <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                            Enjoy our photos!
                        </p>
                        : ''}
                </div>
            </div>
            <br /><br />
            <div className='bespoken__product-col'>
                <div className="bespoken__product-list">
                    {wedding.map((imageUrl: string, i: number) =>
                        <div
                            key={i}
                            className="bespoken__product-image-wrapper"
                            onMouseEnter={() => setShowPin(i)}
                            onMouseLeave={() => setShowPin(-1)}
                            style={{ animationDelay: `${i * 200}ms`, height: isMobile ? '20vh' : '10vw' }}
                        >
                            <img src={imageUrl} alt={`Image ${i}`} className='bespoken__product-image' style={{ height: isMobile ? '20vh' : '10vw' }} />
                            <a href={getPinterestUrl(imageUrl)} target='_blank'>
                                <img
                                    src={'/assets/icons/pinterest-color.svg'}
                                    alt='Save to Pinterest'
                                    className={`bespoken__product-image-pin${showPin === i ? '--show' : ''}`}
                                />
                            </a>
                        </div>)}
                </div>
                {wedding.length ?
                    <a href={'https://www.pinterest.se/bespoken_ar/our-diy-wedding/'} target='_blank'><button className="bespoken__product-seemore">See more ➤</button></a>
                    :
                    loading.wedding ?
                        <div style={{ textAlign: 'center' }}>
                            <span className="loader"></span>
                            <p>Connecting with Pinterest...</p>
                        </div>
                        : ''
                }
            </div>
        </div>
    )
}