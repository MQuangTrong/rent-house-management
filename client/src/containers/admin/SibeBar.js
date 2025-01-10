import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaBan,
    FaUsers,
    FaUserLock,
    FaListAlt,
    FaPlusCircle,
    FaClipboardList,
    FaTrashAlt,
    FaSignOutAlt,
    FaChartBar // Thêm biểu tượng thống kê
} from "react-icons/fa";
import { path } from '../../ultils/constant';
import { useDispatch } from 'react-redux';
import * as actions from '../../store/actions';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(actions.logout()); // Dispatch action logout
        navigate('/login'); // Quay về login sau khi logout
    };

    return (
        <div className="w-64 bg-[#39393C] text-white min-h-[calc(100vh-100px)] flex flex-col justify-between">
            {/* Phần trên */}
            <div className="p-4">
                {/* Quản lý */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2 mt-2">Quản lý tài khoản</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center w-full">
                            <NavLink
                                to={path.APPROVE_HOST}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaUsers className="mr-3" /> Duyệt đăng ký chủ trọ
                            </NavLink>
                        </li>
                        <li className="flex items-center">
                            <NavLink
                                to={`${path.USER_MANAGER}`}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaUsers className="mr-3" /> Quản lý tài khoản
                            </NavLink>
                        </li>
                        <li className="flex items-center">
                            <NavLink
                                to={`${path.USER_LOCKED_MANAGER}`}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaUserLock className="mr-3" /> Tài khoản đã khóa
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Quản lý bài đăng */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2 mt-2">Quản lý bài đăng</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center w-full">
                            <NavLink
                                to={`${path.APPROVE_POST}`}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaClipboardList className="mr-3" /> Duyệt bài đăng phòng trọ
                            </NavLink>
                        </li>
                        <li className="flex items-center">
                            <NavLink
                                to={`${path.POST_ALL}`}
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaListAlt className="mr-3" /> Danh sách bài đăng
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Thống kê */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2 mt-2">Thống kê</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <NavLink
                                to="/quan-ly/thong-ke"
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaChartBar className="mr-3" /> Tổng quan thống kê
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Bài viết */}
                <div className="mb-6">
                    <h4 className="text-sm uppercase font-bold text-gray-400 mb-2">Quản lý bài viết</h4>
                    <ul className="space-y-3">
                        <li className="flex items-center">
                            <NavLink
                                to="/quan-ly/them-bai-viet"
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaPlusCircle className="mr-3" /> Thêm bài viết
                            </NavLink>
                        </li>
                        <li className="flex items-center">
                            <NavLink
                                to="/quan-ly/quan-ly-bai-viet"
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaClipboardList className="mr-3" /> Quản lý bài viết
                            </NavLink>
                        </li>

                        <li className="flex items-center">
                            <NavLink
                                to="/quan-ly/quan-ly-bai-viet-da-xoa"
                                className={({ isActive }) =>
                                    `block py-2 transition-colors duration-300 flex items-center w-full ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'}`
                                }
                            >
                                <FaTrashAlt className="mr-3" /> Bài viết đã xóa
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* Đăng xuất */}
                <div className="mb-6 py-4 border-t border-gray-700">
                    <ul className="space-y-3">
                        <li className="flex items-center">
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

export default Sidebar;
