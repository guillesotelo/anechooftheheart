import axios from 'axios';
import { dataObj, templateType } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const getHeaders = (user: dataObj) => {
    return { authorization: `Bearer ${user.token}` }
}
const getConfig = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getAllTemplates = async (user: dataObj) => {
    try {
        const templates = await retryWithDelay(() => axios.get(`${API_URL}/api/template/getAll`, { params: { isAdmin: user.isAdmin }, headers: getHeaders(user) }), 5, 100)
        return templates.data
    } catch (err) { console.log(err) }
}

const getTemplateById = async (_id: string, user: dataObj) => {
    try {
        const template = await retryWithDelay(() => axios.get(`${API_URL}/api/template/getById`, { params: { _id }, headers: getHeaders(user) }), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const createTemplate = async (data: templateType, user: dataObj) => {
    try {
        const template = await retryWithDelay(() => axios.post(`${API_URL}/api/template/create`, data, getConfig(user)), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const updateTemplate = async (data: templateType, user: dataObj) => {
    try {
        const template = await retryWithDelay(() => axios.post(`${API_URL}/api/template/update`, data, getConfig(user)), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const deleteTemplate = async (data: templateType, user: dataObj) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/template/remove`, data, getConfig(user)), 5, 100)
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllTemplates,
    createTemplate,
    getTemplateById,
    updateTemplate,
    deleteTemplate
}