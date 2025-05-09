import { useContext, useEffect, useState } from 'react'
import StoryImage from '../../assets/images/bespoken-story.png'
import Carousel from '../../components/Carousel/Carousel'
import Carousel1 from '../../assets/images/carousel1.png'
import Carousel2 from '../../assets/images/carousel2.png'
import Carousel3 from '../../assets/images/carousel3.png'
import Carousel4 from '../../assets/images/carousel4.png'
import Carousel5 from '../../assets/images/carousel5.jpg'
import Carousel6 from '../../assets/images/carousel6.jpg'
import Carousel7 from '../../assets/images/carousel7.jpg'
import Carousel8 from '../../assets/images/carousel8.jpg'
import Carousel9 from '../../assets/images/carousel9.jpg'
import Carousel10 from '../../assets/images/carousel10.jpg'
import Carousel2_1 from '../../assets/images/carousel2-1.png'
import Carousel2_2 from '../../assets/images/carousel2-2.jpg'
import Carousel2_3 from '../../assets/images/carousel2-3.jpg'
import Carousel2_4 from '../../assets/images/carousel2-4.jpg'
import Carousel2_5 from '../../assets/images/carousel2-5.jpeg'
import Carousel2_6 from '../../assets/images/carousel2-6.jpg'
import Carousel2_7 from '../../assets/images/carousel2-7.jpg'
import BespokenContact from '../../assets/images/bespoken-contact.jpg'
import { AppContext } from '../../AppContext'
import { useLocation, useHistory } from 'react-router-dom'
import PinterestSave from '../../assets/icons/pinterest-color.svg'
import { getScrappedImages } from '../../services/app'
import { TEXT } from '../../constants/lang'
import LandingWedding from '../../assets/images/bespoken-wedding-landing.png'
import LandingBespoken from '../../assets/images/bespoken-landing-compressed.jpg'
import FlowerAdornments from '../../assets/images/products-adornments.png'
import FlowerArrangements from '../../assets/images/products-arrangements.png'
import ProductGifts from '../../assets/images/products-gifts.png'
import BespokenBook from '../../assets/images/bespoken-book.png'
import Button from '../../components/Button/Button'
import { APP_COLORS } from '../../constants/app'
import { whatsappMessage } from '../../constants/whatsappMessage'

type Props = {
    page?: string
}

export default function Bespoken({ page }: Props) {
    const { lang, isMobile } = useContext(AppContext)
    const [arrangements, setArrangements] = useState<any>([])
    const [adornments, setAdornments] = useState<any>([])
    const [gifts, setGifts] = useState<any>([])
    const [wedding, setWedding] = useState<any>([])
    const [images, setImages] = useState<any>([])
    const [products, setProducts] = useState('')
    const [pinterestPage, setPinterestPage] = useState('')
    const [showPin, setShowPin] = useState(-1)
    const [loading, setLoading] = useState({ products: false, wedding: false, adornments: false, gifts: false })
    const location = useLocation()
    const history = useHistory()

    const arrangementsUrl = 'https://www.pinterest.se/bespoken_ar/flower-arrangements/'
    const adornmentsUrl = 'https://www.pinterest.se/bespoken_ar/flower-adornments/'
    const giftsUrl = 'https://www.pinterest.se/bespoken_ar/bespoken-gifts/'
    const weddingUrl = 'https://www.pinterest.se/bespoken_ar/our-diy-wedding/'

    const adornmentsCaption = `I started composing natural flower crowns at the cottage of my in-laws in the summer of 2021. From that time on, I started learning about flowers and techniques so I could create different designs for crowns and ear-cuffs. Materials: Natural flowers, fabric, cold porcelain, stones, among others.`
    const giftsCaption = `It's all about the intention, the love and the details ✨ I found myself creating different gift proposals I called "experiences", as they involve the sensory levels of seeing, touching, tasting and smelling. These were all crafted with a lot of detail and time. All of them were carefully designed for each customer with selected products and brands. As for the packaging and presentation, I chose carton boxes, jute twine, dried flowers and our personalised stamp with sealing wax.`
    const arrangementsCaptions = 'There is a very special feeling I get when I’m out picking flowers, when I bring them home to arrange them and make a composition. Although I have a tendency of “perfection” I like to be a free creator and make my own designs. My dream is to keep my hands busy creating, learning and enjoying the pleasure of holding flowers and making people and spaces joyful and beautiful.'

    const carouselImages = [
        {
            image: Carousel1
        },
        {
            image: Carousel2
        },
        {
            image: Carousel3
        },
        {
            image: Carousel4
        },
        {
            image: Carousel5
        },
        {
            image: Carousel6
        },
        {
            image: Carousel7
        },
        {
            image: Carousel8
        },
        {
            image: Carousel9
        },
        {
            image: Carousel10
        },
    ]

    const carouselImages2 = [
        {
            image: Carousel2_1
        },
        {
            image: Carousel2_2
        },
        {
            image: Carousel2_3
        },
        {
            image: Carousel2_4
        },
        {
            image: Carousel2_5
        },
        {
            image: Carousel2_6
        },
        {
            image: Carousel2_7
        },
    ]

    useEffect(() => {
        getPinterestImages()
    }, [])

    useEffect(() => {
        const category = new URLSearchParams(document.location.search).get('category')
        const categories: { [value: string]: string } = {
            'arrangements': 'Flower Arrangements',
            'adornments': 'Flower Adornments',
            'gifts': 'Bespoken Gifts'
        }
        if (category) setProducts(categories[category])
        else setProducts('')
    }, [location])

    useEffect(() => {
        const imgs = getName(products, 'arrangements') ? arrangements :
            getName(products, 'adornments') ? adornments :
                getName(products, 'gifts') ? gifts : []

        setImages(imgs)
        getPinterestPage()
    }, [products, arrangements, adornments, gifts])

    const getName = (products: string, name: string) => {
        return products.toLowerCase().includes(name)
    }

    const getPinterestImages = async () => {
        try {
            if (page && (page.includes('WEDDING') || page.includes('BODA'))) {
                setLoading({ ...loading, wedding: true })
                const _wedding = await getScrappedImages('wedding')
                if (_wedding && Array.isArray(_wedding)) setWedding(_wedding.filter(img => img))
                setLoading({ ...loading, wedding: false })
            } else {
                setLoading({ ...loading, products: true })
                const _arrangements = await getScrappedImages('arrangements')
                if (_arrangements && Array.isArray(_arrangements)) setArrangements(_arrangements.filter(img => img))
                setLoading({ ...loading, products: false })

                setLoading({ ...loading, adornments: true })
                const _adornments = await getScrappedImages('adornments')
                if (_adornments && Array.isArray(_adornments)) setAdornments(_adornments.filter(img => img))
                setLoading({ ...loading, adornments: false })

                setLoading({ ...loading, gifts: true })
                const _gifts = await getScrappedImages('gifts')
                if (_gifts && Array.isArray(_gifts)) setGifts(_gifts.filter(img => img))
                setLoading({ ...loading, gifts: false })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getProductCaption = () => {
        return getName(products, 'arrangements') ? arrangementsCaptions :
            getName(products, 'adornments') ? adornmentsCaption :
                getName(products, 'gifts') ? giftsCaption : ''
    }

    const getPinterestPage = () => {
        setPinterestPage(getName(products, 'arrangements') ? arrangementsUrl :
            getName(products, 'adornments') ? adornmentsUrl :
                getName(products, 'gifts') ? giftsUrl : weddingUrl)
    }

    const getPinterestUrl = (url: string) => `https://www.pinterest.se/pin/create/button/?url=${encodeURIComponent(url)}`

    const whatsappMe = () => {
        const anchor = document.createElement('a')
        anchor.href = `https://wa.me/460729678696?text=${encodeURIComponent(whatsappMessage)}}`
        anchor.target = '_blank'
        anchor.click()
    }
    const renderStory = () => {
        return (
            <div className="bespoken__container">
                <div className="home__landing-image-wrapper" style={{ marginTop: isMobile ? '-1rem' : '-5rem' }}>
                    <img src={LandingBespoken} alt="Bespoken" className="home__landing-image" />
                </div>
                <div className="page__header"><p className="bespoken__product-goback" onClick={() => history.push('/')}>↩ {TEXT[lang].anechooftheheart}</p>
                    <h1 className="page__header-title">{page ? TEXT[lang][page.toLowerCase()] || page : ''}</h1>
                </div>
                <div className="bespoken__row">
                    {lang === 'es' ?
                        <div className="bespoken__col">
                            <h2 className="bespoken__subtitle">
                                Historia de la marca
                            </h2>
                            <p className="bespoken__text">
                                Era el verano de 2021 y acababa de terminar de liderar un evento regional en línea para Media.Monks, la empresa en la que trabajaba, convirtiéndolo en uno de los proyectos de coordinación más grande de mi carrera hasta el momento. Durante la pandemia, las cajas de regalo para los empleados se volvieron una tendencia muy popular y pude participar en la logística y selección de ellas, algo que realmente disfruté hacer aparte de los eventos presenciales. Había muchas cosas que me gustaban de mi trabajo, pero estaba lista para seguir adelante y encontrar nuevos horizontes creativos que tuvieran sentido para el tipo de vida que quería llevar. Y así comenzó mi búsqueda.
                            </p>
                            <p className="bespoken__text">
                                Durante las vacaciones, una tarde en la cabaña de mis suegros cerca del río Uruguay, recogí algunas flores y hojas largas. Me sentía como una niña pequeña, fascinada y perdida en el tiempo. La creatividad me tomo por sorpresa y empecé a hacer adornos para poner sobre nuestras cabezas. Fue en ese preciso momento cuando nació el SUEÑO de la marca. ¡Flores, adornos, manualidades, regalos! Utilizaría todas mis ideas y experiencias, mis valores y las cosas que encontraba encantadoras para crear todos los detalles de la marca.                            </p>
                            <p className="bespoken__text">
                                Y así nació BESPOKEN, para ofrecer un servicio único de regalos, eventos personalizados y experiencias con adornos florales, claramente definidos con un estilo bohemio, productos reconocidos y detalles encantadores. El corazón del negocio se basaban en mis propios valores de vida. Quería acompañar a mis clientes en sus momentos especiales, ayudándoles a realzar su intención de regalar y celebrar.
                            </p>
                        </div>
                        :
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
                    }
                    <div className="bespoken__col">
                        <img src={StoryImage} alt="Story Image" className="bespoken__story-img" />
                    </div>
                </div>
                <div className="bespoken__row" style={{ marginTop: '6rem' }}>
                    <div className="bespoken__col" style={{ width: '100%' }}>
                        {lang === 'es' ?
                            <>
                                <h2 className="bespoken__subtitle" style={{ alignSelf: 'center' }}>
                                    En solo un año...
                                </h2>
                                <p className="bespoken__text" style={{ textAlign: 'center' }}>
                                    +60 ventas y clientes de Argentina, Colombia, Perú y Estados Unidos
                                    <br /><br />
                                    Trabajé con productos locales e importados de Argentina, Colombia, Turquía e India
                                    <br /><br />
                                    Incorporé trabajos hechos a mano con baños de oro y artesanos nativos para joyería.
                                    <br /><br />
                                    Produje ramos de novia, coronas y adornos de orejas exclusivos.
                                    <br /><br />
                                    Participé en ferias locales para emprendedores y tuve un showroom de 2 semanas.
                                    <br /><br />
                                    Mejor dar - El 5% de las ventas fueron destinadas a personas necesitadas.
                                </p>
                            </>
                            :
                            <>
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
                            </>
                        }
                    </div>
                </div>

                <div className="bespoken__row" style={{ marginTop: '6rem', width: '100vw' }}>
                    <Carousel cards={carouselImages} />
                </div>

                <Button
                    label={lang === 'es' ? 'Ver productos' : 'View products'}
                    handleClick={() => history.push(`/bespoken/products`)}
                    style={{ transform: 'scale(1.3)', margin: '1rem 0 4rem 0' }}
                    bgColor={APP_COLORS.GRASS}
                    textColor='white'
                />

                <div className="bespoken__row" >
                    <div className="bespoken__col" style={{ margin: '4rem 0 0 0' }}>
                        <img
                            style={{ height: '80vh' }}
                            src={BespokenContact}
                            alt="Story Image"
                            className="bespoken__story-img"
                            loading='lazy' />
                    </div>
                </div>

                <div className="bespoken__row" >
                    <div className="bespoken__col" style={{ margin: '0 0 4rem' }}>
                        <h2 className="bespoken__subtitle" style={{ alignSelf: 'center', textAlign: 'center', margin: '0 0 2rem 0', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#a5a5a5' }}>
                            {lang === 'es' ?
                                '¿Necesitas un regalo o arreglo floral personalizado?'
                                :
                                'Are you looking for a personalized gift or adornment?'
                            }
                        </h2>
                        <Button
                            label={lang === 'es' ? 'Contáctame' : 'Contact me'}
                            handleClick={() => whatsappMe()}
                            style={{ transform: 'scale(1.3)' }}
                            bgColor={APP_COLORS.GRASS}
                            textColor='white'
                        />
                    </div>
                </div>

                <div className="bespoken__row" style={{ marginTop: '6rem' }}>
                    {lang === 'es' ?
                        <div className="bespoken__col" style={{ width: '100%' }}>
                            <h2 className="bespoken__subtitle" style={{ textAlign: 'center', width: '100%' }}>
                                Experiencia del cliente
                            </h2>
                            <div className="bespoken__row" style={{ alignItems: isMobile ? '' : 'flex-start' }}>
                                <div className="bespoken__col">
                                    <h3 className="bespoken__subtitle" >
                                        Regalos y Experiencias
                                    </h3>
                                    <p className="bespoken__text" >
                                        “Dany querida, gracias por el amor puesto en todo. Descubro detalles amorosos”
                                        <br /><br />
                                        “Gracias a vos, se siente cuando las cosas son hechas con amor!”.
                                        <br /><br />
                                        “Hola! Re lindo, le encanto! Dijo: !Qué presentación!  Espectacular y el sello le da un toque muy especial. Quedo muy contenta y yo quede re bien! Mil gracias, Dios te bendiga”.
                                        <br /><br />
                                        “Estoy taaan orgullosa de ser tu amiga, cada experiencia es increible y única! Pero siempre tienes más y me sorprendes. El mundo es tuyo amiga!”
                                        <br /><br />
                                        “El toque delicado y personal que le das a las cajas es tremendamente hermoso”.
                                        <br /><br />
                                        “Le encanto, Daniela! Gracias. El cafe sale muy rico! Todo increíble, mis dieces”.
                                        <br /><br />
                                        “She absolutely LOVED IT”!
                                        <br /><br />
                                        “Le encanto! Quedo hermoso, te felicito Dani. Está todo tan bien cuidado, con amor y atención al detalle. La curación de las fotos simplemente WOW. El nivel de personalización en la atención, paciencia y armado del regalo es simplemente impecable. Sabía que puedo confiar en vos. Pura magia BESPOKEN! Gracias por ser mi complice”!
                                        <br /><br />
                                    </p>
                                </div>
                                <div className="bespoken__col">
                                    <h3 className="bespoken__subtitle">
                                        Tocados y Ramos
                                    </h3>
                                    <p className="bespoken__text" >
                                        “Delicado, hermoso, único! Gracias por tu buen gusto y por tu dedicación. Amamos y valoramos tu espectacular trabajo”.
                                        <br /><br />
                                        “Una belleza! Hermosas flores, hermosa presentación”!
                                        <br /><br />
                                        “Tu trabajo resalta la belleza de mis nenas”.
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
                                    <p><i>1° Aniversario Bespoken - Buenos Aires 2022</i></p>
                                </div>
                            </div> */}
                        </div>
                        :
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
                    }
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
                            src={BespokenBook}
                            alt="Story Image"
                            className="bespoken__story-img"
                            loading='lazy' />
                    </div>
                </div>

            </div >
        )
    }

    const renderProducts = () => {
        return (
            <div className="bespoken__container">
                <div className="page__header">
                    {products ?
                        <p className="bespoken__product-goback" onClick={() => setProducts('')}>↩ {TEXT[lang].categories_low}</p>
                        : <p className="bespoken__product-goback" onClick={() => history.push('/')}>↩ {TEXT[lang].anechooftheheart}</p>
                    }
                    <h1
                        className="page__header-title"
                        style={{ cursor: 'pointer' }}>
                        {products || lang === 'es' ? 'Trabajos Previos' : 'Previous Work'}
                    </h1>
                    {!products ?
                        <div className="bespoken__product-cards">
                            <div className="bespoken__product-card" onClick={() => history.push('/bespoken/products?category=arrangements')}>
                                <p className="bespoken__product-card-title">FLOWER<br />ARRANGEMENTS</p>
                                <img src={FlowerArrangements} alt="Bespoken" className="bespoken__product-card-img" loading='lazy' draggable={false} />
                            </div>
                            <div className="bespoken__product-card" onClick={() => history.push('/bespoken/products?category=adornments')}>
                                <p className="bespoken__product-card-title">FLOWER<br />ADORNMENTS</p>
                                <img src={FlowerAdornments} alt="Bespoken" className="bespoken__product-card-img" loading='lazy' draggable={false} />
                            </div>
                            <div className="bespoken__product-card" onClick={() => history.push('/bespoken/products?category=gifts')}>
                                <p className="bespoken__product-card-title">BESPOKEN<br />GIFTS</p>
                                <img src={ProductGifts} alt="Bespoken" className="bespoken__product-card-img" loading='lazy' draggable={false} />
                            </div>
                        </div>
                        : ''}
                    {products ? !images.length && loading.products ?
                        <div>
                            <span className="loader"></span>
                            <p>Connecting with Pinterest...</p>
                        </div>
                        :
                        <div className='bespoken__product-col'>
                            <p className='bespoken__product-caption'>{getProductCaption()}</p>
                            <div className="bespoken__product-list">
                                {images.map((imageUrl: string, i: number) =>
                                    <div
                                        key={i}
                                        className="bespoken__product-image-wrapper"
                                        onMouseEnter={() => setShowPin(i)}
                                        onMouseLeave={() => setShowPin(-1)}
                                        style={{ animationDelay: `${i * 200}ms` }}
                                    >
                                        <img src={imageUrl} alt={`Image ${i}`} className='bespoken__product-image' />
                                        <a href={getPinterestUrl(imageUrl)} target='_blank'>
                                            <img
                                                src={PinterestSave}
                                                alt='Save to Pinterest'
                                                className={`bespoken__product-image-pin${showPin === i ? '--show' : ''}`}
                                            />
                                        </a>
                                    </div>)}
                            </div>
                            <a href={pinterestPage} target='_blank'><button className="bespoken__product-seemore">{lang === 'es' ? 'Ver más' : 'See more'} ➤</button></a>
                        </div>
                        : ''}
                </div>
            </div>
        )
    }


    const parsePageTitle = (page: string) => TEXT[lang][page.toLocaleLowerCase().split(' ').join('_')]

    const renderDiyWedding = () => {
        return (
            <div className="bespoken__container">
                <div className="home__landing-image-wrapper" style={{ marginTop: isMobile ? '-1rem' : '-5rem' }}>
                    <img src={LandingWedding} alt="Bespoken" className="home__landing-image" />
                </div>
                <p className="bespoken__product-goback" onClick={() => history.push('/')}>↩ {TEXT[lang].anechooftheheart}</p>
                <div className="page__header">
                    <h1 className="page__header-title">{page ? parsePageTitle(page) : ''}</h1>
                </div>
                {lang === 'es' ?
                    <div className="bespoken__row">
                        <div className="bespoken__col" style={{ width: isMobile ? '' : '70vw' }}>
                            <h2 className="bespoken__subtitle">
                                Propuesta
                            </h2>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                Guille me propuso una tarde cuando regresábamos de un viaje de fin de semana a la costa en verano. Pasamos por un campo de girasoles y hicimos una parada porque "quería hacer un video con su dron". Mientras yo sostenía a Indie y recogía flores (totalmente ajena a lo que estaba sucediendo), él me pidió que tomara su control remoto por un minuto, y de repente vi cómo estaba de rodillas, con una pequeña caja roja que sostenía un hermoso anillo. Estaba en shock por lo que estaba sucediendo y sentí una profunda presión en mi cuerpo. Una oleada de pensamientos llegó a mi mente, junto con un poco de adrenalina y felicidad. ¡Por supuesto, dije que sí!
                            </p>
                            <br /><br />
                            <h2 className="bespoken__subtitle">
                                Planificación
                            </h2>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                Y así, poco a poco, comenzó la planificación. Este era el año 2021; estábamos en medio del covid y también en un año en el que ambos dejamos nuestros trabajos para convertirnos en emprendedores y cambiar nuestra trayectoria profesional, así que establecer una fecha (y un presupuesto) nos llevó un poco de tiempo, pero finalmente decidimos marzo de 2022.
                            </p>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                Tanto Guille como yo amamos ser anfitriones y somos excelentes haciendo cosas. También acababa de terminar un trabajo de tres años como gerente de eventos, así que desde el principio sabíamos quiénes serían los planificadores de nuestra boda (nosotros, por supuesto).
                            </p>

                            <h2 className="bespoken__subtitle">
                                Resumen del paso a paso
                            </h2>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                1. Pensamos en qué tipo de boda queríamos y dónde. Acordamos un estilo de boda bohemio/campestre en Buenos Aires.
                                <br /><br />2. Revisamos lugares, lugares y precios. Elegimos <a href='https://hosteriaelcazador.com.ar/' target='_blank' style={{ color: '#5D8C8C' }}>Hostería el Cazador</a>, un hermoso lugar histórico en Escobar.
                                <br /><br />3. Guille creó nuestro  <a href='https://danyguille.vercel.app/' target='_blank' style={{ color: '#5D8C8C' }}>sitio web</a> de la boda.
                                <br /><br />4. Hicimos la lista de invitados, diseñamos las invitaciones y las enviamos.
                                <br /><br />5. En medio de todo, hice un viaje de 3 meses a Colombia, donde pude pasar tiempo con mi familia y también hacer mi vestido con la modista de la familia, Estelita. Tuve una despedida de soltera sorpresa de parte de mi mamá con amigos muy cercanos de la familia.
                                <br /><br />6. Presupuestos y planificación, armado de lista de proveedores, degustación de comida, contratación de maquilladores y estilistas, fotógrafos y diseñadores de pasteles.
                                <br /><br />7. "Tormenta de ideas de imágenes" en Pinterest y compras para la decoración. Nos encantó visitar Tigre, donde encontramos muchos productos hechos a mano.
                                <br /><br />8. Diseños y armado de planos para el evento y cronograma, logística, pagos, diagramas de asientos ¡y listas de reproducción de música!
                                <br /><br />9. Sesión de fotos previa a la boda.
                                <br /><br />10. Organizar visitas familiares, alojamiento y viajes; componer mi corona de flores y los boutonnières, entre otras cosas.
                            </p>

                            <h2 className="bespoken__subtitle">
                                El día
                            </h2>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                Esperábamos alrededor de 120 invitados. No teníamos idea de cuánto trabajo tendríamos que hacer ese día y el día anterior... Fui un poco ingenua en cuanto a los tiempos y la preparación de arreglos florales y decoración, además de todos los detalles que necesitas atender. ¡Así que tuvimos la suerte de contar con varias personas, unas 15, entre amigos y familiares, que nos ayudaron con todo el montaje. Fue intenso, pero lo disfrutamos. Aunque debo decir que si organizo o aconsejo a alguien sobre su armado de boda, definitivamente sé ahora cuáles son las cosas que debes delegar y los tiempos aproximados.
                            </p>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                Tuvimos a nuestra coordinadora de bodas durante el evento, algo que no puedes pasar por alto. Además, el servicio de catering, la música y parte de la ambientación se contrataron para trabajar sin nuestra ayuda. También, en el lugar había una pequeña casa lateral donde pudimos prepararnos.
                            </p>
                            <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                Ese día el clima no estaba soleado y en realidad se preveía lluvia en el pronóstico, por lo que tuvimos que trasladar la boda al interior del edificio. ¡Hablemos de cambios de planes y ajustes! Pero resultó increíble y lo disfrutamos mucho.
                            </p>
                            {wedding.length ?
                                <p className="bespoken__text" style={{ alignSelf: 'flex-start' }}>
                                    ¡Disfruten de nuestras fotos!
                                </p> : ''}
                        </div>
                    </div>
                    :
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
                    </div>}
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
                                        src={PinterestSave}
                                        alt='Save to Pinterest'
                                        className={`bespoken__product-image-pin${showPin === i ? '--show' : ''}`}
                                    />
                                </a>
                            </div>)}
                    </div>
                    {wedding.length ?
                        <a href={pinterestPage} target='_blank'><button className="bespoken__product-seemore">See more ➤</button></a>
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

    const renderValues = () => {
        return (
            <div className="bespoken__container">
                <div className="page__header">
                    <h1 className="page__header-title">{page ? TEXT[lang][page.toLowerCase()] || page : ''}</h1>
                </div>
                <div className="bespoken__row">
                    <div className="bespoken__col" style={{ width: '80vw' }}>
                        <p className="bespoken__text" style={{ textAlign: isMobile ? 'left' : 'justify' }}>
                            <strong>I DREAM</strong> of a business where I can express my work in my best way and people can find confidence, detail, excellence and purpose in what they are doing and receiving.
                            <br />
                            <br />
                            <strong>LIFE VALUES</strong> are implied in the product itself and the human relationship that is built behind it. A caring, living and sustainable environment.
                            <br />
                            <br />
                            <strong>CONFI TUNES</strong> may accompany your workplace, coffee, creativity moments and conversations.
                            <br />
                            <br />
                            <strong>BREATH IN DEEPLY & EXHALE SLOWLY</strong> as you move on in your day, because you understand the value of your mind and body as your only vehicle in life. That is your precious production machine.
                            <br />
                            <br />
                            <strong>TRUTHFUL & HONEST</strong> work habits will make it a transparent & good workplace to be.
                            <br />
                            <br />
                            <strong>APPRECIATIVE AND KING LANGUAGE</strong> become pillars of conversations and communication with everyone.
                            <br />
                            <br />
                            <strong>SERVING ONE ANOTHER</strong> with respect, care and love create the product itself.
                            <br />
                            <br />
                            <strong>BE GRACEFUL & COMPASSIONATE</strong> means to give a second chance from your heart. All humans can make mistakes.
                            <br />
                            <br />
                            <strong>YOU CAN FIND A QUIET ROOM</strong> in a garden, a couch or a terrace, where you can converse or think if you need it.
                            <br />
                            <br />
                            <strong>GROWTH GOES IS HAND WITH EVERYTHING THAT YOU DO</strong> Care for your family, your friends, your job & for you.
                            <br />
                            <br />
                            <strong>PURSUIT YOUR PERSONAL TALENTS</strong> your uniqueness, abilities & capacities. Accompany them with a higher thinking of gratitude.
                            <br />
                            <br />
                            <strong>THIS IS A PLACE FOR ABUNDANCE & GIVING</strong> for sharing and growing.
                            <br />
                            <br />
                            That this part of your lifetime might be truly gratifying, edifying and nurturing to your soul!
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const renderHome = () => {
        return (
            <div className="bespoken__container">
                <div className="bespoken__section-card" onClick={() => history.push('/store')}>
                    <h2 className="bespoken__section-title">{lang === 'es' ? 'TIENDA' : 'STORE'}</h2>
                </div>
                <div className="bespoken__section-card" onClick={() => history.push('/bespoken/story')}>
                    <h2 className="bespoken__section-title">{TEXT[lang]['story']}</h2>
                    {/* <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'Un pedacito de la historia de la marca' :
                            `A bit of the brand's history`
                        }
                    </h3> */}
                </div>
                <div className="bespoken__section-card" onClick={() => history.push('/bespoken/products')}>
                    <h2 className="bespoken__section-title">{TEXT[lang]['products']}</h2>
                    {/* <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'Mira lo que se hace en el taller' :
                            `See what's being made at the workshop`
                        }
                    </h3> */}
                </div>
                <div className="bespoken__section-card" onClick={() => history.push('/bespoken/our_handcrafted_wedding')}>
                    <h2 className="bespoken__section-title">{TEXT[lang]['our_handcrafted_wedding']}</h2>
                    {/* <h3 className="bespoken__section-description">
                        {lang === 'es' ?
                            'Nuestra forma de celebrar el compromiso' :
                            `Our way of celebrating commitment`
                        }
                    </h3> */}
                </div>
                {/* <div className="bespoken__section-card" onClick={() => history.push('/bespoken/values')}>
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

    return page === 'HOME' ? renderHome() :
        page === 'STORY' ? renderStory() :
            page === 'VALUES' ? renderValues() :
                page === 'PRODUCTS' ? renderProducts() :
                    page && page.includes('WEDDING') ? renderDiyWedding() : null
}