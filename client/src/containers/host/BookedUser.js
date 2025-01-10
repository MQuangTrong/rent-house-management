import React, { useState, useEffect } from "react";
import * as services from "../../services"; // Import API
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Pagination } from "../../components";
import { useSearchParams, useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const AllBookedRoom = () => {
    const [bookingRequests, setBookingRequests] = useState([]);
    const navigate = useNavigate()
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

    const handleDetail = async (id) => {
        navigate(`/chu-tro/chi-tiet-nguoi-dat/${id}`)
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
            </div>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-secondary2 text-white">
                            <th className="px-4 py-2 border">STT</th>
                            <th className="px-4 py-2 border">Ảnh đại diện</th>
                            <th className="px-4 py-2 border">Tên người đặt</th>
                            <th className="px-4 py-2 border">Số điện thoại</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Giới tính</th>
                            <th className="px-4 py-2 border">CCCD</th>
                            <th className="px-4 py-2 border">Ngày đặt phòng</th>
                            <th className="px-4 py-2 border">Ngày kết thúc</th>
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
                                        <td className="px-4 py-2">
                                            <img
                                                src={`${process.env.REACT_APP_SERVER_URL}${booking.avatar}`}
                                                alt="avatar"
                                                className="w-20 h-20 object-cover"
                                            />
                                        </td>
                                        <td className="px-4 py-2">{booking.hoTen}</td>
                                        <td className="px-4 py-2">{booking.SDT}</td>
                                        <td className="px-4 py-2">{booking.email}</td>
                                        <td className="px-4 py-2">{booking.gioiTinh} </td>
                                        <td className="px-4 py-2">{booking.CCCD}</td>
                                        <td className="px-4 py-2 text-red-500">{booking.ngayDat}</td>
                                        <td className="px-4 py-2 text-red-500">{booking.ngayKetThuc}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600"
                                                onClick={() => handleDetail(booking.id)}
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-4 py-2 text-center">Không có người dùng nào</td>
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
