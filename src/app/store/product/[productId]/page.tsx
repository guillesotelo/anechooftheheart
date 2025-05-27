import { Metadata } from 'next'
import Product from './Product'
import { cache } from 'react'
import { getMetadataById, getProductById } from 'src/services/product'

interface ProductProps {
    params: { productId: string }
}

const getCachedProductMetadata = cache(async (id: string) => {
    const product = await getMetadataById(id)
    return product || {}
})

const getCachedProduct = cache(async (id: string) => {
    const product = await getProductById(id)
    return product || {}
})

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
    const { productId } = params
    const product = await getCachedProductMetadata(productId)
    const title = `${product.title}`
    const description = product.description

    if (product && product.title) {
        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [{ url: product.previewImage || 'https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg' }],
                url: `https://anechooftheheart.com/store/product/${productId}`,
                type: 'website',
            },
        }
    }

    return {
        title: 'Product Not Found'
    }
}

export default async function ProductPage({ params }: ProductProps) {
    const { productId } = params
    const product = await getCachedProduct(productId)

    return <Product product={product} />
}
