import axiosConfig from '../axiosConfig'

export const apiRegisterHost = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/host/register-host',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiHostPendingApprove = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/host/host-pending-approve',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiHostPendingApproveDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/host/host-pending-approve-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiApproveHost = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/host/approve-host/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiRejectHost = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/host/reject-host/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})