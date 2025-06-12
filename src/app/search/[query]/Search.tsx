"use client"

import React, { useContext, useEffect, useState } from 'react'
import PostCard from '../../../components/PostCard/PostCard'
import { TEXT } from '../../../constants/lang'
import { AppContext } from '../../context/AppContext'
import { postType } from '../../types'

type Props = {
    posts: postType[]
    query: string
}

export default function Search({ posts, query }: Props) {
    const [filteredPosts, setFilteredPosts] = useState<postType[]>([])
    const [search, setSearch] = useState('')
    const [showUp, setShowUp] = useState(false)
    const { lang, isLoggedIn, isMobile } = useContext(AppContext)

    useEffect(() => {
        if (query) {
            const decoded = decodeURIComponent(query)
            filterPosts(decoded)
            setSearch(decoded)
        }
        setShowUp(false)
    }, [query, posts])

    useEffect(() => {
        render()
        setTimeout(() => applyAnimation(), 50)
    }, [posts, filteredPosts])

    const applyAnimation = () => {
        if (filteredPosts.length && !showUp) {
            const cards = Array.from(document.getElementsByClassName('postcard__container') as HTMLCollectionOf<HTMLElement>)
            if (cards && cards.length) cards.forEach((card, i) => {
                setTimeout(() => {
                    card.style.display = 'flex'
                    card.style.transition = '.5s'
                }, i * 120)
            })
            setShowUp(true)
        }
    }

    const filterPosts = (query: string) => {
        const _posts = posts.filter(post => {
            let matches = false
            query.split(' ').forEach((word: string) => {
                if ((isLoggedIn || post.published) &&
                    JSON.stringify(post).toLocaleLowerCase().includes(word.toLocaleLowerCase())) matches = true
            })
            if (matches) return post
        })
        setFilteredPosts(_posts)
    }

    const render = () => {
        console.log(filterPosts.length)
        setTimeout(() => applyAnimation(), 50)
        return filteredPosts.length ?
            filteredPosts.map((post, i) => <PostCard style={{ width: isMobile ? '' : 'fit-content' }} index={i} key={i} post={post} />)
            : search.length ?
                <h4 className='search__no-results'>{TEXT[lang]['no_results_for']} <strong>{search}</strong></h4>
                :
                <h4 className='search__no-results'>{TEXT[lang]['results_placeholder']}</h4>
    }

    return (
        <div className='blog__container' style={{ paddingTop: '2rem' }}>
            <div className="page__header">
                <h4 className="page__header-title">{search.length ? TEXT[lang]['search_title'] : TEXT[lang]['search_title2']}</h4>
            </div>
            {filteredPosts.length ?
                <h4 className='search__no-results'>{lang === 'es' ? 'Resultados para' : 'Results for'} <strong>{search}</strong></h4>
                : ''}
            <div className="blog__list">
                {render()}
            </div>
        </div>
    )
}