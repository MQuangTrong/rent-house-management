import React, { useEffect, useState } from "react";
import { Button, FormInput } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { path } from '../../ultils/constant'
import * as actions from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { validate } from '../../validates/validate'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Modal from 'react-modal';
import * as services from '../../services'

Modal.setAppElement('#root');

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Lấy msg từ Redux store
    const { msg, isLoggedIn, token, update } = useSelector(state => state.auth);

    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayLoad] = useState({
        email: '',
        matKhau: '',
    })

    const [forgotPasswordPayload, setForgotPasswordPayload] = useState({
        email: '',
    })

    const [showMatKhau, setShowMatKhau] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mở modal quên mật khẩu
    const handleForgotPassword = () => {
        setIsModalOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
        forgotPasswordPayload.email = ''
    };

    // Xử lý quên mật khẩu
    const handleForgotPasswordSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(forgotPasswordPayload, setInvalidFields)
        if (invalids === 0)
            try {
                const response = await services.apiForgotPassword(forgotPasswordPayload); // Gọi API quên mật khẩu với email
                if (response.data.msg.includes("Email khôi phục")) {
                    toast.success(response.data.msg);
                } else {
                    toast.error(response.data.msg);
                }
                closeModal(); // Đóng modal sau khi gửi yêu cầu
            } catch (error) {
                toast.error("Lỗi khi gửi yêu cầu!");
            }
    };

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields)
        if (invalids === 0)
            dispatch(actions.login(payload))
    }

    useEffect(() => {
        dispatch(actions.resetMessage())
        if (msg) {
            if (msg.includes("Đăng nhập thành công") && isLoggedIn) {
                toast.success(msg);
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const role = decodedToken.maPhanQuyen; // Giả sử trường 'role' trong token

                    if (role === 1) {
                        navigate(path.ADMIN); // Điều hướng tới trang Admin
                    } else if (role === 2) {
                        navigate(path.HOST); // Điều hướng tới trang Chủ trọ
                    } else {
                        navigate('/'); // Điều hướng tới trang chủ
                    }
                }
            } else {
                toast.error(msg);
            }
        }
    }, [msg, isLoggedIn, navigate, token, update]);



    return (
        <div className="bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm my-8">
            <h3 className="font-semibold text-2xl text-center mb-3 text-secondary2">Đăng Nhập</h3>
            <div className="w-full flex flex-col gap-3">
                <FormInput invalidFields={invalidFields} setInvalidFields={setInvalidFields} label={'Email'} value={payload.email} setValue={setPayLoad} keyName="email" type="email" />
                <div className="relative">
                    <FormInput invalidFields={invalidFields} setInvalidFields={setInvalidFields} label={'Mật khẩu'} value={payload.matKhau} setValue={setPayLoad} keyName={'matKhau'} type={showMatKhau ? "text" : "password"} />
                    <span
                        onClick={() => setShowMatKhau(!showMatKhau)}
                        className="absolute right-3 top-12 cursor-pointer"
                    >
                        {showMatKhau ? <FaEyeSlash /> : <FaEye />}  {/* Hiển thị biểu tượng mắt */}
                    </span>
                </div>

                <Button
                    text={'Đăng nhập'}
                    textColor={'text-white'}
                    bgColor={'bg-secondary2'}
                    onClick={handleSubmit}
                />
            </div>
            <div className="mt-7 flex items-center justify-between">
                <span
                    onClick={handleForgotPassword} // Mở modal khi click vào "Quên mật khẩu"
                    className="text-secondary2 hover:text-[red] cursor-pointer"
                >
                    Bạn quên mật khẩu?
                </span>
                <span className="text-secondary2 hover:text-[red] cursor-pointer"> <Link to={`/${path.REGISTER}`}>Tạo tài khoản mới</Link></span>
            </div>

            {/* Modal Nhập Email */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Quên Mật Khẩu"
                className="bg-white p-6 rounded-md shadow-lg w-96 mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-center text-xl font-semibold mb-4">Nhập Email Để Khôi Phục Mật Khẩu</h2>
                <FormInput
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    label="Email"
                    value={forgotPasswordPayload.email}
                    setValue={setForgotPasswordPayload}
                    keyName="email"
                    type="email"
                    className="mb-4"
                />
                <div className="flex justify-center gap-6 mt-6">
                    <Button
                        text="Đóng"
                        onClick={closeModal}
                        textColor="text-white"
                        bgColor="bg-gray-500"
                        className="w-full"
                    />
                    <Button
                        text="Gửi Yêu Cầu"
                        onClick={handleForgotPasswordSubmit}
                        textColor="text-white"
                        bgColor="bg-secondary2"
                        className="w-full"
                    />
                </div>

            </Modal>
        </div>
    )
}

export default Login