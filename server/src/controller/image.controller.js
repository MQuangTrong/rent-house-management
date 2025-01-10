import * as services from '../services/image.service'

export const uploadImage = async (req, res) => {
    try {
        const response = await services.uploadImageService(req.file)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at image controller: ' + error
        })
    }

}

export const uploadImages = async (req, res) => {
    try {
        // Kiểm tra xem có ảnh nào được tải lên không
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                err: -1,
                msg: 'No files uploaded'
            });
        }
        const response = await services.uploadImagesService(req.files);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at image controller: ' + error
        });
    }
};