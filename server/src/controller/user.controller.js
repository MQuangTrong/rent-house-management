import * as services from '../services/user.service'

export const getCurrent = async (req, res) => {
    const id = req.user.id
    try {
        const response = await services.getOne(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }

}

export const updateProfile = async (req, res) => {
    const id = req.user.id
    try {
        const response = await services.updateProfileService(id, req.body, req.file)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }

}

export const updateHostProfile = async (req, res) => {
    const id = req.user.id
    try {
        const response = await services.updateHostProfileService(id, req.body, req.file)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }

}

export const changePassword = async (req, res) => {
    const id = req.user.id
    const { matKhau, matKhauMoi} = req.body;
    try {
        if (!matKhau || !matKhauMoi) {
            return res.status(400).json({
                err: -1,
                msg: 'Missing input'
            })
        }
        const response = await services.changePasswordService(id, req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }

}

export const getAll = async (req, res) => {
    const {search} = req.query || ''
    const {roleId} = req.query || ''
    try {
        const response = await services.getAllService(search, roleId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }
}

export const getAllLocked = async (req, res) => {
    const {search} = req.query || ''
    const {roleId} = req.query || ''
    try {
        const response = await services.getAllLockedService(search, roleId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }
}

export const lockUser = async (req, res) => {
    const {id} = req.params
    try {
        const response = await services.lockUserService(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }
}

export const unLockUser = async (req, res) => {
    const {id} = req.params
    try {
        const response = await services.unLockUserService(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }
}

export const getUserDetail = async (req, res) => {
    const {id} = req.params
    try {
        const response = await services.getUserDetailService(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at user controller: ' + error
        })
    }
}