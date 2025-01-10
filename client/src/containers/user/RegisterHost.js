import React, { useState, useEffect } from "react";
import { Button, FormInput } from "../../components";
import { validate } from '../../validates/validate'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from 'react-icons/fa';
import * as services from '../../services'
import { useSelector } from 'react-redux'

const RegisterHost = () => {
    const { currentData } = useSelector(state => state.user);
    const [invalidFields, setInvalidFields] = useState([]);
    const [payload, setPayLoad] = useState({
        hoTen: currentData?.hoTen || '',
        email: currentData?.email || '',
        SDT: currentData?.SDT || '',
        CCCD: currentData?.CCCD || '',
        gioiTinh: currentData?.gioiTinh ? "Nu" : "Nam" || 'Nam',
        anhCCCDMatTruoc: currentData?.anhCCCDMatTruoc || null,
        anhCCCDMatSau: currentData?.anhCCCDMatTruoc || null,
        tenNganHang: currentData?.tenNganHang || '',
        soTaiKhoanNganHang: currentData?.soTaiKhoanNganHang || ''
    });
    const [isRegistered, setIsRegistered] = useState(false);

    const bankList = [
        "Ngân hàng Vietcombank",
        "Ngân hàng Techcombank",
        "Ngân hàng Agribank",
        "Ngân hàng BIDV",
        "Ngân hàng ACB",
        "Ngân hàng MB Bank",
        "Ngân hàng VietinBank",
        "Ngân hàng Sacombank"
    ];

    console.log(currentData);

    useEffect(() => {
        if (currentData?.maChuTro) {
            setIsRegistered(true);
            localStorage.setItem("isRegistered", "true");
        } else {
            setIsRegistered(false);
            localStorage.setItem("isRegistered", "false");
        }
    }, [currentData]);

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields)
        if (invalids === 0)
            try {
                const response = await services.apiRegisterHost(payload);
                if (response.data.msg.includes("Đăng ký thành công")) {
                    toast.success(response.data.msg);
                    setIsRegistered(true);
                    localStorage.setItem("isRegistered", "true");
                    window.scrollTo(0, 0);
                } else {
                    toast.error(response.data.msg);
                }
            } catch (error) {
                toast.error('Đăng ký thành công thất bại');
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
        <div className="bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm my-28">
            {isRegistered ? (
                <div className="text-center">
                    <h3 className="font-semibold text-2xl text-secondary2 mb-3">Đã đăng ký thành chủ phòng</h3>
                    <p className="text-secondary2">Vui lòng đợi Admin duyệt.</p>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-3">
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Email'}
                        value={payload.email}
                        setValue={setPayLoad}
                        keyName="email"
                        type="email"
                        className="disabled"
                        readOnly={true}
                    />
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Số điện thoại'}
                        value={payload.SDT}
                        setValue={setPayLoad}
                        keyName={'SDT'}
                        type="text"
                        readOnly={true}
                    />
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Họ và tên'}
                        value={payload.hoTen}
                        setValue={setPayLoad}
                        keyName={'hoTen'}
                        type="text"
                        readOnly={true}
                    />
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Căn cước công dân'}
                        value={payload.CCCD}
                        setValue={setPayLoad}
                        keyName={'CCCD'}
                        type="text"
                    />

                    {/* Select Tên Ngân Hàng */}
                    <div className="">
                        <label className="block text-secondary2 font-medium mb-2">Tên ngân hàng</label>
                        <select
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary2"
                            value={payload.tenNganHang}
                            onChange={(e) => setPayLoad(prevState => ({ ...prevState, tenNganHang: e.target.value }))}
                        >
                            <option value="">-- Chọn ngân hàng --</option>
                            {bankList.map((bank, index) => (
                                <option key={index} value={bank}>{bank}</option>
                            ))}
                        </select>
                    </div>

                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Số tài khoản ngân hàng'}
                        value={payload.soTaiKhoanNganHang}
                        setValue={setPayLoad}
                        keyName={'soTaiKhoanNganHang'}
                        type="text"
                    />

                    {/* Radio Button cho giới tính */}
                    <div className="">
                        <label className="block text-secondary2 font-medium mb-2">Giới tính</label>
                        <div className="flex gap-16">
                            <label className="flex items-center my-4">
                                <input
                                    type="radio"
                                    name="gioiTinh"
                                    value="Nam"
                                    checked={payload.gioiTinh === "Nam"}
                                    onChange={() => setPayLoad(prevState => ({ ...prevState, gioiTinh: "Nam" }))} />
                                <span className="ml-2">Nam</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="gioiTinh"
                                    value="Nu"
                                    checked={payload.gioiTinh === "Nu"}
                                    onChange={() => setPayLoad(prevState => ({ ...prevState, gioiTinh: "Nu" }))} />
                                <span className="ml-2">Nữ</span>
                            </label>
                        </div>
                    </div>

                    {/* Ảnh CCCD Mặt Trước */}
                    <div className="flex flex-col gap-2">
                        <div className="w-full mb-4 text-left">
                            <span className="block text-secondary2 font-medium mb-2">Ảnh CCCD Mặt Trước</span>
                        </div>
                        <div className="relative mb-4 flex m-auto w-full px-20">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${payload.anhCCCDMatTruoc}` || null}
                                alt="CCCD Mặt Trước"
                                className="w-full h-60 object-cover rounded-md border-2 border-gray-300"
                            />
                            <label className="absolute bottom-0 right-20 bg-yellow-400 rounded-full p-4 cursor-pointer">
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
                        <div className="relative mb-4 flex m-auto w-full px-20">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${payload.anhCCCDMatSau}` || null}
                                alt="CCCD Mặt Sau"
                                className="w-full h-60 object-cover rounded-md border-2 border-gray-300"
                            />
                            <label className="absolute bottom-0 right-20 bg-yellow-400 rounded-full p-4 cursor-pointer">
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

                    <Button
                        text={'Đăng ký chủ trọ'}
                        textColor={'text-white'}
                        bgColor={'bg-secondary2'}
                        onClick={handleSubmit}
                    />
                </div>
            )}
        </div>
    );
};
export default RegisterHost;
