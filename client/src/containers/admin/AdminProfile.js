import React, { useState } from 'react';
import { Button, FormInput } from '../../components';
import anonAvatar from '../../assets/anon-avatar.png';
import { validate } from '../../validates/validate'
import { FaCamera, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as actions from '../../store/actions'
import * as services from '../../services'

const AdminProfile = () => {

    const dispatch = useDispatch()
    const { currentData } = useSelector(state => state.user);
    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayLoad] = useState({
        hoTen: currentData?.hoTen || '',
        email: currentData?.email || '',
        SDT: currentData?.SDT || '',
        anh: currentData?.anh || anonAvatar
    })

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields)
        if (invalids === 0)
            try {
                const response = await services.apiUpdateProfile(payload); // Gọi API để cập nhật thông tin
                dispatch(actions.getCurrent())
                if (response.data.msg.includes("Cập nhật thành công")) {
                    toast.success(response.data.msg);
                } else {
                    toast.error(response.data.msg);
                }
            } catch (error) {
                toast.error('Cập nhật thông tin thất bại');
            }
    }

    // Xử lý chọn ảnh mới
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('anh', file); // Gửi file qua API

            try {
                const response = await services.apiUploadImageProfile(formData); // Gọi API upload ảnh
                if (response.data.err === 0) {
                    const uploadedFilePath = response.data.filePath; // Lấy đường dẫn ảnh từ response
                    setPayLoad((prevState) => ({
                        ...prevState,
                        anh: uploadedFilePath, // Lưu đường dẫn ảnh vào payload
                    }))
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi upload ảnh.');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-secondary2">Thông tin cá nhân</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-1/2 mx-auto">
                <div className="flex flex-col gap-4">
                    <div className="w-full mb-4 text-left">
                        <span className="text-lg font-semibold text-secondary2">Ảnh đại diện</span>
                    </div>

                    <div className="relative mb-4 flex m-auto w-32">
                        <img
                            src={`${process.env.REACT_APP_SERVER_URL}${payload.anh}`}
                            alt="Avatar"
                            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                        />
                        {/* Nút để chọn ảnh */}
                        <label className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 cursor-pointer">
                            <FaCamera className="text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}  // Xử lý sự kiện chọn ảnh
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="relative">
                        <FormInput
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            label={'Email'}
                            value={payload.email}
                            setValue={setPayLoad}
                            keyName="email"
                            type="email"
                            readOnly={true}
                        />
                        {/* Icon Khóa */}
                        <FaLock className="absolute right-3 top-3/4 transform -translate-y-3/4 text-gray-400" />
                    </div>

                    {/* Nút Cập nhật */}
                    <Button
                        className='mt-8'
                        text="Cập nhật thông tin"
                        textColor="text-white"
                        bgColor="bg-secondary2"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
