import React, { useCallback, useEffect, useState, useRef } from "react";
import logo from '../../assets/logowithoutbg.png'
import { Button } from '../../components';
import { path } from '../../ultils/constant'
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../store/actions'
import anonAvatar from '../../assets/anon-avatar.png'
import { FaUser, FaKey, FaSignOutAlt, FaHistory } from 'react-icons/fa'


const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Lấy msg từ Redux store
    const { isLoggedIn } = useSelector(state => state.auth);
    const { currentData } = useSelector(state => state.user)

    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null); // Tham chiếu đến container của menu
    const avatarRef = useRef(null); // Tham chiếu đến container của avatar

    useEffect(() => {
        // Đóng menu khi người dùng nhấn ra ngoài avatar hoặc menu
        const handleClickOutside = (event) => {
            if (
                avatarRef.current && !avatarRef.current.contains(event.target) &&
                menuRef.current && !menuRef.current.contains(event.target)
            ) {
                setShowMenu(false); // Đóng menu nếu nhấn ra ngoài
            }
        };

        // Thêm sự kiện lắng nghe click ra ngoài
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup sự kiện khi component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            isLoggedIn && dispatch(actions.getCurrent())
        }, 100)
    }, [isLoggedIn])

    const goLogin = useCallback(() => {
        navigate(path.LOGIN)
    })

    const goRegister = useCallback(() => {
        navigate(path.REGISTER);
    });

    const handleLogout = () => {
        dispatch(actions.logout()); // Dispatch action logout
        navigate(path.LOGIN); // Quay về login sau khi logout
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);  // Toggle menu khi người dùng click vào avatar
    };

    const handleProfile = () => {
        navigate(path.PROFILE);  // Chuyển đến trang thông tin cá nhân
        setShowMenu(false);  // Đóng submenu
    };

    const handleChangePassword = () => {
        navigate(path.CHANGE_PASSWORD);  // Chuyển đến trang đổi mật khẩu
        setShowMenu(false);  // Đóng submenu
    };

    const handleHistory = () => {
        navigate(path.HISTORY);  // Chuyển đến trang lịch sử đặt phòng
        setShowMenu(false);  // Đóng submenu
    };

    return (
        <header className="bg-secondary1 text-[#333333] shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center px-32">
                {/* Logo */}
                <Link to={path.HOME} className="flex items-center">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[200px] h-[100px] object-contain"
                    />
                </Link>

                <div className="flex items-center space-x-6">
                    {/* Navigation Links */}
                    <nav className="flex space-x-6 text-lg">
                        <NavLink
                            to={path.HOME}
                            className={({ isActive }) =>
                                `block py-2 px-4 transition-colors duration-300 ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'
                                }`
                            }
                        >
                            Trang chủ
                        </NavLink>
                        <NavLink
                            to={path.ROOM}
                            className={({ isActive }) =>
                                `block py-2 px-4 transition-colors duration-300 ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'
                                }`
                            }
                        >
                            Phòng Trọ
                        </NavLink>
                        <NavLink
                            to={path.BLOG}
                            className={({ isActive }) =>
                                `block py-2 px-4 transition-colors duration-300 ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'
                                }`
                            }
                        >
                            Blog
                        </NavLink>
                        <NavLink
                            to={path.BOOKING_LIST}
                            className={({ isActive }) =>
                                `block py-2 px-4 transition-colors duration-300 ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'
                                }`
                            }
                        >
                            Danh Sách Đặt Phòng
                        </NavLink>
                    </nav>

                    {/* Login & Register */}
                    {isLoggedIn ? (
                        <div className="flex items-center space-x-4">
                            <NavLink
                                to={path.REGISTER_HOST}
                                className={({ isActive }) =>
                                    `block py-2 px-4 transition-colors duration-300 font-bold text-lg ${isActive ? 'bg-orange-400 text-white' : 'hover:bg-orange-400 hover:text-white'
                                    }`
                                }
                            >
                                Đăng ký thành chủ trọ
                            </NavLink>
                            <div
                                ref={avatarRef}
                                className="relative flex items-center gap-2 cursor-pointer"
                                onClick={toggleMenu}
                            >
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${currentData?.anh}` || anonAvatar}
                                    alt="avatar"
                                    className="w-10 object-cover rounded-full h-10 border-2 shadow-md border-white"
                                />
                                <div className="flex flex-col">
                                    <span><span className="font-semibold">{currentData?.hoTen}</span></span>
                                </div>

                                {/* Submenu */}
                                {showMenu && (
                                    <div
                                        ref={menuRef}
                                        className="absolute top-14 right-0 bg-white text-black rounded-lg shadow-lg w-60 p-2 z-10"
                                    >
                                        <div className="block w-full text-left p-2 hover:bg-gray-200 flex items-center gap-2 border-b">
                                            <img
                                                src={`${process.env.REACT_APP_SERVER_URL}${currentData?.anh}` || anonAvatar}
                                                alt="avatar"
                                                className="w-10 object-cover rounded-full h-10 border-2 shadow-md border-white"
                                            />
                                            <div className="flex flex-col">
                                                <span><span className="font-semibold">{currentData?.hoTen}</span></span>
                                            </div>
                                        </div>
                                        <button
                                            className="block w-full text-left p-2 hover:bg-gray-200 flex items-center gap-2"
                                            onClick={handleProfile}
                                        >
                                            <FaUser /> Thông tin cá nhân
                                        </button>
                                        <button
                                            className="block w-full text-left p-2 hover:bg-gray-200 flex items-center gap-2"
                                            onClick={handleHistory}
                                        >
                                            <FaHistory /> Lịch sử đặt phòng {/* Sử dụng FaHistory */}
                                        </button>
                                        <button
                                            className="block w-full text-left p-2 hover:bg-gray-200 flex items-center gap-2"
                                            onClick={handleChangePassword}
                                        >
                                            <FaKey /> Đổi mật khẩu
                                        </button>
                                        <button
                                            className="block w-full text-left p-2 hover:bg-gray-200 text-red-500 flex items-center gap-2"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt /> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Button
                                text={'Đăng nhập'}
                                textColor={'text-white'}
                                bgColor={'bg-secondary2'}
                                onClick={goLogin}
                            />
                            <Button
                                text={'Đăng Ký'}
                                textColor={'text-white'}
                                bgColor={'bg-secondary2'}
                                onClick={goRegister}
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header