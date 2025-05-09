import axios from 'axios';
import { postType } from '../types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.REACT_APP_API_URL

const getHeaders = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { authorization: `Bearer ${token}` }
}
const getConfig = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { headers: { authorization: `Bearer ${token}` } }
}

const getAllPosts = async (isAdmin?: boolean) => {
    try {
        const posts = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getAll`, { params: { isAdmin }, headers: getHeaders() }), 5, 100)
        return posts.data
    } catch (err) { console.log(err) }
}

const getPostById = async (_id: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getById`, { params: { _id }, headers: getHeaders() }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const getPostBySlug = async (slug: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getBySlug`, { params: { slug }, headers: getHeaders() }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const createPost = async (data: postType) => {
    try {
        const post = await retryWithDelay(() => axios.post(`${API_URL}/api/post/create`, data, getConfig()), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const updatePost = async (data: postType) => {
    try {
        const post = await retryWithDelay(() => axios.post(`${API_URL}/api/post/update`, data, getConfig()), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const deletePost = async (data: postType) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/post/remove`, data, getConfig()), 5, 100)
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllPosts,
    createPost,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost
}