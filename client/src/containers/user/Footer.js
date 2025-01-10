import React from 'react';
import logo from '../../assets/logowithoutbg.png'
import { Link } from "react-router-dom";
import { path } from '../../ultils/constant'
import icons from '../../ultils/icons'

const { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare, FaYoutubeSquare } = icons

const Footer = () => {
    return (
        <footer className="bg-secondary1 text-[#333333] shadow-lg py-10 px-32 mt-8">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo and Information */}
                    <div className="flex items-center">
                        <Link to={path.HOME} className="flex items-center">
                            <img
                                src={logo}
                                alt="logo"
                                className="w-[200px] h-[100px] object-contain"
                            />
                        </Link>
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <h3 className="text-2xl font-semibold text-[#BE8A28]">Trang Cho Thuê Nhà Trọ</h3>
                            <p className="mt-2 text-sm">
                                Cung cấp giải pháp tìm kiếm và đặt phòng trọ cho sinh viên tại Đà Nẵng.
                            </p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col md:flex-row gap-8 px-8">
                        <div>
                            <h4 className="font-semibold text-lg text-[#BE8A28]">Liên kết</h4>
                            <ul className="mt-4">
                                <li><a href="#" className="hover:text-orange-600">Trang chủ</a></li>
                                <li><a href="#" className="hover:text-orange-600">Về chúng tôi</a></li>
                                <li><a href="#" className="hover:text-orange-600">Dịch vụ</a></li>
                                <li><a href="#" className="hover:text-orange-600">Liên hệ</a></li>
                            </ul>
                        </div>

                        {/* Contact Section */}
                        <div>
                            <h4 className="font-semibold text-lg text-[#BE8A28]">Liên hệ</h4>
                            <ul className="mt-4">
                                <li><b>Địa chỉ:</b> Đà Nẵng, Việt Nam</li>
                                <li><b>Email:</b> <a href='mailto: support@phongtro.com' className='text-blue-400 hover:text-orange-600'>support@phongtro.com</a></li>
                                <li><b>Điện thoại:</b> <a href='tel: +84 123 456 789' className='text-blue-400 hover:text-orange-600'>+84 123 456 789</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-8 text-center">
                    <h4 className="font-semibold text-lg text-[#BE8A28]">Theo dõi chúng tôi</h4>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="#" className="hover:scale-110">
                            <FaFacebookSquare className="text-blue-600 hover:text-blue-800 text-3xl" />
                        </a>
                        <a href="#" className="hover:scale-110">
                            <FaTwitterSquare className="text-sky-400 hover:text-sky-600 text-3xl" />
                        </a>
                        <a href="#" className="hover:scale-110">
                            <FaInstagramSquare className="text-pink-500 hover:text-pink-700 text-3xl" />
                        </a>
                        <a href="#" className="hover:scale-110">
                            <FaYoutubeSquare className="text-red-600 hover:text-red-800 text-3xl" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
                <p>&copy; 2024 Phongtro.com. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
