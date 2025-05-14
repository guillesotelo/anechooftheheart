"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { AppContext } from '../../app/context/AppContext'
import { TEXT } from '../../constants/lang'
import { postHeadersType } from '../../app/types'

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
    const contentRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        setSpanish(lang === 'es' || linkLang === 'es')
    }, [lang])

    useEffect(() => {
        if (headers.sideImages) setSideImages(headers.sideImages)
        if (headers.sideImgStyles) setSideImgStyles(headers.sideImgStyles)
    }, [content])

    useEffect(() => {
        if (!contentRef.current) return;
        // Defer styling until the DOM has painted the injected HTML
        setTimeout(() => styleImagesInParagraphs(), 200)
    }, [spaContent, content])

    const copyLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(`${currentUrl}&lang=${lang}`)
        toast.success(TEXT[lang]['link_copied'])
    }

    const styleImagesInParagraphs = () => {
        if (contentRef.current) {
            const paragraphs = contentRef.current.querySelectorAll('p');
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
                    ref={contentRef}
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