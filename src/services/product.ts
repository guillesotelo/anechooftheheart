import axios from 'axios';
import { dataObj, productType } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const getHeaders = (user: dataObj) => {
    return { authorization: `Bearer ${user.token}` }
}
const getConfig = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getAllProducts = async (user: dataObj) => {
    try {
        const products = await retryWithDelay(() => axios.get(`${API_URL}/api/product/getAll`, { params: { isAdmin: user.isAdmin }, headers: getHeaders(user) }), 5, 100)
        return products.data
    } catch (err) { console.log(err) }
}

const getProductById = async (_id: string) => {
    try {
        const product = await retryWithDelay(() => axios.get(`${API_URL}/api/product/getById`, { params: { _id } }), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const getMetadataById = async (_id: string) => {
    try {
        const product = await retryWithDelay(() => axios.get(`${API_URL}/api/product/getMetadataById`, { params: { _id } }), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const createProduct = async (data: productType, user: dataObj) => {
    try {
        const product = await retryWithDelay(() => axios.post(`${API_URL}/api/product/create`, data, getConfig(user)), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const updateProduct = async (data: productType, user: dataObj) => {
    try {
        const product = await retryWithDelay(() => axios.post(`${API_URL}/api/product/update`, data, getConfig(user)), 5, 100)
        return product.data
    } catch (err) { console.log(err) }
}

const deleteProduct = async (data: productType, user: dataObj) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/product/remove`, data, getConfig(user)), 5, 100)
        return deleted.data
    } catch (err) { console.log(err) }
}

const updateProductOrder = async (products: productType[], user: dataObj) => {
    try {
        const updated = await axios.post(`${API_URL}/api/product/updateOrder`, { products }, getConfig(user))
        return updated.data
    } catch (err) { console.log(err) }
}

export {
    getAllProducts,
    createProduct,
    getProductById,
    getMetadataById,
    updateProduct,
    deleteProduct,
    updateProductOrder
}