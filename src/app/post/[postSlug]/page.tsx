import { Metadata } from 'next'
import Post from './Post'
import { cache } from 'react'
import { getAllPosts, getPostById } from 'src/services/post'
import { postType } from 'src/app/types'

interface PostProps {
    params: { postSlug: string }
}

const getCachedPosts = cache(async () => {
    const posts = await getAllPosts({ isAdmin: true })
    return posts || []
})

const getCachedPost = cache(async (id: string) => {
    const post = await getPostById(id)
    return post || {}
})

const getBySlug = (slug: string, posts: postType[]) => {
    return posts.find((p: postType) => p.slug === slug) || {}
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { postSlug } = params
    const posts = await getCachedPosts()
    const post = getBySlug(postSlug, posts)
    const title = `An Echo of The Heart - ${post.title}`
    const description = post.description

    if (post && post.title) {
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

export async function generateStaticParams() {
    const posts = await getCachedPosts()
    return posts.filter((p: postType) => p.slug)
        .map((post: postType) => ({
            postSlug: post.slug
        }))
}

export default async function PostPage({ params }: PostProps) {
    const { postSlug } = params
    const posts = await getCachedPosts()
    const post = getBySlug(postSlug, posts)
    const postWithHtml = post._id ? await getCachedPost(post._id) : {}

    return <Post post={postWithHtml} />
}
