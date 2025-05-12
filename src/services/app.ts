import axios from 'axios';
import { contactType, dataObj, emailType, templateType } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const getHeaders = (user: dataObj) => {
    return { authorization: `Bearer ${user.token}` }
}
const getConfig = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getAllEmails = async (user: dataObj) => {
    try {
        const emails = await retryWithDelay(() => axios.get(`${API_URL}/api/app/getEmails`, { headers: getHeaders(user) }), 5, 100)
        return emails.data
    } catch (err) { console.log(err) }
}

const sendNotification = async (data: templateType, user: dataObj) => {
    try {
        const email = await retryWithDelay(() => axios.post(`${API_URL}/api/app/sendNotification`, data, getConfig(user)), 5, 100)
        return email.data
    } catch (err) { console.log(err) }
}

const sendContactEmail = async (data: contactType) => {
    try {
        const email = await retryWithDelay(() => axios.post(`${API_URL}/api/app/sendContactEmail`, data), 5, 100)
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
        const template = await retryWithDelay(() => axios.post(`${API_URL}/api/app/updateSubscription`, data), 5, 100)
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
        const scrape = await retryWithDelay(() => axios.post(`${API_URL}/api/app/scrape-url`, data), 5, 100)
        return scrape.data
    } catch (err) { console.log(err) }
}

const getScrappedImages = async (gallery: string) => {
    try {
        const iamges = await retryWithDelay(() => axios.get(`${API_URL}/api/app/getScrappedImages`, { params: { gallery } }), 5, 100)
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