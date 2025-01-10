import React, { useState, useEffect } from "react";
import * as services from "../../services"; // Import API
import { useNavigate } from "react-router-dom";

const AllBooking = () => {
    const [bookingRequests, setBookingRequests] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const navigate = useNavigate()

    useEffect(() => {
        // Lấy dữ liệu yêu cầu đặt phòng khi component được mount
        const fetchBookings = async () => {
            try {
                setLoading(true); // Bắt đầu tải dữ liệu
                const response = await services.apiGetBookingpending(); // Gọi API lấy yêu cầu chờ phê duyệt
                if (response.data.err === 0) {
                    setBookingRequests(response.data.result); // Lưu dữ liệu vào state
                } else {
                    console.error(response.data.msg);
                }
            } catch (error) {
                console.error("Lỗi khi lấy yêu cầu đặt phòng:", error);
            } finally {
                setLoading(false); // Kết thúc tải dữ liệu
            }
        };
        fetchBookings();
    }, []);

    const handleDetail = async (id) => {
        navigate(`/chu-tro/chi-tiet-dat-phong/${id}`)
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải dữ liệu...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">Danh sách yêu cầu đặt phòng</h2>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-secondary2 text-white">
                            <th className="px-4 py-2 border">STT</th>
                            <th className="px-4 py-2 border">Tên người đặt</th>
                            <th className="px-4 py-2 border">Số điện thoại</th>
                            <th className="px-4 py-2 border">Tên phòng</th>
                            <th className="px-4 py-2 border">Giá phòng</th>
                            <th className="px-4 py-2 border">Tiền cọc</th>
                            <th className="px-4 py-2 border">Số lượng</th>
                            <th className="px-4 py-2 border">Ngày đặt</th>
                            <th className="px-4 py-2 border">Ngày kết thúc</th>
                            <th className="px-4 py-2 border">Trạng thái</th>
                            <th className="px-4 py-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingRequests.length > 0 ? (
                            bookingRequests.map((booking, i) => (
                                <tr key={booking.id} className="border-b">
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2">{booking.hoTen}</td>
                                    <td className="px-4 py-2">{booking.SDT}</td>
                                    <td className="px-4 py-2">{booking.tenPhong}</td>
                                    <td className="px-4 py-2 text-green-500">{booking.giaPhong} VNĐ</td>
                                    <td className="px-4 py-2 text-green-500">{booking.tienCoc} VNĐ</td>
                                    <td className="px-4 py-2 text-red-500">{booking.soLuong}</td>
                                    <td className="px-4 py-2 text-red-500">{booking.ngayDat}</td>
                                    <td className="px-4 py-2 text-red-500">{booking.ngayKetThuc}</td>
                                    <td className="px-4 py-2 bg-yellow-100 text-yellow-800">{booking.trangThai}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600"
                                            onClick={() => handleDetail(booking.id)}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-4 py-2 text-center">Không có yêu cầu đặt phòng nào chờ duyệt.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllBooking;
