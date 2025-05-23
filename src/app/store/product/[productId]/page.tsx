import { Metadata } from 'next'
import Product from './Product'
import { cache } from 'react'
import { productType } from 'src/app/types'
import { getAllProducts } from 'src/services/product'

interface ProductProps {
    params: { productId: string }
}

const getCachedProducts = cache(async () => {
    const products = await getAllProducts({ isAdmin: true })
    return products || []
})

// ISR
export const revalidate = 3600

export async function generateStaticParams() {
    const products = await getCachedProducts()
    return products.map((product: productType) => ({
        productId: product._id
    }))
}

const getProductById = (id: string, products: productType[]) => products.find((p: productType) => p._id === id) || {}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
    const { productId } = params
    const products = await getCachedProducts()
    const product = getProductById(productId, products)
    const title = `${product.title}`
    const description = product.description
    const image = JSON.parse(product.images || '[]')[0] || 'https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg'

    if (product && product.title) {
        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [{ url: image || '' }],
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
    const products = await getCachedProducts()
    const product = getProductById(productId, products)

    return <Product product={product} />
}
