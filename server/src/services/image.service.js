export const uploadImageService = (file) => new Promise(async (resolve, reject) => {
    try {
        const filePath = `/images/${file.filename}`;
        resolve({
            err: 0,
            msg: 'OK',
            filePath
        });
    } catch (error) {
        reject(error)
    }
})

export const uploadImagesService = (files) => new Promise(async (resolve, reject) => {
    try {
        // Tạo mảng chứa thông tin file paths
        const filePaths = files.map(file => `/images/${file.filename}`);

        resolve({
            err: 0,
            msg: 'OK',
            filePaths
        });
    } catch (error) {
        reject(error);
    }
});