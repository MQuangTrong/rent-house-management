import React from "react";
import { Link } from "react-router-dom";

const SidebarRoom = ({ room }) => {
    return (
        <Link key={room.id} to={`/chi-tiet/${room.tenPhong}/${room.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                <div className="p-2 flex gap-4">
                    <img
                        src={`${process.env.REACT_APP_SERVER_URL}${room.anh}`}
                        alt={room.tenPhong}
                        className="w-1/3 h-20 object-cover rounded-lg"
                    />

                    {/* Phần nội dung chiếm 2/3 card */}
                    <div className="w-2/3">
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 text-blue-500">{room.tenPhong}</h3>
                        <div className="flex justify-between py-2">
                            <p className="text-gray-600 text-green-600 text-sm">{room.gia}/tháng</p>
                            <p className="text-gray-600 text-sm">{room.dienTich}m²</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SidebarRoom;
