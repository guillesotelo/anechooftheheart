import axios from 'axios';
import { dataObj, postType } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const getHeaders = (user: dataObj) => {
    return { authorization: `Bearer ${user.token}` }
}
const getConfig = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getConfigPost = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` }, 'Content-Type': 'multipart/form-data' }
}

const getAllPosts = async (params: dataObj) => {
    try {
        const posts = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getAll`, { params }), 5, 100)
        return posts.data
    } catch (err) { console.log(err) }
}

const getPostById = async (_id: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getById`, { params: { _id } }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const getPostBySlug = async (slug: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getBySlug`, { params: { slug } }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const getContentBySlug = async (slug: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getContentBySlug`, { params: { slug } }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const getMetadataBySlug = async (slug: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getMetadataBySlug`, { params: { slug } }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const getPostIdBySlug = async (slug: string) => {
    try {
        const post = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getIdBySlug`, { params: { slug } }), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const createPost = async (data: FormData, user: dataObj) => {
    try {
        const post = await retryWithDelay(() => axios.post(`${API_URL}/api/post/create`, data, getConfigPost(user)), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const updatePost = async (data: FormData, user: dataObj) => {
    try {
        const post = await retryWithDelay(() => axios.post(`${API_URL}/api/post/update`, data, getConfigPost(user)), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const deletePost = async (data: postType, user: dataObj) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/post/remove`, data, getConfig(user)), 5, 100)
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllPosts,
    createPost,
    getPostById,
    getPostBySlug,
    getPostIdBySlug,
    getContentBySlug,
    getMetadataBySlug,
    updatePost,
    deletePost
}