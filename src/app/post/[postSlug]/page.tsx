import { Metadata } from 'next'
import Post from './Post'
import { cache } from 'react'
import { getMetadataBySlug } from 'src/services/post'

interface PostProps {
    params: { postSlug: string }
}

const getCachedPost = cache(async (slug: string) => {
    const post = await getMetadataBySlug(slug)
    return post || {}
})

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { postSlug } = params
    const post = await getCachedPost(postSlug)
    const title = `An Echo of The Heart - ${post.title || post.spaTitle}`
    const description = post.description

    if (post && (post.title || post.spaTitle)) {
        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [{ url: post.previewImage || '' }],
                url: `https://anechooftheheart.com/post/${postSlug}`,
                type: 'article',
            },
        }
    }

    return {
        title: 'Post Not Found'
    }
}

export default async function PostPage({ params }: PostProps) {
    const { postSlug } = params
    const post = await getCachedPost(postSlug)

    return <Post post={post} />
}
