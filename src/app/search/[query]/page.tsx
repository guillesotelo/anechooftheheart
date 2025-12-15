import { Metadata } from 'next'
import Search from './Search'
import { cache } from 'react'
import { getAllPosts } from 'src/services/post'
import { postType } from 'src/app/types'

interface PostProps {
    params: { query: string }
}

const getCachedPosts = cache(async () => {
    const posts = (await getAllPosts({ isAdmin: true })).filter((p: postType) => !p.type || p.type === 'Post')
    return posts || []
})

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const { query } = params
    const title = `An Echo of The Heart - Search for: ${query}`
    const description = ''

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: '' }],
            url: `https://anechooftheheart.com/search/${query}`,
            type: 'website',
        },
    }
}

export default async function SearchPage({ params }: PostProps) {
    const { query } = params
    const posts = await getCachedPosts()

    return <Search posts={posts} query={query} />
}
