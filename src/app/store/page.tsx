import { Metadata } from 'next'
import Store from './Store'
import { cache } from 'react'
import { getAllProducts } from 'src/services/product'

const getCachedProducts = cache(async () => {
    const products = await getAllProducts({ isAdmin: true })
    return products || []
})

export async function generateMetadata(): Promise<Metadata> {
    const title = `An Echo of The Heart - Store`
    const description = 'I specialize in boho-inspired floral designs, created with care, creativity, and a love for natural beauty. In addition to my original floral pieces, I source unique, artisan-made bohemian jewelry that flows seamlessly with the aesthetic—earthy and free-spirited.'
    const image = '/assets/images/bespoken-contact.jpg'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image || '' }],
            url: `https://anechooftheheart.com/store`,
            type: 'website',
        },
    }
}

export default async function ProductPage() {
    const products = await getCachedProducts()

    return <Store products={products || []} />
}
