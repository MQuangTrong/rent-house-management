import db from '../models'
import { sequelize } from '../models'
export const getAllBlogService = () => new Promise(async (resolve, reject) => {
    try {
        const blogs = await db.BaiViet.findAll({
            where: {
                daXoa: false,
            },
        })

        const result = blogs.map(blog => ({
            id: blog.id,
            tieuDe: blog.tieuDe,
            anh: blog.anh,
            noiDung: blog.noiDung
        }))
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getBlogLastedService = () => new Promise(async (resolve, reject) => {
    try {
        const blogs = await db.BaiViet.findAll({
            where: {
                daXoa: false,
            },
            order: [['id', 'DESC']],
        })

        const result = blogs.map(blog => ({
            id: blog.id,
            tieuDe: blog.tieuDe,
            anh: blog.anh,
            noiDung: blog.noiDung
        }))
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getBlogDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.BaiViet.findOne({
            where: {
                daXoa: false,
                id
            },
        })

        const blog = {
            id: response.id,
            tieuDe: response.tieuDe,
            anh: response.anh,
            noiDung: response.noiDung
        }
        resolve({
            err: 0,
            msg: 'OK',
            blog
        });
    } catch (error) {
        reject(error)
    }
})

export const getAllBlogDeletedService = () => new Promise(async (resolve, reject) => {
    try {
        const blogs = await db.BaiViet.findAll({
            where: {
                daXoa: true,
            },
        })

        const result = blogs.map(blog => ({
            id: blog.id,
            tieuDe: blog.tieuDe,
            anh: blog.anh,
            noiDung: blog.noiDung
        }))
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const createBlogService = (body, id) => new Promise(async (resolve, reject) => {
    try {
        const newBlog = await db.BaiViet.create({
            tieuDe: body.tieuDe,
            anh: body.anh,
            noiDung: body.noiDung,
            maNguoiDung: id
        });

        resolve({
            err: 0,
            msg: 'Đã thêm mới bài viết thành công',
            newBlog
        });
    } catch (error) {
        reject(error)
    }
})

export const getBlogEditService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.BaiViet.findOne({
            where: { id },
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'Bài viết không tồn tại',
            });
        }
        const blog = {
            tieuDe: response.tieuDe,
            anh: response.anh,
            noiDung: response.noiDung,
        }

        resolve({
            err: 0,
            msg: 'OK',
            blog
        });
    } catch (error) {
        reject(error)
    }
})

export const editBlogService = (id, body) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.BaiViet.findOne({
            where: { id },
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'Bài viết không tồn tại',
            });
        } else {
            await db.BaiViet.update({
                tieuDe: body.tieuDe,
                anh: body.anh,
                noiDung: body.noiDung,
            }, { where: { id } })
        }

        resolve({
            err: 0,
            msg: 'Đã cập nhật thành công',
            response
        });
    } catch (error) {
        reject(error)
    }
})

export const deleteBlogService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.BaiViet.findOne({
            where: { id },
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'Bài viết không tồn tại',
            });
        } else {
            await db.BaiViet.update({
                daXoa: true
            }, { where: { id } })
        }

        resolve({
            err: 0,
            msg: 'Đã xóa bài viết thành công',
        });
    } catch (error) {
        reject(error)
    }
})

export const recoverBlogService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.BaiViet.findOne({
            where: { id },
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'Bài viết không tồn tại',
            });
        } else {
            await db.BaiViet.update({
                daXoa: false,
            }, { where: { id } })
        }

        resolve({
            err: 0,
            msg: 'Đã khôi phục bài viết thành công',
        });
    } catch (error) {
        reject(error)
    }
})