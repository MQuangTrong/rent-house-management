import axiosConfig from '../axiosConfig'

export const apiRegister = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/auth/register',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/auth/login',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiForgotPassword = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/auth/forgot-password',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiResetPassword = (payload, token) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/auth/reset-password/${token}`,
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiVerifyResetPassword = (token) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/auth/reset-password/${token}`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});