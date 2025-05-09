import axios from 'axios';
import { productType } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const getHeaders = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { authorization: `Bearer ${token}` }
}
const getConfig = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { headers: { authorization: `Bearer ${token}` } }
}

const getAllProducts = async (isAdmin?: boolean) => {
    try {
        const products = await retryWithDelay(() => axios.get(`${API_URL}/api/product/getAll`, { params: { isAdmin }, headers: getHeaders() }), 5, 100)
        return products.data
    } catch (err) { console.log(err) }
}

const getProductById = async (_id: string) => {
    try {
        const product = await retryWithDelay(() => axios.get(`${API_URL}/api/product/getById`, { params: { _id }, headers: getHeaders() }), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const getProductBySlug = async (slug: string) => {
    try {
        const product = await retryWithDelay(() => axios.get(`${API_URL}/api/product/getBySlug`, { params: { slug }, headers: getHeaders() }), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const createProduct = async (data: productType) => {
    try {
        const product = await retryWithDelay(() => axios.post(`${API_URL}/api/product/create`, data, getConfig()), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const updateProduct = async (data: productType) => {
    try {
        const product = await retryWithDelay(() => axios.post(`${API_URL}/api/product/update`, data, getConfig()), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const deleteProduct = async (data: productType) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/product/remove`, data, getConfig()), 5, 100)
        return deleted.data
    } catch (err) { console.log(err) }
}

const updateProductOrder = async (products: productType[]) => {
    try {
        const updated = await axios.post(`${API_URL}/api/product/updateOrder`, { products }, getConfig())
        return updated.data
    } catch (err) { console.log(err) }
}

export {
    getAllProducts,
    createProduct,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    updateProductOrder
}