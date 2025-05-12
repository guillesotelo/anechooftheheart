import { Metadata } from 'next'
import Blog from './Blog'
import { cache } from 'react'
import { getAllPosts, getPostById } from 'src/services/post'
import { postType } from 'src/app/types'
import { getPostComments } from 'src/services/comment'

interface PostProps {
    params: { category: string }
}

const getCachedPosts = cache(async () => {
    const posts = await getAllPosts({ isAdmin: true })
    return posts || []
})

export async function generateStaticParams() {
    const posts = await getCachedPosts()
    return posts.map((post: postType) => ({
        category: post.category
    }))
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { category } = params
    const title = `An Echo of The Heart - Open Journal`
    const description = `'In each post, there is a little spark of joy and personal experience. There are photos that try to complement the story and a closing that wishes for connection.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: 'https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg' }],
            url: `https://anechooftheheart.com/blog/${category}`,
            type: 'article',
        },
    }
}

export default async function EditionPage({ params }: PostProps) {
    const { category } = params

    const postsByCategory = (await getCachedPosts() || []).filter((post: postType) => {
        if (category === 'all' || (post.tags && post.tags.toLowerCase().includes(category.replace(/_/g, '')))
            || post.category && post.category.toLowerCase().includes(category.replace(/_/g, ' '))) {
            return post
        }
    })

    return <Blog posts={postsByCategory} category={category} />
}
