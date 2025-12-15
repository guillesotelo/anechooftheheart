import React, { useContext, useEffect, useState } from 'react'
import { capitalizeFirstLetter } from 'src/helpers'
import { Document, Page, pdfjs } from 'react-pdf';
import { postType } from '../../types';
import { getContentBySlug } from 'src/services/post';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString();

type PdfViewerType = {
    file: File
}

function PdfViewer({ file }: PdfViewerType) {
    return (
        <Document file={file}>
            <Page pageNumber={1} />
        </Document>
    );
}

type Props = {
    post: postType
}

export default function Pdf({ post }: Props) {
    const [category, setCategory] = useState('')
    const [pdf, setPdf] = useState(null)
    const [data, setData] = useState(null)
    const { lang, isMobile, isLoggedIn } = useContext(AppContext)
    const router = useRouter()

    useEffect(() => {
        if (post.slug && (!pdf)) getPost()
    }, [post])

    const getPost = async () => {
        try {
            const _post = await getContentBySlug(post.slug || '')
            if (_post && _post._id) {
                if (_post.unpublished && !isLoggedIn === false) router.back()

                if (_post.pdf) setPdf(_post.pdf)
                setData(_post)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='postviewer__container'>
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
            {pdf ?
                <div className='post__container'>
                    <PdfViewer file={pdf} />
                </div>
                :
                <span className="loader" style={{ margin: '10rem auto 60vh' }}></span>
            }
        </div>
    )
}