import axios from 'axios';
import { commentType } from '../types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.REACT_APP_API_URL
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
const authorization = `Bearer ${user.token}`

const getHeaders = () => {
    return { authorization }
}
const getConfig = () => {
    return { headers: { authorization } }
}

const getAllComments = async (isAdmin?: boolean) => {
    try {
        const comments = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getAll`, { params: { isAdmin }, headers: getHeaders() }), 5, 100)
        return comments.data
    } catch (err) { console.log(err) }
}

const getPostComments = async (postId: string) => {
    try {
        const comment = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getByPostId`, { params: { postId }, headers: getHeaders() }), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const getRepliesById = async (replyingTo: string) => {
    try {
        const comment = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getRepliesById`, { params: { replyingTo }, headers: getHeaders() }), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const getCommentById = async (_id: string) => {
    try {
        const comment = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getById`, { params: { _id }, headers: getHeaders() }), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const createComment = async (data: commentType) => {
    try {
        const comment = await retryWithDelay(() => axios.post(`${API_URL}/api/comment/create`, data, getConfig()), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const updateComment = async (data: commentType) => {
    try {
        const comment = await retryWithDelay(() => axios.post(`${API_URL}/api/comment/update`, data, getConfig()), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const deleteComment = async (data: commentType) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/comment/remove`, data, getConfig()), 5, 100)
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllComments,
    createComment,
    getPostComments,
    getRepliesById,
    getCommentById,
    updateComment,
    deleteComment
}