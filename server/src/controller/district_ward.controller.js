import * as services from '../services/district_ward.service'

export const getDistrict = async (req, res) => {
    try {
        const response = await services.getDistrictService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at district controller: ' + error
        })
    }
}

export const getWard = async (req, res) => {
    const {districtId} = req.params
    try {
        const response = await services.getWardService(districtId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at district controller: ' + error
        })
    }
}