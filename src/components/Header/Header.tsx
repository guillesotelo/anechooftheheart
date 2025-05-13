"use client"

import { useContext, useEffect, useState } from 'react'
import Button from '../Button/Button'
import { verifyToken } from '../../services/user'
import { deletePost } from '../../services/post'
import { toast } from 'react-hot-toast'
import { APP_VERSION } from '../../constants/app'
import { AppContext } from '../../app/context/AppContext'
import { TEXT } from '../../constants/lang'
import { dataObj, onChangeEventType, postType } from '../../app/types'
import { getPostBySlug } from '../../services/post'
import Tooltip from '../Tooltip/Tooltip'
import Hamburger from 'hamburger-react'
import { usePathname, useRouter } from 'next/navigation'
import { getUser } from 'src/helpers'
import { HashLoader } from 'react-spinners'

type Props = {
    search: string[]
    setSearch: (value: string[]) => void
    bespokenLogo?: string
}

export default function Header({ search, setSearch, bespokenLogo }: Props) {
    const { lang, setLang, isMobile } = useContext(AppContext)
    const [postId, setPostId] = useState('')
    const [prompt, setPrompt] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [menuToggle, setMenuToggle] = useState(false)
    const [blogToggle, setBlogToggle] = useState(false)
    const [searchClicked, setSearchClicked] = useState(false)
    const [bigHeader, setBigHeader] = useState(true)
    const [linkLoading, setLinkLoading] = useState<dataObj>({})
    const router = useRouter()
    const pathname = usePathname()
    const { setIsLoggedIn, isLoggedIn } = useContext(AppContext)

    useEffect(() => {
        const svg = document.querySelector('.header__menu-svg')
        const container = document.querySelector('.header__container')
        const list = document.querySelector('.home__postlist')
        const home = document.querySelector('.home__container')
        const blog = document.querySelector('.blog__container')
        window.addEventListener('mouseup', e => {
            const clicked = e.target
            // if (clicked !== svg) setMenuToggle(false)
            if (clicked === container
                || clicked === home
                || clicked === blog
                || clicked === list) {
                setSearchClicked(false)
            }
        })
        activateHeaderHeight()
        if (localStorage.getItem('user')) verifyUser()
    }, [])

    useEffect(() => {
        const isPost = pathname.split('/')[1] === 'post'
        if (isPost) {
            const slug = pathname.split('/')[2]
            if (slug) getPostId(slug)
            else setPostId('')
        }
        setLinkLoading({})
    }, [pathname])

    useEffect(() => {
        const postViewr = document.querySelector<HTMLElement>('.postviewer__container')
        const postEditor = document.querySelector<HTMLElement>('.editor__container')
        if (postViewr) {
            if (deleteModal) postViewr.style.filter = 'blur(10px)'
            else postViewr.style.filter = ''
        }
        if (postEditor) {
            if (deleteModal) postEditor.style.filter = 'blur(10px)'
            else postEditor.style.filter = ''
        }
    }, [deleteModal])

    const getPostId = async (slug: string) => {
        try {
            const post = await getPostBySlug(slug)
            if (post && post._id) setPostId(post._id)
            else setPostId('')
        } catch (error) {
            setPostId('')
            console.error(error)
        }
    }

    const verifyUser = async () => {
        try {
            const isLodded = await verifyToken(getUser())
            if (isLodded) setIsLoggedIn(isLodded)
        } catch (err) {
            console.error(err)
        }
    }

    const activateHeaderHeight = () => {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            if (scrollTop > 200) setBigHeader(false)
            else setBigHeader(true)
        })
    }

    const handleSearch = (e: onChangeEventType) => {
        const { value } = e.target
        setPrompt(value)
    }

    const triggerSearch = () => {
        if (isMobile) setSearchClicked(true)
        if (prompt.trim()) {
            setSearchClicked(false)
            setSearch(prompt.split(' '))
            router.push(`/search/${encodeURIComponent(prompt)}`)
            setPrompt('')
        }
    }

    const handleDeletePost = async () => {
        try {
            await toast.promise(
                deletePost({ _id: postId }),
                {
                    loading: TEXT[lang]['deleting_post'],
                    success: <b>Post deleted successfully. Redirecting...</b>,
                    error: <b>Error deleting post</b>,
                }
            )
            setDeleteModal(false)
            localStorage.removeItem('posts')
            setTimeout(() => router.push('/blog'), 1500)
        } catch (err) {
            console.error(err)
            setDeleteModal(false)
            toast.error('An error occurred while trying to delete the post')
        }
    }

    const logOut = () => {
        localStorage.clear()
        toast.success(TEXT[lang]['see_you_later'])
        setTimeout(() => {
            setIsLoggedIn(false)
            const posts = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts') || '[]') : []
            localStorage.setItem('posts', posts.filter((post: postType) => post.published))
            setPostId('')
            router.push('/')
        }, 1500)
    }

    const changeLanguage = (language: string) => {
        setLang(language)
        localStorage.setItem('preferedLang', language)
    }

    const goToNavLink = (path: string) => {
        setLinkLoading(prev => ({ ...prev, [path]: true }))
        router.push(path)
    }

    const renderMobile = () => {
        return (
            <>
                <div className='header__menu' >
                    {/* <img className="header__menu-svg" src={Menu} /> */}
                    <div className='header__menu-hamburger' onClick={() => setMenuToggle(!menuToggle)}>
                        <Hamburger animateOnMount size={25} toggled={menuToggle} toggle={setMenuToggle} color='#dcdcdc' easing="ease-in" rounded label="Show menu" />
                    </div>
                    <div className={`header__menu-sidebar${menuToggle ? '--toggled' : '--hidden'}`}>
                        {window.location.pathname !== '/' &&
                            <div className="header__menu-item">
                                <h4 className="header__menu-item-text" onClick={() => {
                                    setTimeout(() => setMenuToggle(false), 50)
                                    router.push('/')
                                }}>HOME</h4>
                            </div>}
                        <div className="header__menu-item">
                            <h4 className="header__menu-item-text" onClick={() => {
                                // setTimeout(() => setMenuToggle(false), 50)
                                // router.push('/blog')
                                setBlogToggle(!blogToggle)
                            }}>{TEXT[lang]['blog']}</h4>
                        </div>
                        {blogToggle ?
                            <div className="header__menu-subitem">
                                <div className="header__menu-subitem-row">
                                    <h4
                                        className="header__menu-subitem-text"
                                        onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/blog/inspiration')
                                        }}>{TEXT[lang]['inspiration']}</h4>
                                    {linkLoading['/blog/inspiration'] && <HashLoader size={20} color='#d3d3d3' />}
                                </div>
                                <div className="header__menu-subitem-row">
                                    <h4
                                        className="header__menu-subitem-text"
                                        style={{ animationDelay: '.2s' }}
                                        onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/blog/motherhood')
                                        }}>{TEXT[lang]['motherhood']}</h4>
                                    {linkLoading['/blog/motherhood'] && <HashLoader size={20} color='#d3d3d3' />}
                                </div>

                                <div className="header__menu-subitem-row">
                                    <h4
                                        className="header__menu-subitem-text"
                                        style={{ animationDelay: '.4s' }}
                                        onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/blog/life_abroad')
                                        }}>{TEXT[lang]['life_abroad']}</h4>
                                    {linkLoading['/blog/life_abroad'] && <HashLoader size={20} color='#d3d3d3' />}
                                </div>
                                <div className="header__menu-subitem-row">
                                    <h4
                                        className="header__menu-subitem-text"
                                        style={{ animationDelay: '.5s' }}
                                        onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/blog/career_insights')
                                        }}>{TEXT[lang]['career_insights']}</h4>
                                    {linkLoading['/blog/career_insights'] && <HashLoader size={20} color='#d3d3d3' />}
                                </div>
                                <div className="header__menu-subitem-row">
                                    <h4
                                        className="header__menu-subitem-text"
                                        style={{ animationDelay: '.5s' }}
                                        onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/blog/all')
                                        }}>All posts</h4>
                                    {linkLoading['/blog/all'] && <HashLoader size={20} color='#d3d3d3' />}
                                </div>
                            </div>
                            :
                            <>
                                <div className="header__menu-item">
                                    <div className="header__menu-item-row">
                                        <h4 className="header__menu-item-text" onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/bespoken/home')
                                        }}>{TEXT[lang]['bespoken']}</h4>
                                        {linkLoading['/bespoken/home'] && <HashLoader size={20} color='#d3d3d3' />}
                                    </div>
                                </div>
                                <div className="header__menu-item">
                                    <div className="header__menu-item-row">
                                        <h4 className="header__menu-item-text" style={{ paddingBottom: '8vw' }} onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            goToNavLink('/about')
                                        }}>{TEXT[lang]['about_greeting']}</h4>
                                        {linkLoading['/about'] && <HashLoader size={20} color='#d3d3d3' />}
                                    </div>
                                </div>
                                {/* <div className="header__menu-item header__language">
                                    <div className="header__menu-item-text" onClick={() => {
                                        changeLanguage(lang === 'en' ? 'es' : 'en')
                                        setTimeout(() => setMenuToggle(false), 1000)
                                    }}>
                                        {lang === 'es' ?
                                            <img src={UsaFlag} alt="" className="header__item-dropdown-img header__item-dropdown-text" />
                                            : <img src={SpainFlag} alt="" className="header__item-dropdown-img header__item-dropdown-text" />
                                        }</div>
                                </div> */}
                                {isLoggedIn ?
                                    <div className="header__menu-item" >
                                        <h4 className="header__menu-item-text" onClick={() => {
                                            setTimeout(() => setMenuToggle(false), 50)
                                            logOut()
                                        }}>Logout</h4>
                                    </div>
                                    : ''}
                            </>
                        }
                        <div className="header__menu-item" style={{
                            // position: 'relative'
                        }}>
                            <h4 className="header__menu-item-text" style={{
                                position: 'fixed',
                                bottom: '15%',
                                color: '#fff',
                                fontSize: isMobile ? '.9rem' : '.75rem'
                            }}
                                onClick={() => window.open('https://github.com/guillesotelo/bydanygarcia', '_blank', 'noreferrer')}>{APP_VERSION}</h4>
                        </div>
                    </div>
                </div>
                {isLoggedIn && !searchClicked ?
                    <div className="header__admin-btns" style={{ margin: '0 4vw', gap: '3vw', border: 'none' }}>
                        <Button
                            label='Create'
                            handleClick={() => router.push('/editor?new=true')}
                        />
                        {postId ?
                            <Button
                                svg={'/assets/icons/edit.svg'}
                                handleClick={() => router.push(`/editor?id=${postId}`)}
                            />
                            : ''}
                        {postId ?
                            <Button
                                svg={'/assets/icons/delete.svg'}
                                handleClick={() => setDeleteModal(true)}
                            />
                            : ''}
                    </div>
                    : ''}
                {!searchClicked && !isLoggedIn && bespokenLogo ?
                    <div className="header__logo"
                        onClick={() => {
                            setSearch([])
                            setPrompt('')
                            if (bespokenLogo) router.push('/bespoken/home')
                            else router.push('/')
                        }}>
                        {/* <h4 className="header__logo-text">An Echo of the Heart</h4> */}
                        <img
                            className="header__logo-image"
                            style={{
                                maxHeight: '2rem',
                                margin: 0
                            }}
                            src={bespokenLogo}
                            alt='Bespoken'
                            loading='lazy' />
                    </div>
                    : ''}
                <div className="header__search" >
                    <img className="header__search-svg" src={'/assets/icons/search-icon.svg'} onClick={triggerSearch} />
                    {searchClicked ?
                        <input type="text" className="header__search-input" placeholder={TEXT[lang]['search']} onChange={handleSearch} onKeyDown={e => {
                            if (e.key === 'Enter') triggerSearch()
                        }} />
                        : ''}
                </div>
            </>
        )
    }

    const renderDesktop = () => {
        return (
            <>
                <div className="header__items">
                    <div className="header__item">
                        <h4 className="header__item-text no-pointer">{TEXT[lang]['blog']}</h4>
                        <img className="header__item-svg" src={'/assets/icons/chevron-down.svg'} />
                        <div className="header__item-dropdown" style={{ background: bigHeader ? '#00000099' : '#00000092' }}>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/blog/inspiration')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['inspiration']}
                                </h4>
                                {linkLoading['/blog/inspiration'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/blog/motherhood')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['motherhood']}
                                </h4>
                                {linkLoading['/blog/motherhood'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/blog/life_abroad')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['life_abroad']}
                                </h4>
                                {linkLoading['/blog/life_abroad'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/blog/career_insights')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['career_insights']}
                                </h4>
                                {linkLoading['/blog/career_insights'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/blog/all')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['see_all']}
                                </h4>
                                {linkLoading['/blog/all'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            {/* <div className="header__item-dropdown-row">
                                    <h4 className="header__item-dropdown-text" onClick={() => router.push('/subscribe')}>
                                        {TEXT[lang]['subscribe']}
                                    </h4>
                                </div> */}
                        </div>
                    </div>
                    <div className="header__item">
                        <h4 className="header__item-text">{TEXT[lang]['bespoken']}</h4>
                        <img className="header__item-svg" src={'/assets/icons/chevron-down.svg'} />
                        <div className="header__item-dropdown" style={{ background: bigHeader ? '#00000099' : '#00000092' }}>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/store')}>
                                <h4 className="header__item-dropdown-text">
                                    STORE
                                </h4>
                                {linkLoading['/store'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/bespoken/story')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['story_of_brand']}
                                </h4>
                                {linkLoading['/bespoken/story'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            <div className="header__item-dropdown-row" onClick={() => goToNavLink('/bespoken/products')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['products']}
                                </h4>
                                {linkLoading['/bespoken/products'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div>
                            {/* <div className="header__item-dropdown-row" onClick={() => goToNavLink('/bespoken/wedding')}>
                                <h4 className="header__item-dropdown-text">
                                    {TEXT[lang]['our_handcrafted_wedding']}
                                </h4>
                                {linkLoading['/bespoken/wedding'] && <HashLoader size={20} color='#d3d3d3' />}
                            </div> */}
                            {/* <div className="header__item-dropdown-row" onClick={() => goToNavLink('/bespoken/values')}>
                                    <h4 className="header__item-dropdown-text">
                                        {TEXT[lang]['values']}
                                    </h4>
                                {linkLoading['/bespoken/values'] && <HashLoader size={20} color='#d3d3d3' />}
                                </div> */}
                        </div>
                    </div>
                    <div className="header__item" onClick={() => router.push('/about')}>
                        <h4 className="header__item-text">{TEXT[lang]['about_greeting']}</h4>
                    </div>
                </div>

                {!searchClicked || !isLoggedIn ?
                    <div className="header__logo"
                        onClick={() => {
                            setSearch([])
                            setPrompt('')
                            if (bespokenLogo) router.push('/bespoken/story')
                            else router.push('/')
                        }}>
                        {bespokenLogo ?
                            <img
                                className="header__logo-image"
                                style={{
                                    height: '2rem',
                                    margin: 0
                                }}
                                src={bespokenLogo}
                                alt='Bespoken'
                                loading='lazy' />
                            :
                            ''
                            // <h4 className="header__logo-text">An Echo of the Heart</h4>
                        }
                    </div>
                    : ''}

                <div className='header__admin-panel'>
                    {isLoggedIn ?
                        <div className="header__admin-btns">
                            <Tooltip tooltip='Create a new post'>
                                <Button
                                    label='Create'
                                    handleClick={() => router.push('/editor?new=true')}
                                    bgColor='transparent'
                                    textColor='#fff'
                                />
                            </Tooltip>
                            {postId ?
                                <>
                                    <Tooltip tooltip='Edit this post'>
                                        <Button
                                            svg={'/assets/icons/edit.svg'}
                                            handleClick={() => router.push(`/editor?id=${postId}`)}
                                            bgColor='transparent'
                                            textColor='#fff'
                                        />
                                    </Tooltip>
                                    <Tooltip tooltip='Delete this post'>
                                        <Button
                                            svg={'/assets/icons/delete.svg'}
                                            handleClick={() => setDeleteModal(true)}
                                            bgColor='transparent'
                                            textColor='#fff'
                                        />
                                    </Tooltip>
                                </>
                                : ''}
                            <Tooltip tooltip='Newsletter'>
                                <Button
                                    svg={'/assets/icons/notification.svg'}
                                    handleClick={() => router.push('/notifications')}
                                    bgColor='transparent'
                                    textColor='#fff'
                                />
                            </Tooltip>
                            <Button
                                label='Logout'
                                handleClick={logOut}
                                bgColor='transparent'
                                textColor='#fff'
                            />
                        </div>
                        : ''}

                    <div className="header__search" >
                        {/* <div className="header__item header__language" style={{ justifySelf: 'flex-end' }}>
                            <h4 className="header__item-text">{lang.toUpperCase()}</h4>
                            <img className="header__item-svg" src={'/assets/icons/chevron-down.svg'} />
                            <div className="header__item-dropdown" style={{ marginTop: bigHeader ? '5rem' : '3rem' }}>
                                <div className="header__item-dropdown-row" onClick={() => changeLanguage('en')}>
                                    <img src={UsaFlag} alt="" className="header__item-dropdown-img header__item-dropdown-text" />
                                    <h4 className="header__item-dropdown-text">
                                        ENGLISH
                                    </h4>
                                </div>
                                <div className="header__item-dropdown-row" onClick={() => changeLanguage('es')}>
                                    <img src={SpainFlag} alt="" className="header__item-dropdown-img header__item-dropdown-text" />
                                    <h4 className="header__item-dropdown-text">
                                        ESPAÑOL
                                    </h4>
                                </div>
                            </div>
                        </div> */}
                        {window.location.pathname !== '/' &&
                            <div className="header__item" onClick={() => router.push('/')} style={{ marginRight: '2rem' }}>
                                <h4 className="header__item-text">HOME</h4>
                            </div>}
                        <img className="header__search-svg" src={'/assets/icons/search-icon.svg'} onClick={triggerSearch} />
                        {searchClicked || !isMobile ?
                            <input type="text" className="header__search-input" placeholder={TEXT[lang]['search']} onChange={handleSearch} onKeyDown={e => {
                                if (e.key === 'Enter') triggerSearch()
                            }} />
                            : ''}
                    </div>
                </div>
            </>)
    }

    return (
        <div className='header__container' style={{ background: bigHeader ? '#00000099' : '#00000092' }}>
            {deleteModal ?
                <div className='header__delete-modal'>
                    <h4 className="header__delete-modal-text">Are you sure you want to delete this post?</h4>
                    <div className="header__delete-modal-btns">
                        <Button
                            label='Cancel'
                            handleClick={() => setDeleteModal(false)}
                            bgColor='lightgray'
                        />
                        <Button
                            label='Delete'
                            handleClick={handleDeletePost}
                        />
                    </div>
                </div>
                : ''}
            {isMobile ? renderMobile() : renderDesktop()}
        </div>
    )
}