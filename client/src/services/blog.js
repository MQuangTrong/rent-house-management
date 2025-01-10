import axiosConfig from '../axiosConfig'

export const apiGetAllBlog = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/blog/get-all-blog',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetBlogLasted = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/blog/get-blog-lasted',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetBlogDetail = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/blog/get-blog-detail/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetBlogDeleted = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/blog/get-all-blog-deleted',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiDeleteBlog = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/blog/delete-blog/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiRecoverBlog = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/blog/recover-blog/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiCreateBlog = (formData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/blog/create-blog`,
            data: formData
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetEditBlog = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/blog/get-blog-edit/${id}`,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiEditBlog = (id, blog) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'patch',
            url: `/api/v1/blog/edit-blog/${id}`,
            data: blog
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})