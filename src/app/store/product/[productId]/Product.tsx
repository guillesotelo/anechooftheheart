"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import { productType } from '../../../types'
import Button from '../../../../components/Button/Button'
import { AppContext } from '../../../context/AppContext'
import { useRouter } from 'next/navigation'
import Modal from 'src/components/Modal/Modal'

type Props = {
    product: productType
}

export default function Product({ product }: Props) {
    const [imageModal, setImageModal] = useState(-1)
    const { isMobile } = useContext(AppContext)
    const router = useRouter()
    const imageModalRef = useRef(null)

    useEffect(() => {
        const body = document.querySelector('body')
        if (imageModal !== -1) {
            if (body) body.style.overflowY = 'hidden'
        } else {
            if (body) body.style.overflowY = 'auto'
        }
    }, [imageModal])

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

    const changeImage = (to: string) => {
        if (to === 'left') {
            if (imageModalRef.current) {
                (imageModalRef.current as HTMLImageElement).classList.remove('fade-in');
                (imageModalRef.current as HTMLImageElement).classList.add('fade-out');
            }
            setTimeout(() => {
                if (imageModalRef.current) {
                    (imageModalRef.current as HTMLImageElement).classList.remove('fade-out');
                    (imageModalRef.current as HTMLImageElement).classList.add('fade-in');
                }
                setImageModal(prev => prev === 0 ? getImages(product.images).length - 1 : prev - 1)
            }, 20)
        }
        if (to === 'right') {
            if (imageModalRef.current) {
                (imageModalRef.current as HTMLImageElement).classList.remove('fade-in');
                (imageModalRef.current as HTMLImageElement).classList.add('fade-out');
            }
            setTimeout(() => {
                if (imageModalRef.current) {
                    (imageModalRef.current as HTMLImageElement).classList.remove('fade-out');
                    (imageModalRef.current as HTMLImageElement).classList.add('fade-in');
                }
                setImageModal(prev => prev === getImages(product.images).length - 1 ? 0 : prev + 1)
            }, 20)
        }
    }
    return (
        <div className="product__wrapper">
            {imageModal !== -1 &&
                <Modal
                    title={`${product.title}`}
                    subtitle={`[${imageModal + 1}/${getImages(product.images).length}]`}
                    onClose={() => setImageModal(-1)} style={{ minWidth: 'auto' }}>
                    <div className='product__gallery-image-modal-content'>
                        <div
                            className="product__gallery-image-modal-arrow-left"
                            onClick={() => changeImage('left')}>〈</div>
                        <div
                            className="product__gallery-image-modal-arrow-right"
                            onClick={() => changeImage('right')}>〉</div>
                        <img src={getImages(product.images)[imageModal]} alt="Product Image" className='product__gallery-image-modal' ref={imageModalRef} />
                    </div>
                </Modal>}
            <div className="product__container" style={{ filter: imageModal !== -1 ? 'blur(5px) grayscale(1)' : '' }}>
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
                            <div className="product__gallery">
                                {getImages(product.images).map((image: string, i: number) =>
                                    i !== 0 &&
                                    <img key={i} src={image} draggable={false} onClick={() => isMobile ? null : setImageModal(i)} className='product__gallery-image' />
                                )}
                            </div>
                            {isMobile && getImages(product.images).length &&
                                <Button
                                    label='Buy'
                                    handleClick={buyProduct}
                                    style={{ width: '100%', marginTop: '3rem', fontSize: '1.3rem', padding: '.8rem' }}
                                />}
                        </div>
                }
            </div>
        </div>
    )
}