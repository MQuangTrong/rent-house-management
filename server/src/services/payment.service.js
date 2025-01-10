import axios from 'axios';
import crypto from 'crypto';
import { VNPAY_CONFIG } from '../config/payment';
import querystring from 'qs';

function formatDateTimeToYYYYMMDDHHMMSS(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Thêm 1 vì tháng bắt đầu từ 0
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return year + month + day + hours + minutes + seconds;
}
function formatTimeToHHMMSS(date) {
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    return hours + minutes + seconds;
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export const createPaymentRequestService = (orderData, req) => new Promise((resolve, reject) => {
    var date = new Date();
    var createDate = formatDateTimeToYYYYMMDDHHMMSS(date)
    var orderId = formatTimeToHHMMSS(date);
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    ipAddr = ipAddr === '::1' ? '127.0.0.1' : ipAddr;
    var totalAmount = orderData.totalAmount;
    var bankCode = "NCB";
    var tmnCode = VNPAY_CONFIG.TMN_CODE
    var secretKey = VNPAY_CONFIG.SECRET_KEY
    var vnpUrl = VNPAY_CONFIG.VNPAY_URL
    var returnUrl = VNPAY_CONFIG.RETURN_URL


    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_TmnCode: tmnCode,
        vnp_Amount: totalAmount * 100,
        vnp_Command: 'pay',
        vnp_CreateDate: new Date().toISOString().replace(/[-T:.]/g, '').slice(0, 14),
        vnp_CurrCode: 'VND',
        vnp_IpAddr: ipAddr,
        vnp_Locale: 'vn',
        vnp_OrderInfo: `Thanh toan don hang`,
        vnp_OrderType: 'billpayment',
        vnp_ReturnUrl: returnUrl,
        vnp_TxnRef: orderId,
        vnp_CreateDate: createDate
    };

    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }


    // Sắp xếp tham số và tạo chữ ký
    vnp_Params = sortObject(vnp_Params);


    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    // let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    try {
        resolve({
            err: 0,
            msg: "Tạo yêu cầu thanh toán thành công.",
            vnpUrl
        });
    } catch (error) {
        console.error("Error in createPaymentRequestService: ", error);
        reject({
            err: 1,
            msg: "Có lỗi xảy ra khi tạo yêu cầu thanh toán.",
            error: error.message || error
        });
    }
});

// export const verifyVnpaySignature = (vnp_Params) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const secureHash = vnp_Params['vnp_SecureHash']; // Lấy SecureHash
//             delete vnp_Params['vnp_SecureHash']; // Loại bỏ SecureHash để kiểm tra chữ ký
//             delete vnp_Params['vnp_SecureHashType'];

//             // Sắp xếp lại tham số
//             const sortedParams = sortObject(vnp_Params);

//             // Tạo lại chữ ký
//             const signData = querystring.stringify(sortedParams, { encode: false });
//             const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.SECRET_KEY);
//             const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//             if (secureHash === signed) {
//                 const responseCode = vnp_Params['vnp_ResponseCode'];
//                 const status = responseCode === '00' ? 'success' : 'fail';
//                 resolve({ status, data: vnp_Params });
//             } else {
//                 resolve({ status: 'invalid', data: null });
//             }
//         } catch (error) {
//             reject(error);
//         }
//     });
// };
