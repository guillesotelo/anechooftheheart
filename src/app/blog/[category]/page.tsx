import { Metadata } from 'next'
import Blog from './Blog'
import { cache } from 'react'
import { getAllPosts, getPostById } from 'src/services/post'
import { postType } from 'src/app/types'
import { capitalizeFirstLetter } from 'src/helpers'

// ISR
export const dynamic = 'force-static'
export const revalidate = 3600

interface PostProps {
    params: { category: string }
}

const getCachedPosts = cache(async () => {
    const posts = await getAllPosts({ isAdmin: true })
    return posts || []
})

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { category } = params
    const title = `An Echo of The Heart - ${capitalizeFirstLetter(category.replaceAll('-', ' '))}`
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

export default async function BlogPage({ params }: PostProps) {
    const { category } = params
    const posts = await getCachedPosts()

    const normalizedCategory = category.toLowerCase().replace(/_/g, ' ').trim()

    const filteredPosts = posts.filter((post: postType) => {
        if (category === 'all') return true
        const raw = post.category || ''
        try {
            if (raw.trim().startsWith('[')) {
                const parsed = JSON.parse(raw)
                return Array.isArray(parsed) &&
                    parsed.some((cat) => cat.toLowerCase().includes(normalizedCategory))
            } else {
                return raw.toLowerCase().includes(normalizedCategory)
            }
        } catch {
            return false
        }
    })

    return <Blog posts={filteredPosts} category={category} />
}