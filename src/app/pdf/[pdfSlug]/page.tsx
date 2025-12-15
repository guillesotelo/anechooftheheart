import { Metadata } from 'next'
import Pdf from './Pdf'
import { cache } from 'react'
import { getMetadataBySlug } from 'src/services/post'

interface PostProps {
    params: { pdfSlug: string }
}

const getCachedPost = cache(async (slug: string) => {
    const post = await getMetadataBySlug(slug)
    return post || {}
})

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { pdfSlug } = params
    const post = await getCachedPost(pdfSlug)
    const title = `An Echo of The Heart - ${post.title || post.spaTitle || post.pdfTitle}`
    const description = post.description || ''

    if (post && (post.title || post.spaTitle)) {
        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [{ url: post.previewImage || '' }],
                url: `https://anechooftheheart.com/pdf/${pdfSlug}`,
                type: 'article',
            },
        }
    }

    return {
        title: 'PDF Not Found'
    }
}

export default async function PdfPage({ params }: PostProps) {
    const { pdfSlug } = params
    const post = await getCachedPost(pdfSlug)

    return <Pdf post={post} />
}
