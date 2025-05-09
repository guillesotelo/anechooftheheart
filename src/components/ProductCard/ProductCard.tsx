import React, { useEffect, useState } from 'react'
import { productType } from '../../app/types'
import { useRouter } from 'next/navigation'

type Props = {
    product?: productType
    style?: React.CSSProperties
    index?: number
}

export default function ProductCard({ product, style, index }: Props) {
    const [mainImage, setMainImage] = useState('')
    const router = useRouter()

    const {
        title,
        images,
        price,
        description,
        _id
    } = product || {}

    useEffect(() => {
        setMainImage(getMainImage(images))
    }, [images])

    const goToProductPage = () => {
        router.push(`/store/product?id=${_id}`)
    }

    const getMainImage = (images?: string) => {
        const imgs = JSON.parse(images || '[]')
        return imgs[0] || ''
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
            className="productcard__container"
            onClick={goToProductPage}
            style={{
                ...style,
                animationDelay: String(index ? index / 20 : 0) + 's'
            }}>
            <div className="productcard__image-frame">
                <div className="productcard__image-wrapper">
                    <img src={mainImage} alt={title} className="productcard__image" />
                </div>
            </div>
            <p className="productcard__title">{getTitle(title)}</p>
            <p className="productcard__price">{getPrice(price)}</p>
        </div>
    )
}