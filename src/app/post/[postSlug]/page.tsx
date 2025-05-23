import { Metadata } from 'next'
import Post from './Post'
import { cache } from 'react'
import { getAllPosts } from 'src/services/post'
import { postType } from 'src/app/types'

interface PostProps {
    params: { postSlug: string }
}

const getCachedPosts = cache(async () => {
    const posts = await getAllPosts({ isAdmin: true, getHtml: true })
    return posts || []
})

// ISR
export const revalidate = 3600

export async function generateStaticParams() {
    const posts = await getCachedPosts()
    return posts.map((post: postType) => ({ postSlug: post.slug }))
}

const getPostBySlug = (slug: string, posts: postType[]) => {
    return posts.find((p: postType) => p.slug === slug) || {}
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { postSlug } = params
    const posts = await getCachedPosts()
    const post = getPostBySlug(postSlug, posts)
    const title = `An Echo of The Heart - ${post.title}`
    const description = post.description

    if (post && post.title) {
        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [{ url: post.imageUrl || '' }],
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
    const posts = await getCachedPosts()
    const post = getPostBySlug(postSlug, posts)

    return <Post post={post} />
}
