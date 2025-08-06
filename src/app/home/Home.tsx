"use client"

import { useContext, useEffect, useState } from 'react'
import PostCard from '../../components/PostCard/PostCard'
import { getAllPosts } from '../../services/post'
import { AppContext } from '../../app/context/AppContext'
import LandingDany from '../../assets/images/landing-1.jpg'
import LandingFlowers from '../../assets/images/landing-3.jpg'
import LandingSweden from '../../assets/images/landing-4.jpg'
import Button from '../../components/Button/Button'
import { APP_COLORS } from '../../constants/app'
import Player from '../../components/Player/Player'
import { getAllProducts } from '../../services/product'
import { dataObj, onChangeEventType, postType, productType } from '../../app/types'
import { getUser, sortArray } from '../../helpers'
import InputField from '../../components/InputField/InputField'
import toast from 'react-hot-toast'
import { TEXT } from '../../constants/lang'
import { subscribe } from '../../services/app'
import { useRouter } from 'next/navigation'
// const Track1 = require('../../assets/audio/Jamie-Duffy_Solas.mp3')
// const Track2 = require('../../assets/audio/Je-Te-Laisserai_Des-Mots.mp3')

export default function Home({ data }: dataObj) {
    const [showUp, setShowUp] = useState(false)
    const [subscribeData, setSubscribeData] = useState({ email: '', fullname: '' })
    const [allPosts, setAllPosts] = useState<any[]>([])
    const [products, setProducts] = useState<productType[]>([])
    const { lang, isMobile, isLoggedIn } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        if (data.products) {
            setProducts(sortArray(data.products, 'order'))
            // localStorage.setItem('products', JSON.stringify(data.products))
            localStorage.setItem('duedate', String(new Date().getTime() + 1000 * 60 * 15))
        }
        if (data.posts) {
            setAllPosts(isLoggedIn ? data.posts : data.posts.filter((post: postType) => post.published))
            // localStorage.setItem('posts', JSON.stringify(data.posts))
            localStorage.setItem('duedate', String(new Date().getTime() + 1000 * 60 * 15))
        }
    }, [data])

    useEffect(() => {
        const parallaxScroll = () => {
            const parallaxImages = document.querySelectorAll('.home__parallax-image') as any
            parallaxImages.forEach((image: any, index: number) => {
                const speed = parseFloat(image.dataset.speed) || 0.3
                const offset = window.scrollY - image.parentElement.offsetTop - (index * (isMobile ? index * 1000 : window.innerHeight * 1.8))
                image.style.transform = `translateY(${offset * speed}px)`
            })
        }

        window.addEventListener('scroll', parallaxScroll)
        return () => window.removeEventListener('scroll', parallaxScroll)
    }, [])

    // useEffect(() => {
    // if (isLoggedIn) setTimeout(() => setShowPlayer(true), 2000)
    // }, [isLoggedIn])

    useEffect(() => {
        if (allPosts.length && !showUp) {
            const cards = Array.from(document.getElementsByClassName('postcard__container') as HTMLCollectionOf<HTMLElement>)
            if (cards && cards.length) cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.display = 'flex'
                    card.style.transition = '.5s'
                }, i * 120)
            })
            setShowUp(true)
        }
    }, [allPosts])

    const filterPosts = (filter: string) => {
        return allPosts.filter(post => (post.category && post.category.toLowerCase().includes(filter.toLowerCase())))
    }

    const updateSubscribeData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setSubscribeData({ ...subscribeData, [key]: value })
    }

    const onSubscribe = async () => {
        try {
            const loading = toast.loading(TEXT[lang]['subscribing'])
            if (!subscribeData.fullname.includes(' ') || !subscribeData.email.includes('@') || !subscribeData.email.includes('.')) {
                toast.error(lang === 'es' ? 'Checkea los campos' : 'Check the fields')
                return toast.remove(loading)
            }
            const logged = await subscribe(subscribeData)
            if (logged) {
                toast.success(TEXT[lang]['subscribe_ok'])
                setTimeout(() => router.push('/'), 1500)
            } else toast.error(TEXT[lang]['subscribe_error'])

            return toast.remove(loading)
        } catch (error) {
            toast.error(TEXT[lang]['subscribe_error'])
        }
    }

    return <div className="home__container">
        <div className="home__landing">
            <div className="home__landing-image-wrapper">
                <div className="home__landing-image-overlap">
                    <h4 className="header__logo-text">An Echo of the Heart</h4>
                    <p
                        className="home__landing-title"
                        style={{
                            fontSize: '2rem',
                            margin: '15vh auto 0 auto',
                            color: '#fff',
                            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgb(0 0 0 / 30%) 20%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0))',
                            width: 'fit-content',
                            padding: '0 .5rem'
                        }}>
                        One heart's story, resonating with many.
                    </p>
                </div>
                <div className="home__parallax-container">
                    <img src={'/assets/images/landing-1.jpg'} alt="Dany Garcia" className="home__landing-image home__parallax-image" />
                </div>
            </div>
            <div className="home__section-wrapper">
                <div className="home__section">
                    <p className="home__landing-title" style={{ fontSize: '1.5rem', margin: '.5rem', fontFamily: 'Lora' }}>A blog by Daniela García | Travel, Motherhood, Inspired Living & Bespoken Flower Design</p>
                    <div className="home__landing-text-container">
                        <p className="home__landing-text">Hello, I'm Daniela! I created An Echo of the Heart as a gentle space for storytelling, motherhood, travel reflections, and personal growth. I also run Bespoken, where I design floral gifts and handcrafted details.</p>
                        <p className="home__landing-text">Here, I share what moves me… in an attempt to write from a place of authenticity, and hoping my words may echo something in you, too.</p>
                    </div>

                    <Button
                        label={lang === 'es' ? 'Conóceme' : 'Read My Story'}
                        handleClick={() => router.push(`/about`)}
                        bgColor={APP_COLORS.GRASS}
                        textColor='white'
                        style={{ marginTop: '2rem' }}
                    />
                </div>
            </div>

            <div className="home__landing-image-wrapper">
                <div className="home__parallax-container">
                    <img src={'/assets/images/landing-3.jpg'} alt="Dany Garcia" className="home__landing-image home__parallax-image" />
                </div>
                <div className="home__landing-image-overlap">
                    <p className="home__landing-caption" style={{ color: '#fff', fontSize: isMobile ? '' : '2rem', fontWeight: 'bold', margin: 'auto' }}>
                        “No man ever steps in the same river twice, for it's not the same river and he's not the same man.”  Heraclitus
                    </p>
                </div>
            </div>

            <div className="home__section-wrapper">
                <div className="home__section" style={{ height: 'fit-content' }}>
                    <h2 className="home__landing-title">Inspiration</h2>
                    <h3 className="home__landing-subtitle">Inspiring stories about personal growth, inner strength, and living with intention and awareness</h3>
                    <div className="blog__list">
                        {filterPosts('inspiration').map((post, i) => i < 4 ? <PostCard style={{ width: isMobile ? '70%' : '20vw' }} index={i} key={i} post={post} /> : null)}
                    </div>
                    <Button
                        label={lang === 'es' ? 'Ver todo' : 'View all'}
                        handleClick={() => router.push(`/blog/inspiration`)}
                        style={{ margin: '0 0 4rem' }}
                    />
                </div>
            </div>

            <div className="home__landing-image-wrapper">
                <div className="home__parallax-container">
                    <img src={'/assets/images/landing-4.jpg'} alt="Dany Garcia" className="home__landing-image home__parallax-image" />
                </div>
                <div className="home__landing-image-overlap">
                    <p className="home__landing-caption" style={{ color: '#fff', fontSize: isMobile ? '' : '2rem', fontWeight: 'bold', margin: 'auto' }}>
                        "En este mundo finito quiero encontrar mi equilibrio infinito espiritual contigo."
                    </p>
                </div>
            </div>

            {/* <div className="home__section-wrapper">
                <div className="home__section" style={{ height: 'fit-content' }}>
                    <h2 className="home__landing-title">Bespoken by Dany</h2>
                    <h3 className="home__landing-subtitle">Floral designs & handcrafted gifts</h3>
                    <div className="blog__list">
                        {products.map((product, i) => i < 4 ? <ProductCard style={{ width: isMobile ? '70%' : '20vw' }} index={i} key={i} product={product} /> : null)}
                    </div>
                    <Button
                        label='View store'
                        handleClick={() => router.push(`/store`)}
                        style={{ transform: 'scale(1.3)', margin: '4rem 0' }}
                    />
                </div>
            </div> */}

            <div className="home__section-wrapper">
                <div className="home__section" style={{ height: 'fit-content' }}>
                    <h2 className="home__landing-title">Motherhood</h2>
                    <h3 className="home__landing-subtitle">Honest reflections on the growth, learning, and everyday moments of motherhood</h3>
                    <div className="blog__list">
                        {filterPosts('motherhood').map((post, i) => i < 4 ? <PostCard style={{ width: isMobile ? '70%' : '20vw' }} index={i} key={i} post={post} /> : null)}
                    </div>
                    <Button
                        label={lang === 'es' ? 'Ver todo' : 'View all'}
                        handleClick={() => router.push(`/blog/motherhood`)}
                        style={{ margin: '0 0 6rem' }}
                    />
                </div>
            </div>

            <p className="home__landing-caption">
                "I love an easy-going morning at home with soft music, a little sun, and <i>mates</i>.<br />Just a perfect scenario to get my notebook and write."
            </p>

            <div className="home__section-wrapper">
                <div className="home__section" style={{ height: 'fit-content' }}>
                    <h2 className="home__landing-title">Life Abroad</h2>
                    <h3 className="home__landing-subtitle">Insightful stories of self-discovery, cultural adaptation, and expat life in foreign countries</h3>
                    <div className="blog__list">
                        {filterPosts('life abroad').map((post, i) => i < 4 ? <PostCard style={{ width: isMobile ? '70%' : '20vw' }} index={i} key={i} post={post} /> : null)}
                    </div>
                    <Button
                        label={lang === 'es' ? 'Ver todo' : 'View all'}
                        handleClick={() => router.push(`/blog/life_abroad`)}
                        style={{ margin: '0 0 4rem' }}
                    />
                </div>
            </div>

            <div className="home__section-wrapper">
                <div className="home__section" style={{ height: 'fit-content' }}>
                    <h2 style={{ fontFamily: 'var(--font-madelyn), sans-serif', fontSize: '3rem', margin: '2rem 0 0 0' }}>Stay connected</h2>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'normal' }}>Receive occasional reflections, updates from Bespoken, and gentle inspiration in your inbox.</h3>
                    <div className="postviewer__subscribe-row">
                        <InputField
                            name='fullname'
                            updateData={updateSubscribeData}
                            placeholder='Your full name'
                        />
                        <InputField
                            name='email'
                            updateData={updateSubscribeData}
                            placeholder='Your email'
                            type='email'
                        />
                        <Button
                            label={lang === 'es' ? 'Únete' : 'Join'}
                            handleClick={onSubscribe}
                            disabled={!subscribeData.email || !subscribeData.fullname}
                            style={{ width: isMobile ? '100%' : '' }}
                        />
                    </div>
                </div>
            </div>
        </div>
        {/* {showPlayer ? <Player filePath={[Track1, Track2]} setShowPlayer={setShowPlayer} /> : ''} */}
    </div>
}