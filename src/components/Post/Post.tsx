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
        if (!contentRef.current) return

        const observer = new MutationObserver(() => {
            styleImagesInParagraphs()
        })

        observer.observe(contentRef.current, {
            childList: true,
            subtree: true,
        })

        styleImagesInParagraphs()

        return () => observer.disconnect()
    }, [])

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

const styleImagesInParagraphs = () => {
    if (contentRef.current) {
        const paragraphs = contentRef.current.querySelectorAll('p');

        paragraphs.forEach(paragraph => {
            const images = paragraph.querySelectorAll('img');

            // If no images, leave the content exactly as is
            if (images.length === 0) {
                return;
            }

            // Check if the paragraph contains only images and spacing (spaces, &nbsp;, \n, etc.)
            const onlyImagesAndSpaces = Array.from(paragraph.childNodes).every(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    return (node as HTMLElement).tagName.toLowerCase() === 'img';
                } else if (node.nodeType === Node.TEXT_NODE) {
                    // Allow whitespace including line breaks and &nbsp;
                    return /^[\s\u00A0]*$/.test(node.textContent ?? '');
                }
                return false;
            });

            // If it's only images and whitespace, clean text nodes (e.g., strip &nbsp;)
            if (onlyImagesAndSpaces) {
                paragraph.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // Optional: normalize spacing if you want to display it clean
                        node.textContent = node.textContent?.replace(/\u00A0/g, ' ').trim() ?? '';
                    }
                });
            }

            // Style based on number of images
            if (images.length === 1) {
                const imgEl = images[0] as HTMLElement;
                imgEl.style.width = '100%';
                imgEl.style.transition = '.2s';
            } else if (images.length > 1) {
                paragraph.style.display = 'flex';
                paragraph.style.flexDirection = 'row';
                paragraph.style.justifyContent = 'space-between';

                const width = 98 / images.length;
                images.forEach(image => {
                    const imgEl = image as HTMLElement;
                    imgEl.style.width = `${width}%`;
                    imgEl.style.height = 'auto';
                    imgEl.style.display = 'inline';
                    imgEl.style.transition = '.2s';
                });
            }
        });
    }
};



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