import axiosConfig from '../axiosConfig';

export const apiVnpayPayment = (orderData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/payment/create-payment',  // Đây là endpoint API backend của bạn để xử lý thanh toán
            data: orderData,  // Dữ liệu yêu cầu thanh toán (ví dụ: thông tin đơn hàng, số tiền, ...)
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// export const apiVnpayReturn = (queryParams) => new Promise(async (resolve, reject) => {
//     try {
//         const response = await axiosConfig({
//             method: 'get',
//             url: '/api/v1/payment/vnpay-return',
//             params: queryParams,  // Tham số lấy từ URL (status, amount, orderId)
//         });
//         resolve(response);
//     } catch (error) {
//         reject(error);
//     }
// });
