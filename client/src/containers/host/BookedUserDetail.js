import React, { useState, useEffect } from "react";
import * as services from "../../services";  // Import hàm apiBookingDetail
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const BookedUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookingDetail, setBookingDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            try {
                const response = await services.apiBookedUserDetail(id);
                setBookingDetail(response.data.result); // Giả sử response trả về đúng format như trên
                setLoading(false);
            } catch (error) {
                setError("Lấy thông tin chi tiết thất bại");
                setLoading(false);
            }
        };

        fetchBookingDetail();
    }, [id]);

    const handleBackClick = () => {
        navigate(-1); // Trở về trang trước đó
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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
            <h1 className="text-2xl font-semibold mb-4 text-center text-secondary2">Chi Tiết Khách hàng</h1>

            <div className="space-y-6">
                {/* Thông tin người đặt */}
                <h1 className="text-2xl font-semibold mb-4 text-secondary2">Thông tin người đặt</h1>
                <div className="flex justify-between space-x-4">
                    <div className="w-1/2 flex gap-2 flex gap-2">
                        <strong className="text-lg font-medium">Họ Tên:</strong>
                        <p className="text-lg">{bookingDetail.hoTen}</p>
                    </div>
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Email:</strong>
                        <p className="text-lg">{bookingDetail.email}</p>
                    </div>
                </div>

                <div className="flex justify-between space-x-4">
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Số Điện Thoại:</strong>
                        <p className="text-lg">{bookingDetail.SDT}</p>
                    </div>
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Giới Tính:</strong>
                        <p className="text-lg">{bookingDetail.gioiTinh}</p>
                    </div>
                </div>

                <div className="flex justify-between space-x-4">
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">CCCD:</strong>
                        <p className="text-lg">{bookingDetail.CCCD}</p>
                    </div>
                </div>

                {/* Ảnh CCCD */}
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <strong className="text-lg font-medium">Ảnh CCCD Mặt Trước:</strong>
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${bookingDetail.anhCCCDMatTruoc}`}
                                alt="Ảnh CCCD Mặt Trước"
                                className="w-60 h-40 object-cover rounded-lg shadow-md"
                            />
                        </div>

                        <div className="w-1/2">
                            <strong className="text-lg font-medium">Ảnh CCCD Mặt Sau:</strong>
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${bookingDetail.anhCCCDMatSau}`}
                                alt="Ảnh CCCD Mặt Sau"
                                className="w-60 h-40 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Thông tin phòng đặt */}
                <h1 className="text-2xl font-semibold mb-4 text-secondary2">Thông tin phòng trọ</h1>
                <div className="flex justify-between space-x-4">
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Tên Phòng:</strong>
                        <p className="text-lg">{bookingDetail.tenPhong}</p>
                    </div>
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Giá Phòng:</strong>
                        <p className="text-lg text-green-500">{bookingDetail.giaPhong} VNĐ</p>
                    </div>
                </div>

                <div className="flex justify-between space-x-4">
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Tiền Cọc:</strong>
                        <p className="text-lg text-green-500">{bookingDetail.tienCoc} VNĐ</p>
                    </div>
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Số Lượng:</strong>
                        <p className="text-lg text-red-500">{bookingDetail.soLuong}</p>
                    </div>
                </div>

                {/* Tóm tắt đặt phòng */}
                <div className="space-y-4">
                    <div className="flex justify-between space-x-4">
                        <div className="w-1/2 flex gap-2">
                            <strong className="text-lg font-medium">Ngày Đặt:</strong>
                            <p className="text-lg text-red-500">{bookingDetail.ngayDat}</p>
                        </div>
                        <div className="w-1/2 flex gap-2">
                            <strong className="text-lg font-medium">Ngày Kết Thúc:</strong>
                            <p className="text-lg text-red-500">{bookingDetail.ngayKetThuc}</p>
                        </div>
                    </div>
                    <div className="w-1/2 flex gap-2">
                        <strong className="text-lg font-medium">Địa chỉ:</strong>
                        <p className="text-lg text-yellow-800">{bookingDetail.diaChi}</p>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <div className="w-1/2 flex gap-2">
                            <strong className="text-lg font-medium">Trạng Thái:</strong>
                            <p className="text-lg text-green-800">{bookingDetail.trangThai}</p>
                        </div>
                        <div className="w-1/2 flex gap-2">
                            <strong className="text-lg font-medium">Ảnh Phòng:</strong>
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${bookingDetail.anh}`}
                                alt="Ảnh Phòng"
                                className="w-20 mt-2 rounded-lg"
                            />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default BookedUserDetail;
