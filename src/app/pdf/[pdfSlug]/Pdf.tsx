"use client"

import React, { useEffect, useState } from 'react'
import { capitalizeFirstLetter } from 'src/helpers'
import { postType } from '../../types';
import PdfViewer from './PdfViewer';
import { getPdfBlobBySlug } from 'src/services/post'

type Props = {
    post: postType
}

export default function Pdf({ post }: Props) {
    const [category, setCategory] = useState('')
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!post?.slug) return
        loadPdf()
        return () => cleanUpPdf()
    }, [post?.slug])

    const loadPdf = async () => {
        try {
            const blob = await getPdfBlobBySlug(post.slug || '')
            if (blob) {
                const url = URL.createObjectURL(blob)
                setPdfUrl(url)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const cleanUpPdf = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }

    return (
        <div className='pdf__container'>
            <div className="postviewer__routes">
                <a className='postviewer__routes-link' href={`/blog/all`}>Open Journal</a>
                {category ?
                    <>
                        <p style={{ margin: 0, color: 'gray' }}>{">"}</p>
                        <a className='postviewer__routes-link' href={`/blog/${category.trim().replaceAll(' ', '_')}`}>{capitalizeFirstLetter(category)}</a>
                        {/* <p style={{ margin: 0, color: 'gray' }}>{">"}</p>
                          <a className='postviewer__routes-link' href={`/blog/${category.trim().replaceAll(' ', '_')}/${post.slug}`}>{post.title || post.spaTitle}</a> */}
                    </>
                    : ''}
            </div>
            {pdfUrl ?
                <div className='pdf__viewer-container'>
                    <PdfViewer file={pdfUrl} />
                </div>
                :
                <span className="loader" style={{ margin: '10rem auto 60vh' }}></span>
            }
        </div>
    )
}