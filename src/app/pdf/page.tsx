"use client"

import React, { useContext, useEffect, useState } from 'react'
import { postType } from '../types'
import { useRouter } from 'next/navigation'
import { getAllPdfs } from 'src/services/post'
import { AppContext } from '../context/AppContext'

type Props = {}

export default function Pdfs({ }: Props) {
    const [pdfs, setPdfs] = useState<null | postType[]>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { isLoggedIn } = useContext(AppContext)


    useEffect(() => {
        if (isLoggedIn !== null && !isLoggedIn) return router.push('/')
    }, [isLoggedIn])

    useEffect(() => {
        getPdfs()
    }, [])

    const getPdfs = async () => {
        try {
            setLoading(true)
            const _pdfs = await getAllPdfs()
            if (_pdfs && _pdfs.length) setPdfs(_pdfs)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error)
        }
    }

    return (
        <div className="pdfs__container">
            <h1 style={{ textAlign: 'center' }}>PDF Archive</h1>
            <div className="pdfs__list">{pdfs && pdfs.length && isLoggedIn ?
                pdfs.map((p, i) =>
                    <div key={i} className='pdfs__item'>
                        <p style={{ margin: '0' }} onClick={() => router.push(`/pdf/${p.slug}`)}><strong>{p.pdfTitle}</strong></p>
                        <p style={{ margin: '0' }} onClick={() => router.push(`/pdf/${p.slug}`)}>Published: <span style={{ color: p.published ? 'green' : 'orange' }}>{p.published ? 'Yes' : 'No'}</span></p>
                        <div className='pdfs__item-image-wrapper' onClick={() => router.push(`/pdf/${p.slug}`)}>
                            <img className='pdfs__item-image' src={p.previewImage} alt='Preview Image' />
                        </div>
                        <button className='pdfs__item-btn' onClick={() => router.push(`/editor?id=${p._id}`)}>Edit</button>
                    </div>)
                : <p>{loading ? 'Getting PDFs...' : 'No PDFs found.'}</p>}</div>
        </div >
    )
}