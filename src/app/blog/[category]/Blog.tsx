"use client"

import React, { useContext, useEffect, useState } from 'react'
import PostCard from '../../../components/PostCard/PostCard'
import { postType } from '../../../app/types'
import { AppContext } from '../../../app/context/AppContext'
import { TEXT } from '../../../constants/lang'
import Switch from '../../../components/Switch/Switch'

type Props = {
    category: string
    posts: postType[]
}

export default function Blog({ posts, category }: Props) {
    const [showUp, setShowUp] = useState(false)
    const [showUnPublished, setShowUnPublished] = useState(false)
    const [loading, setLoading] = useState(false)
    const { isLoggedIn, lang, isMobile } = useContext(AppContext)

    useEffect(() => {
        if (posts.length && !showUp) {
            const cards = Array.from(document.getElementsByClassName('postcard__container') as HTMLCollectionOf<HTMLElement>)
            if (cards && cards.length) cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.display = 'flex'
                    card.style.transition = '.5s'
                }, i * 120)
            })
            setShowUp(true)
        }
    }, [posts])

    const parseCategory = (cat: string) => TEXT[lang][cat].split('').map((c, i, a) => i === 0 || (a[i - 1] && a[i - 1] === ' ') ? c.toUpperCase() : c.toLowerCase())

    return (
        <div className='blog__container'>
            {isLoggedIn ?
                <Switch
                    label='Show unpublished'
                    on='Yes'
                    off='No'
                    value={showUnPublished}
                    setValue={setShowUnPublished}
                    style={{ position: 'absolute', right: isMobile ? 0 : '1rem', top: isMobile ? '5rem' : '', transform: 'scale(0.9)' }}
                /> : ''}
            <div className="page__header">
                <h4 className="page__header-title-blog">{!category || category === 'all' ? 'Open Journal' : parseCategory(category)}</h4>
                {category ? <h4 className="page__header-subtitle-blog">{TEXT[lang][`${category}_cap`]}</h4> : ''}
                <p className="blog__caption">
                    {!category ?
                        lang === 'es' ?
                            'Cada publicación lleva consigo una chispa de alegría y vivencia personal. Se acompañan de fotos que buscan realzar la historia y concluyen con un deseo de conexión.'
                            :
                            'In each post, there is a little spark of joy and personal experience. There are photos that try to complement the story and a closing that wishes for connection.'
                        : ''
                    }
                </p>
            </div>
            {loading ? <span className="loader"></span>
                :
                <div className="blog__list">
                    {(showUnPublished ? posts : posts.filter(p => p.published))
                        .map((post, i, arr) => <PostCard key={post._id} index={i} post={post} style={{ width: arr.length < 5 ? '100%' : '' }}/>)}
                </div>
            }
        </div>
    )
}
