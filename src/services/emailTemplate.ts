import axios from 'axios';
import { templateType } from '../types';
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

const getAllTemplates = async (isAdmin?: boolean) => {
    try {
        const templates = await retryWithDelay(() => axios.get(`${API_URL}/api/template/getAll`, { params: { isAdmin }, headers: getHeaders() }), 5, 100)
        return templates.data
    } catch (err) { console.log(err) }
}

const getTemplateById = async (_id: string) => {
    try {
        const template = await retryWithDelay(() => axios.get(`${API_URL}/api/template/getById`, { params: { _id }, headers: getHeaders() }), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const createTemplate = async (data: templateType) => {
    try {
        const template = await retryWithDelay(() => axios.post(`${API_URL}/api/template/create`, data, getConfig()), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const updateTemplate = async (data: templateType) => {
    try {
        const template = await retryWithDelay(() => axios.post(`${API_URL}/api/template/update`, data, getConfig()), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const deleteTemplate = async (data: templateType) => {
    try {
        const deleted = await retryWithDelay(() => axios.post(`${API_URL}/api/template/remove`, data, getConfig()), 5, 100)
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