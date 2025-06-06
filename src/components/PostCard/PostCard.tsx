"use client"

import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../app/context/AppContext'
import { postType } from '../../app/types'
import { HashLoader } from 'react-spinners'
import { imagePlaceholder } from 'src/constants/app'

type Props = {
    post: postType
    index: number
    style?: React.CSSProperties
}

export default function PostCard({ post, index, style }: Props) {
    const [spanish, setSpanish] = useState(false)
    const [loading, setLoading] = useState(false)
    const { lang, isMobile } = useContext(AppContext)
    const webUrl = process.env.NODE_ENV === 'production' ?
        'https://anechooftheheart.com' : 'http://localhost:3000'

    useEffect(() => {
        setSpanish(lang === 'es')
    }, [])

    const getOverlap = () => {
        const readMore = spanish ? 'Leer post' : 'Read post'
        return spanish && post.spaOverlap ? post.spaOverlap : post.overlap ? post.overlap : spanish && post.spaDescription ? post.spaDescription : post.description || readMore
    }

    return (
        <a
            className='postcard__container'
            href={`${webUrl}/post/${post.slug}`}
            onClick={() => setLoading(true)}
            style={{
                opacity: !post.published ? '.5' : '1',
                width: isMobile ? '70%' : index % 5 === 0 ? '45%' : '',
                ...style
            }}
        >
            <div className="postcard__image-div" >
                {!post.published ? <img src={'/assets/icons/lock.svg'} alt="Not Published" className="postcard__image-lock" /> : ''}
                <h4 className="postcard__image-overlap">{getOverlap()}</h4>
                <img
                    src={post.previewImage || imagePlaceholder}
                    alt="Post Image"
                    className="postcard__image"
                    draggable={false}
                    style={{
                        objectFit: !post.previewImage && !JSON.parse(post.sideImgs || '[]')[0] ? 'contain' : 'cover',
                        minWidth: !post.previewImage && !JSON.parse(post.sideImgs || '[]')[0] ? '50%' : '100%',
                        height: !post.previewImage && !JSON.parse(post.sideImgs || '[]')[0] ? '50%' : '100%',
                    }}
                />
                {loading && <div className='productcard__loader'><HashLoader size={40} color='gray' /></div>}
            </div>
            <div className="postcard__text">
                <h4 className="postcard__text-subtitle">{spanish && post.spaSubtitle ? post.spaSubtitle : post.subtitle || post.spaSubtitle || ''}</h4>
                <h4 className="postcard__text-title">{spanish && post.spaTitle ? post.spaTitle : post.title || post.spaTitle || ''}</h4>
                {/* <h4 className="postcard__text-description">{spanish && post.spaDescription ? post.spaDescription : post.description || post.spaDescription || ''}</h4> */}
            </div>
        </a>
    )
}