import axiosConfig from '../axiosConfig'; // Giả sử bạn đã cấu hình axios

export const apiCreatePDF = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/pdf/create-pdf',
            data,
            responseType: 'blob',
        });
        resolve(response.data);
    } catch (error) {
        reject({
            err: 1,
            msg: 'Lỗi khi gọi API tạo PDF',
            error: error.response ? error.response.data : error.message,
        });
    }
});