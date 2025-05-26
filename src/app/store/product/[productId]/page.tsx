import { Metadata } from 'next'
import Product from './Product'
import { cache } from 'react'
import { productType } from 'src/app/types'
import { getAllProducts, getProductById } from 'src/services/product'

interface ProductProps {
    params: { productId: string }
}

const getCachedProducts = cache(async () => {
    const products = await getAllProducts({ isAdmin: true })
    return products || []
})

const getCachedProduct = cache(async (id: string) => {
    const product = await getProductById(id)
    return product || {}
})

export async function generateStaticParams() {
    const products = await getCachedProducts()
    return products.map((product: productType) => ({
        productId: product._id
    }))
}

const getById = (id: string, products: productType[]) => products.find((p: productType) => p._id === id) || {}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
    const { productId } = params
    const products = await getCachedProducts()
    const product = getById(productId, products)
    const title = `${product.title}`
    const description = product.description
    const image = product.previewImage || 'https://www.anechooftheheart.com/static/media/landing-1.c9e189a7c1b0d856d4aa.jpg'

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
    const product = getById(productId, products)
    const productWithImages = product._id ? getCachedProduct(product._id) : {}

    return <Product product={productWithImages} />
}
