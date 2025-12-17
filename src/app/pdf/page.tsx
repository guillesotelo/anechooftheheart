"use client"

import React, { useEffect, useState } from 'react'
import { postType } from '../types'
import { useRouter } from 'next/navigation'
import { getAllPdfs } from 'src/services/post'

type Props = {}

export default function Pdfs({ }: Props) {
    const [pdfs, setPdfs] = useState<null | postType[]>(null)
    const router = useRouter()

    useEffect(() => {
        getPdfs()
    }, [])

    const getPdfs = async () => {
        try {
            const _pdfs = await getAllPdfs()
            if (_pdfs && _pdfs.length) setPdfs(_pdfs)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="pdfs__container">
            <div className="pdfs__list">{pdfs && pdfs.length ?
                pdfs.map((p, i) =>
                    <div key={i} className='pdfs__item' onClick={() => router.push(`/pdf/${p.slug}`)}>
                        <button className='pdfs__item-btn' onClick={() => router.push(`/editor?id=${p._id}`)}>Edit</button>
                        <p><strong>{p.pdfTitle}</strong></p>
                        <p>Published: {p.published ? 'Yes' : 'No'}</p>
                        <img src={p.previewImage} style={{ height: '20vh', width: 'auto' }} alt='Preview Image' />
                    </div>)
                : <p>No PDFs found.</p>}</div>
        </div>
    )
}