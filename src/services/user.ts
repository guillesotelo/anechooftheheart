import axios from 'axios';
import { dataObj, userType } from '../app/types';
import { retryWithDelay } from '../helpers';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const getHeaders = (user: dataObj) => {
    return { authorization: `Bearer ${user.token}` }
}
const getConfig = (user: dataObj) => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const loginUser = async (data: userType) => {
    try {
        const user = await axios.post(`${API_URL}/api/user/login`, data, { withCredentials: true })
        const localUser = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({
            ...localUser,
            ...user.data
        }))
        return user.data
    } catch (err) { console.error(err) }
}

const verifyToken = async (user: dataObj) => {
    try {
        const verify = await axios.post(`${API_URL}/api/user/verify`, {}, { withCredentials: true, headers: getHeaders(user) })
        return verify.data || false
    } catch (err) { return false }
}

const registerUser = async (data: userType) => {
    try {
        const newUser = await axios.post(`${API_URL}/api/user/create`, data, { withCredentials: true })
        return newUser.data
    } catch (err) { console.error(err) }
}

const updateUser = async (data: userType, user: dataObj) => {
    try {
        const udpated = await axios.post(`${API_URL}/api/user/update`, data, { withCredentials: true, params: { token: user.token } })
        const localUser = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({
            ...localUser,
            ...udpated.data
        }))
        return udpated.data
    } catch (err) { console.error(err) }
}

const logOut = async () => {
    try {
        const loggedOut = await axios.post(`${API_URL}/api/user/logout`, {}, { withCredentials: true })
        return loggedOut.data
    } catch (err) { return false }
}


export {
    loginUser,
    verifyToken,
    registerUser,
    updateUser,
    logOut
}