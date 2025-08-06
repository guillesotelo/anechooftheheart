"use client"

import React, { useContext, useEffect, useState } from 'react'
import { productType } from '../../app/types'
import { useRouter } from 'next/navigation'
import { HashLoader } from 'react-spinners'
import { imagePlaceholder } from 'src/constants/app'
import Button from '../Button/Button'
import { AppContext } from 'src/app/context/AppContext'

type Props = {
    product?: productType
    style?: React.CSSProperties
    index?: number
}

export default function ProductCard({ product, style, index }: Props) {
    const [loading, setLoading] = useState(false)
    const { isLoggedIn } = useContext(AppContext)
    const router = useRouter()

    const {
        title,
        previewImage,
        price,
        _id,
        stock
    } = product || {}

    useEffect(() => {
        const clickEdit = (e: any) => {
            if (e.target.className === 'productcard__edit') {
                e.preventDefault()
                router.push(`/store/edit?id=${_id}`)
            }
        }

        window.addEventListener('click', clickEdit)
        return () => window.removeEventListener('click', clickEdit)
    }, [])

    const goToProductPage = () => {
        setLoading(true)
        router.push(`/store/product/${_id}`)
    }

    const getPrice = (price?: number) => {
        return product?.currency ?
            product.currency === '$' ? `$${price}`
                : `${price} ${product.currency}`
            : ''
    }

    const getTitle = (str?: string) => {
        return str ? str.split('–')[0].split('-')[0] || '' : ''
    }

    return (
        <div
            className={`productcard__container${stock === 0 ? '--oos' : ''}`}
            onClick={goToProductPage}
            style={{
                ...style,
                animationDelay: String(index ? index / 20 : 0) + 's'
            }}>
            {isLoggedIn ?
                <Button
                    label='Edit'
                    handleClick={() => router.push(`/store/edit?id=${_id}`)}
                    className='productcard__edit'
                /> : ''}
            <div className="productcard__image-frame">
                <div className="productcard__image-wrapper">
                    <img src={previewImage || imagePlaceholder} alt={title} className="productcard__image" />
                    {loading && <div className='productcard__loader'><HashLoader size={40} color='gray' /></div>}
                    {stock === 0 ? <p className='productcard__image-oos'>Out of stock</p> : ''}
                </div>
            </div>
            <p className="productcard__title">{getTitle(title)}</p>
            <p className="productcard__price">{getPrice(price)}</p>
        </div>
    )
}