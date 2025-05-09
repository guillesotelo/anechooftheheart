import React, { useContext, useEffect, useState } from 'react'
import Post from '../../components/Post/Post'
import { getPostBySlug } from '../../services/post'
import { useHistory, useLocation } from 'react-router-dom'
import { AppContext } from '../../AppContext'
import { commentType, onChangeEventType, postType } from '../../types'
import InputField from '../../components/InputField/InputField'
import Comment from '../../components/Comment/Comment'
import { createComment, getPostComments } from '../../services/comment'
import Button from '../../components/Button/Button'
import toast from 'react-hot-toast'
import Instagram from '../../assets/icons/instagram.svg'
import Facebook from '../../assets/icons/facebook.svg'
import X from '../../assets/icons/x.svg'
import Linkedin from '../../assets/icons/linkedin.svg'
import Whatsapp from '../../assets/icons/whatsapp.svg'
import SEO from '../../components/SEO/Seo'
import WebSignature from '../../assets/illustrations/signature.png'
import WebSignatureMobile from '../../assets/illustrations/signature-mobile.png'
import { TEXT } from '../../constants/lang'
import { subscribe } from '../../services/app'
import { history } from '../../helpers'
const REACT_APP_PAGE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.REACT_APP_PAGE

type Props = {
}

export default function PostViewer({ }: Props) {
    const [data, setData] = useState<commentType>({})
    const [subscribeData, setSubscribeData] = useState({ email: '', fullname: '' })
    const [post, setPost] = useState<postType>({})
    const [html, setHtml] = useState('')
    const [spaHtml, setspaHtml] = useState('')
    const [postSlug, setPostSlug] = useState('')
    const [loading, setLoading] = useState(false)
    const [spanish, setSpanish] = useState(false)
    const [sideImages, setSideImages] = useState<string[]>([])
    const [postComments, setPostComments] = useState<commentType[]>([])
    const [sideImgStyles, setSideImgStyles] = useState<React.CSSProperties[]>([])
    const [linkLang, setLinkLang] = useState('')
    const [category, setCategory] = useState('')
    const [submitComment, setSubmitComment] = useState(false)
    const location = useLocation()
    const history = useHistory()
    const { lang, isMobile, isLoggedIn } = useContext(AppContext)

    useEffect(() => {
        setSpanish(lang === 'es')
    }, [])

    useEffect(() => {
        const slug = location.pathname.split('/')[2]
        const language = new URLSearchParams(document.location.search).get('lang')
        // const updated = new URLSearchParams(document.location.search).get('updated')

        // if (updated && id) getPost(id)
        if (slug) setPostSlug(slug)
        if (language) setLinkLang(language)
    }, [location])

    useEffect(() => {
        renderSeo()
        if (!html && !spaHtml && postSlug) getPost(postSlug)
        if (!postComments.length && post && post._id) getComments(post._id)
        if (!category) getCategory()
    }, [postSlug])

    useEffect(() => {
        styleImagesInParagraphs()
    }, [html, spaHtml, loading])

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
            setTimeout(() => history.push('/'), 1500)
        } else toast.error(TEXT[lang]['subscribe_error'])

        return toast.remove(loading)
    }

    const styleImagesInParagraphs = () => {
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(paragraph => {
            const images = paragraph.querySelectorAll('img');
            if (images.length === 1) {
                (images[0] as HTMLElement).style.width = '100%';
                if (isMobile) (images[0] as HTMLElement).style.width = '90%';
            } else if (images.length > 1) {
                paragraph.style.textAlign = 'center';
                const width = 100 / images.length;
                images.forEach(image => {
                    // (image as HTMLElement).style.width = `${width}%`;
                    (image as HTMLElement).style.height = 'auto';
                    (image as HTMLElement).style.display = 'inline';
                    if (isMobile) (image as HTMLElement).style.width = '100%';
                });
            }
        });

        const paragraphsWithImages = Array.from(document.querySelectorAll('p > img'))
        paragraphsWithImages.forEach((image) => {
            if (image.parentElement instanceof HTMLElement) {
                const paragraph = image.parentElement
                paragraph.style.textAlign = 'center';
                (image as HTMLElement).style.display = 'inline';
                if (isMobile) (image as HTMLElement).style.width = '100%';
            }
        })
    }



    const getCategory = () => {
        const _category = post.category ? JSON.parse(post.category || '[]')[0] :
            post.tags ? post.tags.replace(/#/g, '').replace(/_/g, ' ').split(' ')[0] : ''
        if (_category.length) setCategory(_category.toLocaleLowerCase())
    }

    const getPost = async (slug: string) => {
        try {
            setLoading(true)
            const _post = await getPostBySlug(slug)
            if (_post && _post._id) {
                if (_post.unpublished && !isLoggedIn === false) history.goBack()

                setPost(_post)
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
                getComments(_post._id)
                setData({ ...data, postId: _post._id })
            } else history.goBack()
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
    const getOgDescription = () => {
        if (spanish && post.spaSubtitle) return post.spaSubtitle
        if (post.subtitle) return post.subtitle

        const div = document.createElement('div')
        div.innerHTML = spanish ? spaHtml : html
        return div.textContent?.substring(0, 40) + '...'
    }

    const renderSeo = () => {
        const title = spanish && post.spaTitle ? post.spaTitle : post.title || post.spaTitle || ''
        const description = getOgDescription()
        const image = post.imageUrl || 'https://www.anechooftheheart.com/images/stay-connected2.png'
        const url = `${REACT_APP_PAGE}/post/${post.slug}`

        return <SEO
            title={title}
            description={description}
            image={image}
            url={url}
            type='website'
        />
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
            {renderSeo()}
            <div className="postviewer__routes">
                <h4 className='postviewer__routes-link' onClick={() => history.push('/blog')}>{lang === 'es' ? 'BITÁCORA ABIERTA' : 'OPEN JOURNAL'}</h4>
                {category ?
                    <>
                        {!isMobile ? <h4 className='postviewer__routes-link' >&nbsp;-&nbsp;</h4> : ''}
                        <h4 className='postviewer__routes-link' onClick={() => history.push(`/blog?category=${category.trim().replaceAll(' ', '_')}`)}>{isMobile ? '.' : ''}{category.toUpperCase()}</h4>
                    </>
                    : ''}
                {!isMobile ? <h4 className='postviewer__routes-link' >&nbsp;-&nbsp;</h4> : ''}
                <h4 className='postviewer__routes-link'>{isMobile ? '..' : ''}{lang === 'es' && post.spaTitle ? post.spaTitle.toUpperCase() : post.title?.toUpperCase()}</h4>
            </div>
            {loading ? <span className="loader" style={{ margin: '10rem auto 60vh' }}></span>
                :
                <Post
                    headers={{ ...post, sideImages, sideImgStyles }}
                    content={html}
                    spaContent={spaHtml}
                    linkLang={linkLang}
                />
            }

            {post.video?.trim() ?
                <div style={{ textAlign: 'center', margin: '0 0 6rem 0' }}>
                    <iframe src={parseYTLink(post.video)} width={isMobile ? '90%' : "700"} height={isMobile ? 'auto' : "400"} frameBorder={0} allowFullScreen />
                </div>
                : ''}
            <div className="postviewer__row">
                <div className="postviewer__share-section">
                    <h2 className="postviewer__share-text">{lang === 'es' ? 'Comparte este post' : 'Share this post'}</h2>
                    <img className="postviewer__share-icon" onClick={() => shareToPlatform('instagram')} src={Instagram} />
                    <img className="postviewer__share-icon" onClick={() => shareToPlatform('facebook')} src={Facebook} />
                    <img className="postviewer__share-icon" onClick={() => shareToPlatform('x')} src={X} />
                    <img className="postviewer__share-icon" onClick={() => shareToPlatform('linkedin')} src={Linkedin} />
                    <img className="postviewer__share-icon" onClick={() => shareToPlatform('whatsapp')} src={Whatsapp} />
                </div>
            </div>
            <div className="postviewer__subscribe">
                <h2 style={{ fontFamily: '"Madelyn", sans-serif' }}>{lang === 'es' ? 'Únete a mi Comunidad' : 'Join my Mail Community'}</h2>
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
            <img src={isMobile ? WebSignatureMobile : WebSignature} alt="Signature" draggable={false} className="postviewer__signature" />

        </div>
    )
}