import * as blogService from '../services/blog.service'

export const getAllBlog = async (req, res) => {
    try {
        const response = await blogService.getAllBlogService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const getBlogLasted = async (req, res) => {
    try {
        const response = await blogService.getBlogLastedService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}


export const getBlogDetail = async (req, res) => {
    const { id } = req.params
    try {
        const response = await blogService.getBlogDetailService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const getAllBlogDeleted = async (req, res) => {
    try {
        const response = await blogService.getAllBlogDeletedService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const createBlog = async (req, res) => {
    const { id } = req.user.id
    try {
        const response = await blogService.createBlogService(req.body, id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const getBlogEdit = async (req, res) => {
    const { id } = req.params
    try {
        const response = await blogService.getBlogEditService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const editBlog = async (req, res) => {
    const { id } = req.params
    try {
        const response = await blogService.editBlogService(id, req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const deleteBlog = async (req, res) => {
    const { id } = req.params
    try {
        const response = await blogService.deleteBlogService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}

export const recoverBlog = async (req, res) => {
    const { id } = req.params
    try {
        const response = await blogService.recoverBlogService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at blog controller: ' + error
        })
    }
}
