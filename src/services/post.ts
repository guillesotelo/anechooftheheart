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

const getAllPosts = async (user: dataObj) => {
    try {
        const posts = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getAll`, { params: { ...user } }), 5, 100)
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

const createPost = async (data: postType, user: dataObj) => {
    try {
        const post = await retryWithDelay(() => axios.post(`${API_URL}/api/post/create`, data, getConfig(user)), 5, 100)
        return post.data
    } catch (err) { console.log(err) }
}

const updatePost = async (data: postType, user: dataObj) => {
    try {
        const post = await retryWithDelay(() => axios.post(`${API_URL}/api/post/update`, data, getConfig(user)), 5, 100)
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
    updatePost,
    deletePost
}