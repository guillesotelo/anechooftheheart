import axios from 'axios';
import { contactType, emailType, templateType } from '../types';
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

const getAllEmails = async (isAdmin?: boolean) => {
    try {
        const comments = await retryWithDelay(() => axios.get(`${API_URL}/api/app/getAllEmails`, { headers: getHeaders() }), 5, 100)
        return comments.data
    } catch (err) { console.log(err) }
}

const sendNotification = async (data: templateType) => {
    try {
        const email = await retryWithDelay(() => axios.post(`${API_URL}/api/app/sendNotification`, data, getConfig()), 5, 100)
        return email.data
    } catch (err) { console.log(err) }
}

const sendContactEmail = async (data: contactType) => {
    try {
        const email = await retryWithDelay(() => axios.post(`${API_URL}/api/app/sendContactEmail`, data, getConfig()), 5, 100)
        return email.data
    } catch (err) { console.log(err) }
}

const subscribe = async (data: emailType) => {
    try {
        const newEmail = await retryWithDelay(() => axios.post(`${API_URL}/api/app/subscribe`, data), 5, 100)
        return newEmail.data
    } catch (err) { console.log(err) }
}

const updateSubscription = async (data: emailType) => {
    try {
        const template = await retryWithDelay(() => axios.post(`${API_URL}/api/app/updateSubscription`, data, getConfig()), 5, 100)
        return template.data
    } catch (err) { console.log(err) }
}

const cancelSubscription = async (data: emailType) => {
    try {
        const canceled = await retryWithDelay(() => axios.post(`${API_URL}/api/app/cancelSubscription`, data), 5, 100)
        return canceled.data
    } catch (err) { console.log(err) }
}

const scrapeUrl = async (data: { url: string }) => {
    try {
        const scrape = await retryWithDelay(() => axios.post(`${API_URL}/api/app/scrape-url`, data, getConfig()), 5, 100)
        return scrape.data
    } catch (err) { console.log(err) }
}

const getScrappedImages = async (gallery: string) => {
    try {
        const iamges = await retryWithDelay(() => axios.get(`${API_URL}/api/app/getScrappedImages`, { params: { gallery }, headers: getHeaders() }), 5, 100)
        return iamges.data
    } catch (err) { console.log(err) }
}

export {
    sendContactEmail,
    sendNotification,
    getAllEmails,
    updateSubscription,
    scrapeUrl,
    subscribe,
    cancelSubscription,
    getScrappedImages
}