import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import icon
import { Link } from 'react-router-dom';

const PaymentResult = () => {
    const location = useLocation();
    const [status, setStatus] = useState('');
    const [amount, setAmount] = useState('');
    const [orderId, setOrderId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState(true); // Hiển thị chi tiết (số tiền, mã đơn hàng)

    // Lấy các tham số từ URL (query params)
    const queryParams = new URLSearchParams(location.search);
    const resultStatus = queryParams.get('vnp_ResponseCode');
    const amountFromQuery = queryParams.get('vnp_Amount');
    const orderIdFromQuery = queryParams.get('vnp_TxnRef');

    useEffect(() => {
        if (!resultStatus || !amountFromQuery || !orderIdFromQuery) {
            setErrorMessage('Thiếu thông tin quan trọng từ kết quả thanh toán.');
            return;
        }

        // Set trạng thái thanh toán từ URL
        if (resultStatus === '00') {
            setStatus('Thanh toán thành công!');
        } else if (resultStatus === '99') {
            setStatus('Thanh toán thất bại!');
        } else if (resultStatus === 'invalid') {
            setStatus('Chữ ký không hợp lệ.');
        } else {
            setStatus('Hủy thanh toán');
        }

        // Ẩn thông tin số tiền và mã đơn hàng nếu thanh toán bị hủy
        if (resultStatus !== '00') {
            setShowDetails(false);
        }

        setAmount(amountFromQuery);
        setOrderId(orderIdFromQuery);
    }, [resultStatus, amountFromQuery, orderIdFromQuery]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-semibold text-center mb-4">{status}</h1>

                {/* Hiển thị dấu tích hoặc dấu X */}
                {resultStatus === '00' && <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />}
                {(resultStatus === '99' || resultStatus !== '00') && (
                    <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                )}

                {showDetails && (
                    <>
                        <p className="text-center text-gray-600">Số tiền: {amount / 100} VND</p>
                        <p className="text-center text-gray-600">Mã đơn hàng: {orderId}</p>
                    </>
                )}

                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                    >
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
