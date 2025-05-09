import React, { useContext, useEffect, useState } from 'react'
import { getAllPosts } from '../../services/post'
import PostCard from '../../components/PostCard/PostCard'
import { TEXT } from '../../constants/lang'
import { AppContext } from '../context/AppContext'
import { postType } from '../types'

type Props = {
    search: string[]
}

export default function Blog({ search }: Props) {
    const [allPosts, setAllPosts] = useState<postType[]>([])
    const [filteredPosts, setFilteredPosts] = useState<postType[]>([])
    const [showUp, setShowUp] = useState(false)
    const { lang, isLoggedIn } = useContext(AppContext)

    useEffect(() => {
        getPosts()
    }, [])

    useEffect(() => {
        if (search) filterPosts()
        setShowUp(false)
    }, [search, allPosts])

    useEffect(() => {
        render()
        setTimeout(() => applyAnimation(), 50)
    }, [allPosts, filteredPosts])

    const getPosts = async () => {
        const posts = await getAllPosts(isLoggedIn || false)
        if (posts) setAllPosts(posts.length ? isLoggedIn ?
            posts : posts.filter((post: postType) => post.published) : [])
    }

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

    const filterPosts = () => {
        const posts = allPosts.filter(post => {
            let matches = false
            search.forEach((word: string) => {
                if (JSON.stringify(post).toLocaleLowerCase().includes(word.toLocaleLowerCase())) matches = true
            })
            if (matches) return post
        })
        setFilteredPosts(posts)
    }

    const render = () => {
        setTimeout(() => applyAnimation(), 50)
        return filteredPosts.length ?
            filteredPosts.map((post, i) => <PostCard index={i} key={i} post={post} />)
            : search.length ?
                <h4 className='search__no-results'>{TEXT[lang]['no_results_for']} <strong>{search.join(', ')}</strong></h4>
                :
                <h4 className='search__no-results'>{TEXT[lang]['results_placeholder']}</h4>
    }

    return (
        <div className='blog__container'>
            <div className="page__header">
                <h4 className="page__header-title">{search.length ? TEXT[lang]['search_title'] : TEXT[lang]['search_title2']}</h4>
            </div>
            {filteredPosts.length ?
                <h4 className='search__no-results'>{lang === 'es' ? 'Resultados para' : 'Results for'} <strong>{search.join(', ')}</strong></h4>
                : ''}
            <div className="blog__list">
                {render()}
            </div>
        </div>
    )
}