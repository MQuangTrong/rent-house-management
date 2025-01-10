import * as services from '../services/insert.service'

export const insertQuan = async (req, res) => {
    try {
        const response = await services.saveQuansToDB()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at insert controller: ' + error
        })
    }
}

export const insertPhuong = async (req, res) => {
    const {districtId} = req.params
    try {
        const response = await services.savePhuongsToDB(districtId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at insert controller: ' + error
        })
    }
}