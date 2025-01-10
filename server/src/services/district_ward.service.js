import db from '../models'

export const getDistrictService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Quan.findAll({
            raw: true
        });
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get district',
            response
        });
    } catch (error) {
        reject(error)
    }
})

export const getWardService = (districtId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Phuong.findAll({
            where: { maQuan: districtId }, 
            raw: true
        });

        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get ward',
            response
        });
    } catch (error) {
        reject(error)
    }
})