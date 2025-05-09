import { Metadata } from 'next'
import Home from './home/Home'
import { cache } from 'react'
import { getAllPosts } from 'src/services/post'
import { getAllProducts } from 'src/services/product'
import { verifyToken } from 'src/services/user'
import { getUser } from 'src/helpers'

const title = 'An Echo of The Heart'
const description = 'An Echo of the Heart, by Daniela Garcia, is a reflective blog on motherhood, creativity, living abroad, and intentional living—alongside BESPOKEN, offering inspired floral designs, artisan gifts and handcrafted adornments.'

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://anechooftheheart.com' : 'http://localhost:3000'),
    title,
    description,
    authors: [{ name: 'Guillermo Sotelo', url: 'https://www.linkedin.com/in/guillermosotelo/' }],
    openGraph: {
        title,
        description,
        images: ['https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg'],
        url: 'https://anechooftheheart.com',
        type: 'website',
    },
    twitter: {
    },
}

const getCachedData = cache(async () => {
    const posts = await getAllPosts(true)
    const products = await getAllProducts()
    return { posts, products }
})


const HomePage = async () => {
    const data = await getCachedData()

    return <Home data={data} />
}

export default HomePage
