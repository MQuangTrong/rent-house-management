import axiosConfig from '../axiosConfig'

export const apiDistrict = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/district-ward/district',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiWard = (districtId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/district-ward/ward/${districtId}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})