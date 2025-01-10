import React, { useState, useEffect } from "react";
import * as services from "../../services"; // Import API
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Pagination } from "../../components";
import { useSearchParams } from "react-router-dom";

const MySwal = withReactContent(Swal);

const AllBookedRoom = () => {
    const [bookingRequests, setBookingRequests] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [searchName, setSearchName] = useState(''); // Tên người đặt
    const [statusFilter, setStatusFilter] = useState(''); // Lọc theo trạng thái
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const bookingPerPage = 5;

    useEffect(() => {
        // Lấy dữ liệu yêu cầu đặt phòng khi component được mount
        const fetchBookings = async () => {
            try {
                setLoading(true); // Bắt đầu tải dữ liệu
                const response = await services.apiGetBookedRoom(); // Gọi API lấy yêu cầu chờ phê duyệt
                if (response.data.err === 0) {
                    setBookingRequests(response.data.result); // Lưu dữ liệu vào state
                    setFilteredBookings(response.data.result); // Thiết lập dữ liệu ban đầu cho bộ lọc
                } else {
                    console.error(response.data.msg);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đặt phòng:", error);
            } finally {
                setLoading(false); // Kết thúc tải dữ liệu
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        // Lọc danh sách khi người dùng thay đổi tìm kiếm hoặc trạng thái
        const filtered = bookingRequests.filter((booking) => {
            const matchName = booking.hoTen.toLowerCase().includes(searchName.toLowerCase());
            const matchStatus = statusFilter ? booking.trangThai === statusFilter : true;

            return matchName && matchStatus;
        });

        setFilteredBookings(filtered); // Cập nhật danh sách sau khi lọc
    }, [searchName, statusFilter, bookingRequests]);

    const handleFinish = async (id) => {
        const result = await MySwal.fire({
            title: "Xác nhận kết thúc đặt phòng",
            text: `Bạn có chắc chắn muốn kết thúc đặt phòng này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const response = await services.apiFinishlBooking(id);
                if (response.data.err === 0) {
                    toast.success(response.data.msg)
                    const bookingUpdate = await services.apiGetBookedRoom();
                    setFilteredBookings(bookingUpdate.data.result);
                } else {
                    toast.error(response.data.msg)
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const indexOfLastBooking = currentPage * bookingPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingPerPage;
    const currentBooking = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const totalPages = Math.ceil(filteredBookings.length / bookingPerPage);

    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber });
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [currentPage]);

    if (loading) {
        return <div className="text-center py-4">Đang tải dữ liệu...</div>; // Hiển thị khi đang tải dữ liệu
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-6">Danh sách yêu cầu đặt phòng</h2>

            {/* Thêm các trường tìm kiếm */}
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Tìm tên người đặt"
                    className="border border-gray-300 px-4 py-2 rounded"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <select
                    className="border border-gray-300 px-4 py-2 rounded"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Lọc theo trạng thái</option>
                    <option value="Đã đặt">Đã đặt</option>
                    <option value="Hết hạn">Hết hạn</option>
                </select>
            </div>

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
                        {currentBooking.length > 0 ? (
                            currentBooking.map((booking, i) => {
                                const isExpired = booking.trangThai === 'Hết hạn';
                                const isBooked = booking.trangThai === 'Đã đặt';
                                return (
                                    <tr
                                        key={booking.id}
                                        className={`border-b ${isExpired ? 'bg-gray-300 text-black' : ''}`}
                                    >
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2">{booking.hoTen}</td>
                                        <td className="px-4 py-2">{booking.SDT}</td>
                                        <td className="px-4 py-2">{booking.tenPhong}</td>
                                        <td className="px-4 py-2 text-green-500">{booking.giaPhong} VNĐ</td>
                                        <td className="px-4 py-2 text-green-500">{booking.tienCoc} VNĐ</td>
                                        <td className="px-4 py-2 text-red-500">{booking.soLuong}</td>
                                        <td className="px-4 py-2 text-red-500">{booking.ngayDat}</td>
                                        <td className="px-4 py-2 text-red-500">{booking.ngayKetThuc}</td>
                                        <td className={`px-4 py-2 ${isBooked ? 'bg-green-100 text-green-800' : ''}`}>
                                            {booking.trangThai}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {/* Hiển thị nút kết thúc nếu trạng thái là "Hết hạn" */}
                                            {isExpired && (
                                                <button
                                                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                                                    onClick={() => handleFinish(booking.id)}
                                                >
                                                    Kết thúc
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-4 py-2 text-center">Không có yêu cầu đặt phòng nào chờ duyệt.</td>
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

export default AllBookedRoom;
