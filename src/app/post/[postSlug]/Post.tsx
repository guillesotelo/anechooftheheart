"use client"

import React, { useContext, useEffect, useState } from 'react'
import Post from '../../../components/Post/Post'
import { AppContext } from '../../context/AppContext'
import { commentType, onChangeEventType, postType } from '../../types'
import InputField from '../../../components/InputField/InputField'
import Comment from '../../../components/Comment/Comment'
import { createComment, getPostComments } from '../../../services/comment'
import Button from '../../../components/Button/Button'
import toast from 'react-hot-toast'
import { TEXT } from '../../../constants/lang'
import { subscribe } from '../../../services/app'
import { usePathname, useRouter } from 'next/navigation'
import { capitalizeFirstLetter } from 'src/helpers'
import { getContentBySlug, getPostById } from 'src/services/post'

type Props = {
    post: postType
}

export default function PostViewer({ post }: Props) {
    const [data, setData] = useState<commentType>({})
    const [subscribeData, setSubscribeData] = useState({ email: '', fullname: '' })
    const [html, setHtml] = useState(post.html || '')
    const [spaHtml, setspaHtml] = useState(post.spaHtml || '')
    const [sideImages, setSideImages] = useState<string[]>([])
    const [postComments, setPostComments] = useState<commentType[]>([])
    const [sideImgStyles, setSideImgStyles] = useState<React.CSSProperties[]>([])
    const [linkLang, setLinkLang] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitComment, setSubmitComment] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { lang, isMobile, isLoggedIn } = useContext(AppContext)

    useEffect(() => {
        const language = new URLSearchParams(document.location.search).get('lang')
        // const updated = new URLSearchParams(document.location.search).get('updated')

        if (language) setLinkLang(language)
    }, [pathname])

    useEffect(() => {
        if (post.slug && (!html && !spaHtml)) getPost()

        if (!category) getCategory()
        if (post._id && !postComments.length) getComments(post._id)
    }, [post])

    const updateSubscribeData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setSubscribeData({ ...subscribeData, [key]: value })
    }

    const onSubscribe = async () => {
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
    }

    const getCategory = () => {
        const _category = post.category ? post.category.includes('[') ? JSON.parse(post.category || '[]')[0] :
            post.category
            : post.tags ? post.tags.replace(/#/g, '').replace(/_/g, ' ').split(' ')[0] : ''
        if (_category.length) setCategory(_category.toLocaleLowerCase())
    }

    const getPost = async () => {
        try {
            setLoading(true)
            const _post = await getContentBySlug(post.slug || '')
            if (_post && _post._id) {
                if (_post.unpublished && !isLoggedIn === false) router.back()

                if (_post.html) setHtml(_post.html)
                if (_post.spaHtml) setspaHtml(_post.spaHtml)

                if (_post.sideImgs) {
                    const sideImgs = JSON.parse(_post.sideImgs)
                    setSideImages(sideImgs)
                }
                if (_post.sideStyles) {
                    const sideStyles = JSON.parse(_post.sideStyles)
                    setSideImgStyles(sideStyles)
                }
                setData({ ...data, postId: _post._id })
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
        }
    }

    const getComments = async (id: string) => {
        try {
            const comments = await getPostComments(id)
            if (comments && Array.isArray(comments)) setPostComments(comments)
        } catch (error) {
            console.error(error)
        }
    }

    const updateData = (key: string, e: onChangeEventType) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const postComment = async () => {
        try {
            const posted = await createComment({
                ...data,
                postId: post._id,
                isDany: isLoggedIn ? true : false
            })
            if (posted && posted._id) {
                toast.success(lang === 'es' ? 'Comentario añadido!' : 'Comment submitted!')
                getComments(post._id || data.postId || '')
                setData({})
            }
            else toast.error(lang === 'es' ? 'Error al enviar comentario. Intenta nuevamente.' : 'Error while sending comment. Please try again.')
        } catch (error) {
            console.error(error)
        }
    }

    const shareToPlatform = (site: string) => {
        const currentUrl = encodeURIComponent(`${window.location.href}&lang=${lang}`)
        const platforms: any = {
            'facebook': `https://www.facebook.com/sharer/sharer.php?u=`,
            'x': `https://twitter.com/intent/tweet?url=`,
            'linkedin': `https://www.linkedin.com/shareArticle?mini=true&url=`,
            'instagram': `https://www.instagram.com/?url=`,
            'pinterest': `https://www.instagram.com/?url=`,
            'whatsapp': `https://api.whatsapp.com/send?text=`,
        }
        const url = `${platforms[site]}${currentUrl}`
        window.open(url, '_blank', 'noreferrer')
    }

    const parseYTLink = (url: string) => {
        const link = !url.includes('embed') ?
            url.replace('youtube.com/watch?v=', 'youtube.com/embed/')
                .replace('youtu.be/', 'youtube.com/embed/') : url
        return link
    }

    return (
        <div className='postviewer__container'>
            <div className="postviewer__routes">
                <h4 className='postviewer__routes-link' onClick={() => router.push('/blog')}>Open Journal</h4>
                {category ?
                    <>
                        {!isMobile ? <h4 className='postviewer__routes-separator'>&nbsp;-&nbsp;</h4> : ''}
                        <h4 className='postviewer__routes-link' onClick={() => router.push(`/blog/${category.trim().replaceAll(' ', '_')}`)}>
                            {isMobile ? '.' : ''}{capitalizeFirstLetter(category)}
                        </h4>
                    </>
                    : ''}
                {!isMobile ? <h4 className='postviewer__routes-separator' >&nbsp;-&nbsp;</h4> : ''}
                <h4 className='postviewer__routes-link' style={{ cursor: 'auto', opacity: 1 }}>
                    {isMobile ? '->' : ''}{lang === 'es' && post.spaTitle ? capitalizeFirstLetter(post.spaTitle) : capitalizeFirstLetter(post.title || '')}
                </h4>
            </div>
            {loading ?
                <span className="loader" style={{ margin: '10rem auto 60vh' }}></span>
                : <>
                    <Post
                        headers={{ ...post, sideImages, sideImgStyles }}
                        content={html || post.html || ''}
                        spaContent={spaHtml || post.spaHtml || ''}
                        linkLang={linkLang}
                    />
                    {post.video?.trim() ?
                        <div style={{ textAlign: 'center', margin: '0 0 6rem 0' }}>
                            <iframe src={parseYTLink(post.video)} width={isMobile ? '90%' : "700"} height={isMobile ? 'auto' : "400"} frameBorder={0} allowFullScreen />
                        </div>
                        : ''}
                    <div className="postviewer__row">
                        <div className="postviewer__share-section">
                            <h2 className="postviewer__share-text">{lang === 'es' ? 'Comparte este post' : 'Share this post'}</h2>
                            <img className="postviewer__share-icon" onClick={() => shareToPlatform('instagram')} src={'/assets/icons/instagram.svg'} />
                            <img className="postviewer__share-icon" onClick={() => shareToPlatform('facebook')} src={'/assets/icons/facebook.svg'} />
                            <img className="postviewer__share-icon" onClick={() => shareToPlatform('x')} src={'/assets/icons/x.svg'} />
                            <img className="postviewer__share-icon" onClick={() => shareToPlatform('linkedin')} src={'/assets/icons/linkedin.svg'} />
                            <img className="postviewer__share-icon" onClick={() => shareToPlatform('whatsapp')} src={'/assets/icons/whatsapp.svg'} />
                        </div>
                    </div>
                    <div className="postviewer__subscribe">
                        <h2 style={{ fontFamily: 'var(--font-madelyn), sans-serif' }}>{lang === 'es' ? 'Únete a mi Comunidad' : 'Join my Mail Community'}</h2>
                        <h3>{lang === 'es' ? 'Únete y recibe cartas mensuales 🖤' : 'Sign up for monthly letters 🖤'}</h3>
                        <div className="postviewer__subscribe-row">
                            <InputField
                                name='fullname'
                                updateData={updateSubscribeData}
                                placeholder={TEXT[lang]['full_name']}
                            />
                            <InputField
                                name='email'
                                updateData={updateSubscribeData}
                                placeholder={TEXT[lang]['your_email']}
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
                    <div className="postviewer__comments-section">
                        {/* <h2 className="postviewer__comments-title">{lang === 'es' ? 'Comentarios' : 'Comments'}</h2> */}
                        <div className="postviewer__comments-list" style={{ width: isMobile ? '90vw' : '30vw' }}>
                            {postComments.map((comment, i) => <Comment key={i} comment={comment} reply={submitComment} setReply={setSubmitComment} />)}
                        </div>
                        {!submitComment ?
                            <div className="postviewer__comments-post">
                                <h2 className="postviewer__comments-post-title">{lang === 'es' ? 'Deja tu comentario' : 'Leave a comment'}</h2>
                                <div className="postviewer__comments-reply" style={{ width: isMobile ? '90vw' : '30vw' }}>
                                    <InputField
                                        name='fullname'
                                        value={isLoggedIn ? 'Dany' : data.fullname}
                                        updateData={updateData}
                                        placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
                                        disabled={isLoggedIn || false}
                                    />
                                    {isLoggedIn ? '' :
                                        <InputField
                                            name='email'
                                            value={data.email}
                                            updateData={updateData}
                                            placeholder={lang === 'es' ? 'Tu email' : 'Your email'}
                                        />}
                                    <InputField
                                        name='comment'
                                        value={data.comment}
                                        updateData={updateData}
                                        placeholder={lang === 'es' ? 'Tu comentario' : 'Your comment'}
                                        type='textarea'
                                        rows={8}
                                    />
                                    <Button
                                        label={lang === 'es' ? 'Enviar' : 'Post Comment'}
                                        handleClick={postComment}
                                        style={{ width: '100%' }}
                                        disabled={!data.comment || (!isLoggedIn && !data.fullname)}
                                    />
                                </div>
                            </div>
                            : ''}
                    </div>
                    <img src={isMobile ? '/assets/illustrations/signature-mobile.png' : '/assets/illustrations/signature.png'} alt="Signature" draggable={false} className="postviewer__signature" />
                </>
            }
        </div>
    )
}