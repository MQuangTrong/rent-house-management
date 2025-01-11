import React, { useState, useEffect } from "react";
import * as services from "../../services"; // Import API
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Pagination } from "../../components";

const History = () => {
    const navigate = useNavigate()
    const [bookingRequests, setBookingRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [searchText, setSearchText] = useState(""); // Tìm kiếm theo tên
    const [statusFilter, setStatusFilter] = useState(""); // Lọc theo trạng thái
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const bookingPerPage = 5;

    useEffect(() => {
        // Lấy dữ liệu yêu cầu đặt phòng khi component được mount
        const fetchBookings = async () => {
            try {
                setLoading(true); // Bắt đầu tải dữ liệu
                const response = await services.apiHistory();
                if (response.data.err === 0) {
                    setBookingRequests(response.data.result); // Lưu dữ liệu vào state
                    setFilteredRequests(response.data.result); // Gán dữ liệu ban đầu cho danh sách lọc
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

    useEffect(() => {
        // Lọc danh sách theo tên và trạng thái
        const filtered = bookingRequests.filter((booking) => {
            const matchesName = booking.hoTen.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter ? booking.trangThai === statusFilter : true;
            return matchesName && matchesStatus;
        });
        setFilteredRequests(filtered);
    }, [searchText, statusFilter, bookingRequests]);

    const indexOfLastBooking = currentPage * bookingPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingPerPage;
    const currentBooking = filteredRequests.slice(indexOfFirstBooking, indexOfLastBooking);

    const totalPages = Math.ceil(filteredRequests.length / bookingPerPage);

    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber });
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    const handleViewDetails = (id) => {
        navigate(`/chi-tiet-lich-su/${id}`);
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải dữ liệu...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">Lịch sử đặt phòng</h2>

            {/* Thanh tìm kiếm và lọc */}
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="border rounded-md px-4 py-2 w-full md:w-1/2"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-md px-4 py-2 w-full md:w-1/2"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
                    <option value="Đã đặt">Đã đặt</option>
                    <option value="Hết hạn">Hết hạn</option>
                    <option value="Kết thúc">Kết thúc</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-secondary2 text-white">
                            <th className="px-4 py-2 border">STT</th>
                            <th className="px-4 py-2 border">Tên chủ trọ</th>
                            <th className="px-4 py-2 border">Số điện thoại</th>
                            <th className="px-4 py-2 border">Tên phòng</th>
                            <th className="px-4 py-2 border">Giá phòng</th>
                            <th className="px-4 py-2 border">Tiền cọc</th>
                            <th className="px-4 py-2 border">Số lượng</th>
                            <th className="px-4 py-2 border">Ngày đặt</th>
                            <th className="px-4 py-2 border">Ngày kết thúc</th>
                            <th className="px-4 py-2 border">Trạng thái</th>
                            <th className="px-4 py-2 border">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBooking.length > 0 ? (
                            currentBooking.map((booking, i) => (
                                <tr key={booking.id} className="border-b">
                                    <td className="px-4 py-2">{indexOfFirstBooking + i + 1}</td>
                                    <td className="px-4 py-2">{booking.hoTen}</td>
                                    <td className="px-4 py-2">{booking.SDT}</td>
                                    <td className="px-4 py-2">{booking.tenPhong}</td>
                                    <td className="px-4 py-2">{booking.giaPhong}</td>
                                    <td className="px-4 py-2">{booking.tienCoc}</td>
                                    <td className="px-4 py-2">{booking.soLuong}</td>
                                    <td className="px-4 py-2">{booking.ngayDat}</td>
                                    <td className="px-4 py-2">{booking.ngayKetThuc}</td>
                                    <td
                                        className={`px-4 py-2 text-center 
                                                ${booking.trangThai === "Đang chờ xác nhận"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : booking.trangThai === "Đã đặt"
                                                    ? "bg-green-100 text-green-800"
                                                    : booking.trangThai === "Hết hạn"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : booking.trangThai === "Kết thúc"
                                                            ? "bg-red-100 text-red-800"
                                                            : ""
                                            }`}
                                    >
                                        {booking.trangThai}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                            onClick={() => handleViewDetails(booking.id)}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-4 py-2 text-center">
                                    Không có yêu cầu đặt phòng nào phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default History;
