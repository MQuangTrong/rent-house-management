import React, { useEffect, useState } from "react";
import { Button, FormInput } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { path } from '../../ultils/constant'
import * as actions from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { validate } from '../../validates/validate'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lấy msg từ Redux store
    const { msg } = useSelector(state => state.auth);

    const [showMatKhau, setShowMatKhau] = useState(false);
    const [showXacNhanMatKhau, setShowXacNhanMatKhau] = useState(false);

    const [invalidFields, setInvalidFields] = useState([])
    const [payload, setPayLoad] = useState({
        email: '',
        matKhau: '',
        xacNhanMatKhau: ''
    })

    const handleSubmit = async () => {
        setInvalidFields([]);
        let invalids = validate(payload, setInvalidFields)
        if (invalids === 0)
            dispatch(actions.register(payload))
    }


    useEffect(() => {
        if (msg) {
            if (msg.includes("Đăng ký thành công")) {
                toast.success(msg);
                setTimeout(() => {
                    dispatch(actions.resetMessage())
                    navigate(`/${path.LOGIN}`);
                }, 1000);
            } else {
                toast.error(msg);
            }
        }
    }, [msg, navigate]);

    return (
        <div className="bg-white w-[600px] p-[30px] pb-[100px] rounded-md shadow-sm my-8">
            <h3 className="font-semibold text-2xl text-center mb-3 text-secondary2">Đăng Ký</h3>
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
                <div className="relative">
                    <FormInput invalidFields={invalidFields} setInvalidFields={setInvalidFields} label={'Xác nhận mật khẩu'} value={payload.xacNhanMatKhau} setValue={setPayLoad} keyName={'xacNhanMatKhau'} type={showXacNhanMatKhau ? "text" : "password"} />
                    <span
                        onClick={() => setShowXacNhanMatKhau(!showXacNhanMatKhau)}
                        className="absolute right-3 top-12 cursor-pointer"
                    >
                        {showXacNhanMatKhau ? <FaEyeSlash /> : <FaEye />}  {/* Hiển thị biểu tượng mắt */}
                    </span>
                </div>
                <Button
                    text={'Đăng ký'}
                    textColor={'text-white'}
                    bgColor={'bg-secondary2'}
                    onClick={handleSubmit}
                />
            </div>
            <div className="mt-7 flex items-center justify-between">
                <span> Bạn đã có tài khoản? <Link to={`/${path.LOGIN}`} className="text-secondary2 hover:text-[red] cursor-point"> Đăng nhập ngay</Link></span>
            </div>
        </div>
    )
}

export default Register