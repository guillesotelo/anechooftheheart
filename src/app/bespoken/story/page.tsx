"use client"

import { useRouter } from "next/navigation"
import { useContext } from "react"
import { AppContext } from "src/app/context/AppContext"
import Button from "src/components/Button/Button"
import Carousel from "src/components/Carousel/Carousel"
import { APP_COLORS } from "src/constants/app"
import { whatsappMessage } from '../../../constants/whatsappMessage'

export default function renderStory() {
    const { isMobile } = useContext(AppContext)
    const router = useRouter()

    const carouselImages = [
        {
            image: '/assets/images/carousel1.png'
        },
        {
            image: '/assets/images/carousel2.png'
        },
        {
            image: '/assets/images/carousel3.png'
        },
        {
            image: '/assets/images/carousel4.png'
        },
        {
            image: '/assets/images/carousel5.jpg'
        },
        {
            image: '/assets/images/carousel6.jpg'
        },
        {
            image: '/assets/images/carousel7.jpg'
        },
        {
            image: '/assets/images/carousel8.jpg'
        },
        {
            image: '/assets/images/carousel9.jpg'
        },
        {
            image: '/assets/images/carousel10.jpg'
        },
    ]

    const carouselImages2 = [
        {
            image: '/assets/images/carousel2-1.png'
        },
        {
            image: '/assets/images/carousel2-2.jpg'
        },
        {
            image: '/assets/images/carousel2-3.jpg'
        },
        {
            image: '/assets/images/carousel2-4.jpg'
        },
        {
            image: '/assets/images/carousel2-5.jpeg'
        },
        {
            image: '/assets/images/carousel2-6.jpg'
        },
        {
            image: '/assets/images/carousel2-7.jpg'
        },
    ]


    const whatsappMe = () => {
        const anchor = document.createElement('a')
        anchor.href = `https://wa.me/460729678696?text=${encodeURIComponent(whatsappMessage)}}`
        anchor.target = '_blank'
        anchor.click()
    }


    return (
        <div className="bespoken__container">
            <div className="home__landing-image-wrapper" style={{ marginTop: isMobile ? '-1rem' : '-5rem' }}>
                <img src={'/assets/images/bespoken-landing-compressed.jpg'} alt="Bespoken" className="home__landing-image" />
            </div>
            <div className="page__header"><p className="bespoken__product-goback" onClick={() => router.push('/')}>↩ An Echo of The Heart</p>
                <h1 className="page__header-title">Story of The Beginning</h1>
            </div>
            <div className="bespoken__row">
                <div className="bespoken__col">
                    <h2 className="bespoken__subtitle">
                        From Wildflowers to BESPOKEN: A Creative Journey Into Floral Design
                    </h2>
                    <p className="bespoken__text">
                        It was the summer of 2021, and I had just finished leading a regional online event for Media.Monks, the company I worked at, making it one of the biggest coordination projects of my career so far. During the pandemic, gift boxes for employees became a very popular trend, and I was able to partake in the logistics and selection of them, which was something I really enjoyed doing. And there were a lot of things I enjoyed about my job, but I was ready to move on and find other new, creative horizons that made sense for the type of life I wanted to live. And so, my search began.
                    </p>
                    <p className="bespoken__text">
                        During the holidays, one afternoon at my parents-in-law’s cottage near the Uruguay River, I collected some flowers and long leaves. I felt like a little girl, fascinated and lost in time. Creativity took hold of me, and I started making adornments to put over our heads. It was at that exact moment that the DREAM of the brand came true. Flowers, adornments, crafting, and gifts! I would use all of my insights and experiences, my values and the things I found lovely to create all the details of the brand.
                    </p>
                    <p className="bespoken__text">
                        And so BESPOKEN was born to offer a unique service of crafted gifts, events experiences, and flower adornments, clearly defined with a Bohemian style, well-known products and charming details. The heart's business was inspired by my own life values. I wanted to accompany my clients in their special moments, by helping them enhance their intention of gifting and celebrating.
                    </p>
                </div>
                <div className="bespoken__col">
                    <img src={'/assets/images/bespoken-story.png'} alt="Story Image" className="bespoken__story-img" />
                </div>
            </div>
            <div className="bespoken__row" style={{ marginTop: '6rem' }}>
                <div className="bespoken__col" style={{ width: '100%' }}>

                    <h2 className="bespoken__subtitle" style={{ alignSelf: 'center' }}>
                        In just one year...
                    </h2>
                    <p className="bespoken__text" style={{ textAlign: 'center' }}>
                        +60 sales and clients from Argentina, Colombia, Peru and the USA
                        <br /><br />
                        Worked with local and imported products from Argentina, Colombia, Turkey and India
                        <br /><br />
                        Incorporated handmade works with gold baths and native craftsmen for jewellery .
                        <br /><br />
                        Produced wedding bouquets, crowns and exclusive ear adornments.
                        <br /><br />
                        Participated in local fairs for entrepreneurs and had a 2 week showroom.
                        <br /><br />
                        Better to give - 5% of sales where destined for people in need.
                    </p>
                </div>
            </div>

            <div className="bespoken__row" style={{ marginTop: '6rem', width: '100vw' }}>
                <Carousel cards={carouselImages} />
            </div>

            <Button
                label='View products'
                handleClick={() => router.push(`/bespoken/products`)}
                style={{ transform: 'scale(1.3)', margin: '1rem 0 4rem 0' }}
                bgColor={APP_COLORS.GRASS}
                textColor='white'
            />

            <div className="bespoken__row" >
                <div className="bespoken__col" style={{ margin: '4rem 0 0 0' }}>
                    <img
                        style={{ height: '80vh' }}
                        src={'/assets/images/bespoken-contact.jpg'}
                        alt="Story Image"
                        className="bespoken__story-img"
                        loading='lazy' />
                </div>
            </div>

            <div className="bespoken__row" >
                <div className="bespoken__col" style={{ margin: '0 0 4rem' }}>
                    <h2 className="bespoken__subtitle" style={{ alignSelf: 'center', textAlign: 'center', margin: '0 0 2rem 0', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#a5a5a5' }}>
                        Are you looking for a personalized gift or adornment?
                    </h2>
                    <Button
                        label='Contact me'
                        handleClick={() => whatsappMe()}
                        style={{ transform: 'scale(1.3)' }}
                        bgColor={APP_COLORS.GRASS}
                        textColor='white'
                    />
                </div>
            </div>

            <div className="bespoken__row" style={{ marginTop: '6rem' }}>
                <div className="bespoken__col" style={{ width: '100%' }}>
                    <h2 className="bespoken__subtitle" style={{ textAlign: 'center', width: '100%' }}>
                        Client's Experience
                    </h2>
                    <div className="bespoken__row" style={{ alignItems: isMobile ? '' : 'flex-start' }}>
                        <div className="bespoken__col">
                            <h3 className="bespoken__subtitle">
                                Gift boxes
                            </h3>
                            <p className="bespoken__text">
                                “Dear Dany, thank you for the love put into everything. I discover loving details.”
                                <br /><br />
                                “Thanks to you, it's felt when things are done with love!”
                                <br /><br />
                                “Hi! Really lovely, she loved it! She said: What a presentation! Spectacular and the seal gives it a very special touch. I am very happy and I look great! Thank you very much, God bless you”.
                                <br /><br />
                                “I'm so proud to be your friend, every experience is incredible and unique! But you always have more and surprise me. The world is yours, friend!”
                                <br /><br />
                                “The delicate and personal touch you give to the boxes is tremendously beautiful.”
                                <br /><br />
                                “She loved it, Daniela! Thank you. The coffee tastes great! Everything is amazing, top marks”.
                                <br /><br />
                                “She absolutely LOVED IT”!
                                <br /><br />
                                “She loved it! It was beautiful, congratulations Dani. Everything is so well taken care of, with love and attention to detail. The curation of the photos simply WOW. The level of personalization in the attention, patience, and assembly of the gift is simply impeccable. I knew I could trust you. Pure BESPOKEN magic! Thank you for being my accomplice”!
                                <br /><br />
                            </p>
                        </div>
                        <div className="bespoken__col">
                            <h3 className="bespoken__subtitle">
                                Adornments & Bouquets
                            </h3>
                            <p className="bespoken__text">
                                “Delicate, beautiful, unique! Thank you for your good taste and dedication. We love and value your spectacular work”.
                                <br /><br />
                                “A beauty! Beautiful flowers, beautiful presentation!”
                                <br /><br />
                                “Your work highlights the beauty of my girls”.
                                <br /><br />
                            </p>
                        </div>
                    </div>
                    {/* <div className="bespoken__row" >
                            <div className="bespoken__col">
                                <img
                                    style={{ height: '60vh', width: 'auto' }}
                                    src={BespokenOneYear}
                                    alt="Story Image"
                                    className="bespoken__story-img"
                                    loading='lazy' />
                                <p><i>Bespoken's One Year anniversary - Buenos Aires 2022</i></p>
                            </div>
                        </div> */}
                </div>
            </div>

            <div className="bespoken__row" style={{ margin: '6rem', width: '100vw' }}>
                <Carousel cards={carouselImages2} />
            </div>

            <div className="bespoken__row" >
                <div className="bespoken__col">
                    <img
                        style={{
                            height: isMobile ? 'auto' : '80vh',
                            width: isMobile ? '90vw' : 'auto'
                        }}
                        src={'/assets/images/bespoken-book.png'}
                        alt="Story Image"
                        className="bespoken__story-img"
                        loading='lazy' />
                </div>
            </div>

        </div >
    )
}