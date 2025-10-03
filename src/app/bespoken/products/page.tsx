"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "src/app/context/AppContext"
import { TEXT } from "src/constants/lang"
import { getScrappedImages } from "src/services/app"

export default function renderProducts() {
    const [images, setImages] = useState<any>([])
    const [products, setProducts] = useState('')
    const [arrangements, setArrangements] = useState<any>([])
    const [adornments, setAdornments] = useState<any>([])
    const [gifts, setGifts] = useState<any>([])
    const [showPin, setShowPin] = useState(-1)
    const [pinterestPage, setPinterestPage] = useState('')
    const [loading, setLoading] = useState({ products: false, wedding: false, adornments: false, gifts: false })
    const router = useRouter()
    const params = useSearchParams()
    const { lang } = useContext(AppContext)

    const adornmentsCaption = `I started composing natural flower crowns at the cottage of my in-laws in the summer of 2021. From that time on, I started learning about flowers and techniques so I could create different designs for crowns and ear-cuffs. Materials: Natural flowers, fabric, cold porcelain, stones, among others.`
    const giftsCaption = `It's all about the intention, the love and the details ✨ I found myself creating different gift proposals I called "experiences", as they involve the sensory levels of seeing, touching, tasting and smelling. These were all crafted with a lot of detail and time. All of them were carefully designed for each customer with selected products and brands. As for the packaging and presentation, I chose carton boxes, jute twine, dried flowers and our personalised stamp with sealing wax.`
    const arrangementsCaptions = 'There is a very special feeling I get when I’m out picking flowers, when I bring them home to arrange them and make a composition. Although I have a tendency of “perfection” I like to be a free creator and make my own designs. My dream is to keep my hands busy creating, learning and enjoying the pleasure of holding flowers and making people and spaces joyful and beautiful.'
    const arrangementsUrl = 'https://www.pinterest.se/bespoken_ar/flower-arrangements/'
    const adornmentsUrl = 'https://www.pinterest.se/bespoken_ar/flower-adornments/'
    const giftsUrl = 'https://www.pinterest.se/bespoken_ar/bespoken-gifts/'

    useEffect(() => {
        getPinterestImages()
    }, [])

    useEffect(() => {
        const category = params.get('category')
        const categories: { [value: string]: string } = {
            'arrangements': 'Flower Arrangements',
            'adornments': 'Flower Adornments',
            'gifts': 'Bespoken Gifts'
        }
     
        if (category) setProducts(categories[category])
        else setProducts('')
        
    }, [params])

    useEffect(() => {
        const imgs = getName(products, 'arrangements') ? arrangements :
            getName(products, 'adornments') ? adornments :
                getName(products, 'gifts') ? gifts : []

        setImages(imgs)
        getPinterestPage()

        // console.log('arrangements',arrangements)
        // console.log('adornments',adornments)
        // console.log('gifts',gifts)
        // console.log('products',products)
    }, [products, arrangements, adornments, gifts])

    const getPinterestImages = async () => {
        try {
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
        } catch (err) {
            console.error(err)
        }
    }

    const getPinterestPage = () => {
        setPinterestPage(getName(products, 'arrangements') ? arrangementsUrl :
            getName(products, 'adornments') ? adornmentsUrl :
                giftsUrl)
    }

    const getName = (products: string, name: string) => {
        return products.toLowerCase().includes(name)
    }

    const getProductCaption = () => {
        return getName(products, 'arrangements') ? arrangementsCaptions :
            getName(products, 'adornments') ? adornmentsCaption :
                getName(products, 'gifts') ? giftsCaption : ''
    }

    const getPinterestUrl = (url: string) => `https://www.pinterest.se/pin/create/button/?url=${encodeURIComponent(url)}`

    return (
        <div className="bespoken__container">
            <div className="page__header">
                {products ?
                    <p className="bespoken__product-goback" onClick={() => setProducts('')}>↩ {TEXT['en'].categories_low}</p>
                    : <p className="bespoken__product-goback" onClick={() => router.push('/')}>↩ An Echo of The Heart</p>
                }
                <h1
                    className="page__header-title"
                    style={{ cursor: 'pointer' }}>
                    Previous Work
                </h1>
                {!products ?
                    <div className="bespoken__product-cards">
                        <div className="bespoken__product-card" onClick={() => router.push('/bespoken/products?category=arrangements')}>
                            <p className="bespoken__product-card-title">FLOWER<br />ARRANGEMENTS</p>
                            <img src={'/assets/images/products-arrangements.png'} alt="Bespoken" className="bespoken__product-card-img" loading='lazy' draggable={false} />
                        </div>
                        <div className="bespoken__product-card" onClick={() => router.push('/bespoken/products?category=adornments')}>
                            <p className="bespoken__product-card-title">FLOWER<br />ADORNMENTS</p>
                            <img src={'/assets/images/products-adornments.png'} alt="Bespoken" className="bespoken__product-card-img" loading='lazy' draggable={false} />
                        </div>
                        <div className="bespoken__product-card" onClick={() => router.push('/bespoken/products?category=gifts')}>
                            <p className="bespoken__product-card-title">BESPOKEN<br />GIFTS</p>
                            <img src={'/assets/images/products-gifts.png'} alt="Bespoken" className="bespoken__product-card-img" loading='lazy' draggable={false} />
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
                                            src={'/assets/icons/pinterest-color.svg'}
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
