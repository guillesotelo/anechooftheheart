// blog/[category]/page.tsx

import { Metadata } from 'next'
import Blog from './Blog'
import { cache } from 'react'
import { getAllPosts } from 'src/services/post'
import { postType } from 'src/app/types'

interface PostProps {
    params: { category: string }
}

// Cache all posts with admin access
const getCachedPosts = cache(async () => {
    const posts = await getAllPosts({ isAdmin: true })
    return posts || []
})

// Metadata for SEO and social
export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { category } = params
    const title = `Posts about ${category} - An Echo of The Heart`
    const description = `'In each post, there is a little spark of joy and personal experience. There are photos that try to complement the story and a closing that wishes for connection.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: 'https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg'
                }
            ],
            url: `https://anechooftheheart.com/blog/${category}`,
            type: 'article',
        },
    }
}

// Enable ISR - revalidate every hour
export const revalidate = 3600

// Pre-generate all unique category pages
export async function generateStaticParams() {
    const posts = await getCachedPosts()

    const categories = new Set<string>()

    posts.forEach((post: postType) => {
        if (post.category) {
            categories.add(post.category.toLowerCase().replace(/ /g, '_'))
        }
    })

    return Array.from(categories).map(category => ({
        category
    }))
}

// Page component
export default async function BlogPage({ params }: PostProps) {
    const { category } = params
    const posts = await getCachedPosts()

    const normalizedCategory = category.toLowerCase().replace(/_/g, ' ')

    const filteredPosts = category === 'all'
        ? posts
        : posts.filter((post: postType) => {
            return (
                post.category?.toLowerCase().includes(normalizedCategory) ||
                post.tags?.toLowerCase().includes(normalizedCategory)
            )
        })

    return <Blog posts={filteredPosts} category={category} />
}
