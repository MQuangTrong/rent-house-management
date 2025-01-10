import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { path } from '../../ultils/constant';
import { apiVerifyEmail } from '../../services/verifyEmail';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            verifyEmail(token);
        } else {
            setError('Liên kết không hợp lệ.');
            setLoading(false);
        }
    }, [location]);

    const verifyEmail = async (token) => {
        try {
            const response = await apiVerifyEmail(token);
            toast.success(response.data.msg);
            setTimeout(() => {
                navigate(`/${path.LOGIN}`);
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.msg || 'Có lỗi xảy ra.');
        }
        setLoading(false);
    };

    return (
        <div className="verify-email-container h-screen">
            {loading ? (
                <p>Đang xác thực...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div className='mt-20'>
                    <p className='text-center text-3xl font-bold'>Chào mừng bạn đến với hệ thống cho thuê phòng trọ sinh viên Đà Nẵng</p>
                    <p className='text-center text-base'>Xin chúc mừng! Bạn đã xác thực thành công! Bạn sẽ được chuyển đến trang đăng nhập trong giây lát.</p>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
