import { createPaymentRequestService, verifyVnpaySignature } from '../services/payment.service';

export const createPaymentRequest = async (req, res) => {
    try {
        const response = await createPaymentRequestService(
            req.body, req
        );
        res.status(200).json(response); // Trả về URL thanh toán
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'fail at payment controller: ' + error
        })
    }
};


// export const handleVnpayReturn = async (req, res) => {
//     try {
//         const vnp_Params = req.query; // Lấy tham số từ URL trả về

//         if (!vnp_Params || !vnp_Params['vnp_Amount'] || !vnp_Params['vnp_TxnRef']) {
//             return res.status(400).json({
//                 err: -1,
//                 msg: 'Thiếu tham số quan trọng trong yêu cầu thanh toán.',
//             });
//         }

//         const { status, data } = await verifyVnpaySignature(vnp_Params); // Kiểm tra chữ ký

//         const amount = data['vnp_Amount'];
//         const orderId = data['vnp_TxnRef'];

//         if (!amount || !orderId) {
//             return res.status(400).json({
//                 err: -1,
//                 msg: 'Thông tin thanh toán không đầy đủ.',
//             });
//         }

//         const responseCode = data['vnp_ResponseCode']; // Mã phản hồi từ VNPAY

//         // Trả kết quả lại cho frontend mà không redirect
//         res.status(200).json({
//             status: status, // Trả về trạng thái thanh toán
//             amount: amount, // Trả về số tiền
//             orderId: orderId, // Trả về mã đơn hàng
//             responseCode: responseCode // Trả về mã phản hồi VNPAY
//         });
//     } catch (error) {
//         console.error('Error in handleVnpayReturn:', error);
//         res.status(500).json({
//             err: -1,
//             msg: 'Có lỗi xảy ra khi xử lý kết quả thanh toán.'
//         });
//     }
// };




