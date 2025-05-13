"use client"

import { useContext, useEffect, useState } from 'react'
import ProductCard from '../../components/ProductCard/ProductCard'
import { AppContext } from '../context/AppContext'
import Button from '../../components/Button/Button'
import { getAllProducts } from '../../services/product'
import { productType } from '../types'
import { HashLoader } from 'react-spinners'
import { getUser, sortArray } from '../../helpers'
import { useRouter } from 'next/navigation'

type Props = {}

export default function Store({ }: Props) {
    const [products, setProducts] = useState<productType[]>([])
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const { isLoggedIn, isMobile } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async () => {
        try {
            setLoading(true)
            const _products = await getAllProducts(getUser())
            if (_products && Array.isArray(_products)) setProducts(_products)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
        }
    }

    const goToEditStore = () => {
        router.push('/store/edit')
    }

    const getFilteredProducts = () => products.filter(p => !category ? true : p.category?.includes(category))

    return (
        <div className="store__container">
            {isLoggedIn &&
                <Button
                    label='Edit Store'
                    handleClick={goToEditStore}
                    style={{
                        position: 'absolute',
                        right: isMobile ? '1rem' : '2rem',
                        top: isMobile ? '1rem' : '2rem',
                        zIndex: 1
                    }}
                />}
            <h1 className="store__title">Store</h1>

            <div className="store__row">
                <img src={'/assets/images/bespoken-contact.jpg'} alt="Bespoken store background" className="store__bg-image" style={{ maxWidth: isMobile ? '90vw' : '25vw' }} />
                <div className="store__col" style={{ maxWidth: isMobile ? '90vw' : '25vw' }} >
                    <p className='store__welcome-title'>Welcome to my store</p>
                    <p className='store__welcome-text'>
                        I specialize in boho-inspired floral designs, created with care, creativity, and a love for natural beauty. In addition to my original floral pieces, I source unique, artisan-made bohemian jewelry that flows seamlessly with the aesthetic—earthy and free-spirited.
                        <br />
                        <br />
                        Thanks for being here — I hope you find something that speaks to your heart.
                    </p>
                </div>
            </div>

            <div className="store__categories">
                <p
                    onClick={() => setCategory('Handmade Crowns')}
                    style={{
                        textDecoration: category === 'Handmade Crowns' ? 'underline' : ''
                    }}
                    className="store__category">Handmade Crowns</p>
                <p
                    onClick={() => setCategory('Gifts')}
                    style={{
                        textDecoration: category === 'Gifts' ? 'underline' : ''
                    }}
                    className="store__category">Gifts</p>
                <p
                    onClick={() => setCategory('Jewelry')}
                    style={{
                        textDecoration: category === 'Jewelry' ? 'underline' : ''
                    }}
                    className="store__category">Jewelry</p>
                {category && <p
                    onClick={() => setCategory('')}
                    style={{ animationDelay: '0s' }}
                    className="store__category">All</p>}
            </div>
            <div className="store__list">
                {loading ?
                    <div className='store__loader'><HashLoader size={15} /><p>Loading products...</p></div>
                    :
                    getFilteredProducts().length ? sortArray(getFilteredProducts(), 'order').map((product, index) =>
                        <ProductCard product={product} index={index} />)
                        : <p>{category} coming soon...</p>}
            </div>
        </div>
    )
}