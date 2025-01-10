import React from "react";
import { FaPhoneAlt } from "react-icons/fa"; // Import icon điện thoại từ react-icons
import anonAvatar from '../assets/anon-avatar.png';
import { Link } from "react-router-dom";
import DOMPurify from 'dompurify';

const RoomCard = ({ room }) => {
    return (
        <Link key={room.id} to={`/chi-tiet/${room.tenPhong}/${room.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4 transform transition-transform duration-300 ease-in-out hover:scale-105">
                <div className="p-2 flex gap-4">
                    <img
                        src={`${process.env.REACT_APP_SERVER_URL}${room.anh[0]}`}
                        alt={room.tenPhong}
                        className="w-1/3 h-52 object-cover rounded-lg"
                    />

                    {/* Phần nội dung chiếm 2/3 card */}
                    <div className="w-2/3">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 text-blue-500">{room.tenPhong}</h3>
                        <div className="flex justify-between py-2">
                            <p className="text-gray-600 text-green-600 font-semibold">{room.gia}/tháng</p>
                            <p className="text-gray-600">{room.dienTich}m²</p>
                        </div>
                        {/* Dùng line-clamp để cắt mô tả, hiển thị 2 dòng và thêm dấu ... */}
                        <p className="text-gray-500 text-sm line-clamp-2">
                            <div
                                className="description"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(room?.moTa)
                                }}
                            />
                        </p>
                        <p className="text-red-500 font-semibold py-2 text-sm">Còn trống {room.soLuongPhongTrong} phòng</p>
                        <p className="text-black text-sm font-semibold py-2">{room.diaChi}</p>

                        <div className="flex justify-between py-2 items-center">
                            <div className="flex gap-2 items-center">
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${room?.avatar}` || anonAvatar}
                                    alt="avatar"
                                    className="w-10 object-cover rounded-full h-10 border-2 shadow-md border-white"
                                />
                                <div className="flex flex-col justify-center">
                                    <span className="font-semibold">{room?.hoTen}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-[#0D6EFD] text-white px-4 py-2 rounded-lg">
                                <FaPhoneAlt /> {/* Thêm biểu tượng điện thoại */}
                                <span>{room.SDT}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RoomCard;
