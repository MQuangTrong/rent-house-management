import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaListAlt,
    FaPlusCircle,
    FaClipboardList,
    FaClipboardCheck,
    FaUser,
    FaSignOutAlt,
    FaDollarSign,
    FaUserCheck,
    FaKey
} from "react-icons/fa";
import { path } from "../../ultils/constant";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions";

const SidebarHost = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(actions.logout());
        navigate("/login");
    };

    return (
        <div className="w-64 bg-[#39393C] text-white min-h-[calc(100vh-100px)] flex flex-col justify-between">
            {/* Phần trên */}
            <div className="p-4">

                {/* Quản lý phòng trọ */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Quản lý phòng trọ</h4>
                    <ul className="space-y-3">
                        <li>
                            <NavLink
                                to={path.ADD_ROOM}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaPlusCircle className="mr-3" /> Thêm phòng trọ
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={path.ROOM_LIST}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaListAlt className="mr-3" /> Danh sách phòng trọ
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={path.ROOM_LIST_DELETE}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaListAlt className="mr-3" /> Phòng trọ đã xóa
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={path.ALL_BOOKED_ROOM}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaClipboardCheck className="mr-3" /> Phòng trọ đã đặt
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Quản lý yêu cầu */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Quản lý yêu cầu</h4>
                    <ul className="space-y-3">
                        <li>
                            <NavLink
                                to={path.ALL_BOOKING}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaClipboardList className="mr-3" /> Yêu cầu đặt phòng
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={path.BOOKED_USER}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaUserCheck className="mr-3" /> Khách hàng đã đặt phòng
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Doanh thu */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Doanh thu</h4>
                    <ul className="space-y-3">
                        <li>
                            <NavLink
                                to={path.REVENUE_STATISTIC}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaDollarSign className="mr-3" /> Thống kê doanh thu
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Cá nhân */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Cá nhân</h4>
                    <ul className="space-y-3">
                        <li>
                            <NavLink
                                to={path.HOST_PROFILE}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? "bg-orange-400 text-white" : "hover:bg-orange-400 hover:text-white"}`
                                }
                            >
                                <FaUser className="mr-3" /> Thông tin cá nhân
                            </NavLink>
                        </li>
                        <li className="flex items-center">
                            <NavLink
                                to={`${path.CHANGE_PASSWORD_HOST}`}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaKey className="mr-3" /> Đổi mật khẩu
                            </NavLink>
                        </li>
                        <li>
                            <button
                                className="block py-2 transition-colors duration-300 flex items-center w-full text-red-500 hover:bg-red-600 hover:text-white"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-3" /> Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SidebarHost;
