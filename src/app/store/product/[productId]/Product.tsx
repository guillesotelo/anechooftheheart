"use client"

import React, { useContext } from 'react'
import { getProductById } from '../../../../services/product'
import { productType } from '../../../types'
import Button from '../../../../components/Button/Button'
import { HashLoader } from 'react-spinners'
import { AppContext } from '../../../context/AppContext'
import { useRouter } from 'next/navigation'

type Props = {
    product: productType
}

export default function Product({ product }: Props) {
    const { isMobile } = useContext(AppContext)
    const router = useRouter()

    const buyProduct = () => {
        const a = document.createElement('a')
        const whatsappMessage = `Hi, I'd love to buy this item: ${product?.title}`
        a.href = `https://wa.me/460729678696?text=${encodeURIComponent(whatsappMessage)} [id: ${product?._id}]`
        a.target = '_blank'
        a.click()
        setTimeout(() => a.remove(), 1000)
    }

    const getMainImage = (images?: string) => {
        const imgs = JSON.parse(images || '[]')
        return imgs[0] || ''
    }

    const getImages = (imgStr?: string) => {
        return JSON.parse(imgStr || '[]')
    }

    const getPrice = (price?: number) => {
        return product?.currency ?
            product.currency === '$' ? `$${price}`
                : `${price} ${product.currency}`
            : ''
    }

    const parseText = (text?: string) => {
        return text?.replaceAll('\n', '<br />') || ''
    }

    return (
        <div className="product__container">
            {
                // loading ? <div className='store__loader'><HashLoader size={15} /><p>Loading product details...</p></div>
                //     :
                !product ? <p>An error occurred while getting the product information. Please <a href='https://store.anechooftheheart.com/'>go back to the store</a> and try again</p>
                    :
                    <div className="product__col">
                        <Button
                            label='← Back to the store'
                            handleClick={() => {
                                router.push('/store')
                            }}
                            bgColor='transparent'
                            style={{
                                left: isMobile ? '-1rem' : '-3rem',
                                top: isMobile ? '-1rem' : '-3.25rem',
                                position: 'absolute'
                            }}
                        />
                        <div className="product__row">
                            <div className="product__image-wrapper">
                                <img src={product ? getMainImage(product.images) : ''} alt={product?.title} className="product__image" />
                            </div>
                            <div className="product__information">
                                <p className="product__title">{product?.title}</p>
                                <p className="product__price">{getPrice(product.price)}</p>
                                <div className="product__description" dangerouslySetInnerHTML={{ __html: parseText(product?.description) }} />
                                <Button
                                    label='Buy'
                                    handleClick={buyProduct}
                                    style={{ width: '100%', marginTop: '3rem', fontSize: '1.3rem', padding: '.8rem' }}
                                />
                            </div>
                        </div>
                        <div className="product__galery">
                            {getImages(product.images).map((image: string, i: number) =>
                                i !== 0 &&
                                <img key={i} src={image} draggable={false} className='product__galery-image' />
                            )}
                        </div>
                        {isMobile &&
                            <Button
                                label='Buy'
                                handleClick={buyProduct}
                                style={{ width: '100%', marginTop: '3rem', fontSize: '1.3rem', padding: '.8rem' }}
                            />}
                    </div>
            }
        </div>
    )
}