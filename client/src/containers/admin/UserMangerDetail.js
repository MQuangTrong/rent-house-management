import React, { useState, useEffect } from "react";
import * as service from "../../services/";
import { FaSpinner } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import anonAvatar from "../../assets/anon-avatar.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UserManagerDetail = () => {
    const { id } = useParams();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Hook để điều hướng trang

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response = await service.apiUserDetailService(id);
                if (response?.data?.err === 0) {
                    setUserDetail(response.data.result);
                } else {
                    setError(response?.data?.msg || "Không thể tải thông tin người dùng");
                }
            } catch (err) {
                setError(err.message || "Lỗi khi gọi API");
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <FaSpinner className="animate-spin text-gray-500 text-3xl" />
                <span className="ml-2 text-gray-500">Đang tải...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-500 p-4 rounded-md">
                {error}
            </div>
        );
    }

    // Xử lý khóa tài khoản
    const handleLockUser = async (userDetail) => {
        const result = await MySwal.fire({
            title: "Xác nhận khóa tài khoản",
            text: `Bạn có chắc chắn muốn khóa tài khoản: ${userDetail.hoTen}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const response = await service.apiLockUser(userDetail.id);
                if (response.data.err === 0) {
                    toast.success(response.data.msg);
                    navigate(-1);
                } else {
                    toast.error(`Không thể khóa tài khoản: ${response.data.msg}`);
                }
            } catch (error) {
                toast.error(`Lỗi khi khóa tài khoản: ${error.message}`);
            }
        }
    };

    const handleBackClick = () => {
        navigate(-1); // Trở về trang trước đó
    };

    return (
        <div className="container mx-auto p-6">
            {/* Nút Trở về */}
            <button
                onClick={handleBackClick}
                className="mb-4 text-secondary2 font-semibold flex items-center gap-2 p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all"
            >
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5l-7 7 7 7" />
                </svg>
                Trở về
            </button>

            <h1 className="text-3xl font-semibold mb-6 text-center text-secondary2">Chi tiết người dùng</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
                {/* Avatar trên cùng */}
                <div className="w-full mb-4 text-center">
                    <span className="text-lg font-semibold text-secondary2">Ảnh đại diện</span>
                </div>

                <div className="relative mb-6 flex justify-center">
                    <img
                        src={userDetail?.anh ? `${process.env.REACT_APP_SERVER_URL}${userDetail.anh}` : anonAvatar}
                        alt="Avatar"
                        className="w-40 h-40 object-cover rounded-full border-4 border-gray-300"
                    />
                </div>

                {/* Thông tin người dùng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-28">
                    {/* Cột 1 - Dữ liệu thông tin người dùng */}
                    <div className="flex flex-col gap-4">
                        <div className="flex  gap-4">
                            <span className="font-semibold text-secondary2">Email:</span>
                            <span>{userDetail?.email}</span>
                        </div>

                        <div className="flex  gap-4">
                            <span className="font-semibold text-secondary2">Số điện thoại:</span>
                            <span>{userDetail.SDT}</span>
                        </div>

                        <div className="flex  gap-4">
                            <span className="font-semibold text-secondary2">Họ và tên:</span>
                            <span>{userDetail.hoTen}</span>
                        </div>
                    </div>

                    {/* Cột 2 - Các thông tin khác */}
                    <div className="flex flex-col gap-4">
                        {/* Vai trò luôn hiển thị */}
                        <div className="flex  gap-4">
                            <span className="font-semibold text-secondary2">Vai trò:</span>
                            <span>{userDetail?.tenQuyen || "Không có"}</span>
                        </div>

                        <div className="flex  gap-4">
                            <span className="font-semibold text-secondary2">CCCD:</span>
                            <span>{userDetail?.CCCD}</span>
                        </div>

                        <div className="flex  gap-4">
                            <span className="font-semibold text-secondary2">Giới tính:</span>
                            <span>{userDetail?.gioiTinh}</span>
                        </div>

                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pl-28">
                    {/* Ảnh CCCD Mặt Trước */}
                    <div>
                        <label className="block text-secondary2 font-medium mb-1">Ảnh CCCD Mặt Trước:</label>
                        {userDetail?.anhCCCDMatTruoc ? (
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${userDetail.anhCCCDMatTruoc}`}
                                alt="CCCD Mặt Trước"
                                className="w-3/4 h-60 object-cover rounded-md border-2 border-gray-300"
                            />
                        ) : (
                            <p className="text-gray-700">Không có</p>
                        )}
                    </div>

                    {/* Ảnh CCCD Mặt Sau */}
                    <div>
                        <label className="block text-secondary2 font-medium mb-1">Ảnh CCCD Mặt Sau:</label>
                        {userDetail?.anhCCCDMatSau ? (
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${userDetail.anhCCCDMatSau}`}
                                alt="CCCD Mặt Sau"
                                className="w-3/4 h-60 object-cover rounded-md border-2 border-gray-300"
                            />
                        ) : (
                            <p className="text-gray-700">Không có</p>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-center mt-6">
                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => handleLockUser(userDetail)}
                    >
                        Khóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagerDetail;
