import React, { useState } from 'react';
import { Button, FormInput } from '../../components';
import { validate } from '../../validates/validate';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as services from '../../services/user'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordHost = () => {
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayLoad] = useState({
        matKhau: '',
        matKhauMoi: '',
        xacNhanMatKhauMoi: '',
    });

    // Các state để theo dõi xem mật khẩu có hiển thị hay không
    const [showMatKhau, setShowMatKhau] = useState(false);
    const [showMatKhauMoi, setShowMatKhauMoi] = useState(false);
    const [showXacNhanMatKhauMoi, setShowXacNhanMatKhauMoi] = useState(false);

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            try {
                const response = await services.apiChangePassword(payload);
                if (response.data.msg.includes("Đổi mật khẩu thành công")) {
                    toast.success(response.data.msg);
                    setPayLoad({
                        matKhau: '',
                        matKhauMoi: '',
                        xacNhanMatKhauMoi: '',
                    });
                } else {
                    toast.error(response.data.msg);
                }
                // Reset các ô input về giá trị rỗng
            } catch (error) {
                toast.success('Đổi mật khẩu thất bại');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-secondary2">Đổi mật khẩu</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-1/2 mx-auto">
                <div className="flex flex-col gap-4">
                    <div className="w-full mb-4 text-left">
                        <span className="text-lg font-semibold text-secondary2">Thông tin mật khẩu</span>
                    </div>

                    <div className="relative">
                        <FormInput
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            label="Mật khẩu cũ"
                            value={payload.matKhau}
                            setValue={setPayLoad}
                            keyName="matKhau"
                            type={showMatKhau ? "text" : "password"}
                        />
                        <span
                            onClick={() => setShowMatKhau(!showMatKhau)}
                            className="absolute right-3 top-12 cursor-pointer"
                        >
                            {showMatKhau ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Mật khẩu mới */}
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
                        text="Đổi mật khẩu"
                        textColor="text-white"
                        bgColor="bg-secondary2"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordHost;
