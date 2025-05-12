import axios from 'axios';
import { commentType, dataObj } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const getHeaders = (user: dataObj) => {
    return { authorization: `Bearer ${user.token}` }
}
const getConfig = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getAllComments = async (user: dataObj) => {
    try {
        const comments = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getAll`, { params: { isAdmin: user.isAdmin }, headers: getHeaders(user) }), 5, 100)
        return comments.data
    } catch (err) { console.log(err) }
}

const getPostComments = async (postId: string) => {
    try {
        const comment = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getByPostId`, { params: { postId } }), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const getRepliesById = async (replyingTo: string) => {
    try {
        const comment = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getRepliesById`, { params: { replyingTo } }), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const getCommentById = async (_id: string) => {
    try {
        const comment = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getById`, { params: { _id } }), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const createComment = async (data: commentType) => {
    try {
        const comment = await retryWithDelay(() => axios.post(`${API_URL}/api/comment/create`, data), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const updateComment = async (data: commentType, user: dataObj) => {
    try {
        const comment = await retryWithDelay(() => axios.post(`${API_URL}/api/comment/update`, data, getConfig(user)), 5, 100)
        return comment.data
    } catch (err) { console.log(err) }
}

const deleteComment = async (data: commentType, user: dataObj) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/comment/remove`, data, getConfig(user)), 5, 100)
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