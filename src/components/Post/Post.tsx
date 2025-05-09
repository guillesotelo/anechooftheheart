import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ShareIcon from '../../assets/icons/share.svg'
import { AppContext } from '../../AppContext'
import { TEXT } from '../../constants/lang'
import { postHeadersType } from '../../types'

type Props = {
    content?: string
    spaContent?: string
    linkLang?: string
    headers: postHeadersType
}

export default function Post({ headers, content, spaContent, linkLang }: Props) {
    const [sideImages, setSideImages] = useState<string[]>([])
    const [sideImgStyles, setSideImgStyles] = useState<React.CSSProperties[]>([])
    const [spanish, setSpanish] = useState(false)
    const { lang, isMobile } = useContext(AppContext)

    useEffect(() => {
        setSpanish(lang === 'es' || linkLang === 'es')
    }, [lang])

    useEffect(() => {
        if (headers.sideImages) setSideImages(headers.sideImages)
        if (headers.sideImgStyles) setSideImgStyles(headers.sideImgStyles)
    }, [content])

    const copyLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(`${currentUrl}&lang=${lang}`)
        toast.success(TEXT[lang]['link_copied'])
    }

    return (
        <div className='post__container' style={{
            flexDirection: !isMobile && sideImages.length ? 'row' : 'column',
            alignItems: !isMobile && sideImages.length ? 'flex-start' : 'center',
        }}>
            {headers._id && !headers.published ?
                <div
                    className="post__not-published"
                    style={{
                        right: isMobile ? '-6rem' : '',
                        top: isMobile ? '1rem' : '',
                        transform: isMobile ? 'rotate(45deg) scale(.7)' : '',
                    }}
                >
                    <p className="post__not-published-text">Not Published</p>
                </div> : ''}
            <div className="post__body" style={{
                width: !isMobile && sideImages.length ? '50%' : ''
            }}>
                <div className="post__headers">
                    {/* <img className="post__share-icon" onClick={copyLink} src={ShareIcon} /> */}
                    <h1 className="post__title">{spanish && headers.spaTitle ? headers.spaTitle : headers.title || headers.spaTitle || ''}</h1>
                    <h3 className="post__subtitle">{spanish && headers.spaSubtitle ? headers.spaSubtitle : headers.subtitle || headers.spaSubtitle || ''}</h3>
                </div>
                <div
                    className="post__content"
                    dangerouslySetInnerHTML={{ __html: spanish && spaContent && spaContent.length > 10 ? spaContent : content || spaContent || '' }}
                />
            </div>
            <div className="post__side-images">
                {sideImages.map((image, i) =>
                    <img
                        key={i}
                        className='post__side-image'
                        src={image}
                        alt='Post Image'
                        loading='lazy'
                        style={sideImgStyles[i] || {}}
                    />
                )}
            </div>
        </div>
    )
}