import React, { useState } from 'react';
import { Button, FormInput } from '../../components';
import { validate } from '../../validates/validate';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as services from '../../services/auth'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom'; // Hook để lấy tham số URL
import { path } from '../../ultils/constant'

const ResetPassword = () => {

    const navigate = useNavigate()
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayLoad] = useState({
        matKhauMoi: '',
        xacNhanMatKhauMoi: '',
    });

    // Lấy token từ URL (sử dụng hook useParams nếu token là tham số trong URL)
    const { token } = useParams();

    // Các state để theo dõi xem mật khẩu có hiển thị hay không
    const [showMatKhauMoi, setShowMatKhauMoi] = useState(false);
    const [showXacNhanMatKhauMoi, setShowXacNhanMatKhauMoi] = useState(false);

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            try {
                const response = await services.apiResetPassword(payload, token);
                if (response.data.msg.includes("Đặt lại mật khẩu thành công")) {
                    toast.success(response.data.msg)
                    setTimeout(() => {
                        navigate(`/${path.LOGIN}`)
                    })

                } else {
                    toast.error(response.data.msg);
                }
            } catch (error) {
                toast.success('Đặt lại mật khẩu thất bại');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-secondary2">Đặt lại mật khẩu</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-1/2 mx-auto">
                <div className="flex flex-col gap-4">

                    <div className="relative">
                        <FormInput
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            label="Mật khẩu mới"
                            value={payload.matKhauMoi}
                            setValue={setPayLoad}
                            keyName="matKhauMoi"
                            type={showMatKhauMoi ? "text" : "password"}
                        />

                        <span
                            onClick={() => setShowMatKhauMoi(!showMatKhauMoi)}
                            className="absolute right-3 top-12 cursor-pointer"
                        >
                            {showMatKhauMoi ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="relative">
                        <FormInput
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            label="Xác nhận mật khẩu mới"
                            value={payload.xacNhanMatKhauMoi}
                            setValue={setPayLoad}
                            keyName="xacNhanMatKhauMoi"
                            type={showXacNhanMatKhauMoi ? "text" : "password"}
                        />

                        <span
                            onClick={() => setShowXacNhanMatKhauMoi(!showXacNhanMatKhauMoi)}
                            className="absolute right-3 top-12 cursor-pointer"
                        >
                            {showXacNhanMatKhauMoi ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <Button
                        className="mt-8"
                        text="Đặt lại mật khẩu"
                        textColor="text-white"
                        bgColor="bg-secondary2"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
