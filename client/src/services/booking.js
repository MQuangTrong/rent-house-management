import axiosConfig from '../axiosConfig'

export const apiAddRoomToCart = (payload) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/booking/add-room-to-cart',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiCartDetail = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/booking/get-cart-detail',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiDeleteCartDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/booking/delete-cart-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiCreateBooking = (bookingData ) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/booking/create-booking`,
            data: bookingData
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetBookingpending = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/booking/get-booking-pending-approval`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetBookedRoom = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/booking/get-booked-room`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiApprovalBooking = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/booking/approval-booking/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiHistory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/booking/history`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiHistoryDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/booking/history-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiFinishlBooking = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/booking/finish-booking/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiBookingDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/booking/get-booking-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiBookedUserDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/booking/get-booked-user-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})