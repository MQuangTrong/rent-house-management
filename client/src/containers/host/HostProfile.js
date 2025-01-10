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

const HostProfile = () => {

    const dispatch = useDispatch()
    const { currentData } = useSelector(state => state.user);

    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayLoad] = useState({
        hoTen: currentData?.hoTen || '',
        email: currentData?.email || '',
        SDT: currentData?.SDT || '',
        anh: currentData?.anh || anonAvatar,
        CCCD: currentData?.CCCD || '',
        gioiTinh: currentData?.gioiTinh ? "Nu" : "Nam" || 'Nam',
        anhCCCDMatTruoc: currentData?.anhCCCDMatTruoc || null,
        anhCCCDMatSau: currentData?.anhCCCDMatSau || null,
        tenNganHang: currentData?.tenNganHang || '',
        soTaiKhoanNganHang: currentData?.soTaiKhoanNganHang || ''
    })

    

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields)
        if (invalids === 0)
            try {
                const response = await services.apiUpdateHostProfile(payload);
                console.log(payload);
                console.log(response);
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

    const handleCCCDMatTruocChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('anhCCCDMatTruoc', file);

            try {
                const response = await services.apiUploadImageCCCD(formData);
                if (response.data.err === 0) {
                    const uploadedFilePath = response.data.filePath;
                    setPayLoad((prevState) => ({
                        ...prevState,
                        anhCCCDMatTruoc: uploadedFilePath,
                    }))
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi upload ảnh.');
            }
        }
    }

    const handleCCCDMatSauChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('anhCCCDMatSau', file);

            try {
                const response = await services.apiUploadImageCCCDBack(formData);
                if (response.data.err === 0) {
                    const uploadedFilePath = response.data.filePath;
                    setPayLoad((prevState) => ({
                        ...prevState,
                        anhCCCDMatSau: uploadedFilePath,
                    }))
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi upload ảnh.');
            }
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-secondary2">Thông tin cá nhân</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-3/4 lg:w-3/4 mx-auto">
                <div className="flex flex-col gap-6">
                    {/* Ảnh đại diện */}
                    <div className="w-full mb-6 text-left">
                        <span className="text-lg font-semibold text-secondary2">Ảnh đại diện</span>
                    </div>

                    <div className="relative mb-6 flex m-auto w-40 h-40">
                        <img
                            src={`${process.env.REACT_APP_SERVER_URL}${payload.anh}`}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                        />
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

                    {/* Các trường thông tin chia thành 2 cột */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <FormInput
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                label={'Số điện thoại'}
                                value={payload.SDT}
                                setValue={setPayLoad}
                                keyName="SDT"
                                type="text"
                                readOnly={false}
                            />

                            <FormInput
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                label={'Tên người dùng'}
                                value={payload.hoTen}
                                setValue={setPayLoad}
                                keyName="hoTen"
                                type="text"
                                readOnly={false}
                            />
                            <FormInput
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                label={'Tên ngân hàng'}
                                value={payload.tenNganHang}
                                setValue={setPayLoad}
                                keyName="tenNganHang"
                                type="text"
                            />

                            <div>
                                <label className="block text-secondary2 font-medium mb-2">Giới tính</label>
                                <div className="flex gap-10">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gioiTinh"
                                            value="Nam"
                                            checked={payload.gioiTinh === "Nam"} // Kiểm tra giá trị payload
                                            onChange={() => setPayLoad(prevState => ({ ...prevState, gioiTinh: "Nam" }))} // Cập nhật trạng thái
                                        />
                                        <span className="ml-2">Nam</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gioiTinh"
                                            value="Nu"
                                            checked={payload.gioiTinh === "Nu"} // Kiểm tra giá trị payload
                                            onChange={() => setPayLoad(prevState => ({ ...prevState, gioiTinh: "Nu" }))} // Cập nhật trạng thái
                                        />
                                        <span className="ml-2">Nữ</span>
                                    </label>
                                </div>
                            </div>


                        </div>

                        <div>
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
                            <FaLock className="absolute right-52 transform -translate-y-8  text-gray-400" />

                            <FormInput
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                label={'Căn cước công dân'}
                                value={payload.CCCD}
                                setValue={setPayLoad}
                                keyName={'CCCD'}
                                type="text"
                            />

                            <FormInput
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                label={'Số tài khoản ngân hàng'}
                                value={payload.soTaiKhoanNganHang}
                                setValue={setPayLoad}
                                keyName="soTaiKhoanNganHang"
                                type="text"
                            />

                        </div>
                    </div>

                    {/* Ảnh CCCD Mặt Trước và Mặt Sau */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Ảnh CCCD Mặt Trước */}
                        <div className="flex flex-col gap-2">
                            <div className="w-full mb-4 text-left">
                                <span className="block text-secondary2 font-medium mb-2">Ảnh CCCD Mặt Trước</span>
                            </div>
                            <div className="relative mb-4 flex m-auto w-full pr-16">
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${payload.anhCCCDMatTruoc}` || null}
                                    alt="CCCD Mặt Trước"
                                    className="w-full h-60 object-cover rounded-md border-2 border-gray-300"
                                />
                                <label className="absolute bottom-0 right-16 bg-yellow-400 rounded-full p-4 cursor-pointer">
                                    <FaCamera className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCCCDMatTruocChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Ảnh CCCD Mặt Sau */}
                        <div className="flex flex-col gap-2">
                            <div className="w-full mb-4 text-left">
                                <span className="block text-secondary2 font-medium mb-2">Ảnh CCCD Mặt Sau</span>
                            </div>
                            <div className="relative mb-4 flex m-auto w-full pr-16">
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${payload.anhCCCDMatSau}`}
                                    alt="CCCD Mặt Sau"
                                    className="w-full h-60 object-cover rounded-md border-2 border-gray-300"
                                />
                                <label className="absolute bottom-0 right-16 bg-yellow-400 rounded-full p-4 cursor-pointer">
                                    <FaCamera className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCCCDMatSauChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
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

export default HostProfile;
