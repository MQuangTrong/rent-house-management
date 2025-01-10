import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search } from "../user/index";
import { Pagination } from "../../components";
import * as service from "../../services";
import { path } from "../../ultils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const currentPage = Number(searchParams.get("page")) || 1;
    const roomsPerPage = 4;

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await service.apiGetRoomListFilter(filters);
                if (response && response.data.err === 0) {
                    setRooms(response.data.result);
                } else {
                    setError("Không tìm thấy phòng trọ nào phù hợp.");
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi lấy phòng trọ.");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [filters]);

    // Lọc dữ liệu phòng trọ theo trạng thái
    const filteredRooms = rooms.filter((room) => {
        if (filters.status && room.trangThai !== filters.status) {
            return false;
        }
        return true;
    });

    // Phân trang
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    // Tính tổng số trang dựa trên số lượng phòng đã lọc
    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

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
        navigate(`${path.HOST}/chi-tiet-phong-tro/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`${path.HOST}/sua-phong-tro/${id}`);
    };

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: "Xác nhận xóa phòng trọ",
            text: `Bạn có chắc chắn muốn xóa phòng này không?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const response = await service.apiDeleteRoom(id);
                if (response.data.err === 0) {
                    if (response.data.msg.includes("Đã xóa phòng trọ")) {
                        toast.success(response.data.msg)
                        const roomUpdate = await service.apiGetRoomListFilter(filters);
                        setRooms(roomUpdate.data.result);
                    } else {
                        toast.error(response.data.msg)
                    }
                } else {
                    alert(`Không thể xóa phòng trọ: ${response.data.msg}`);
                }
            } catch (error) {
                alert(`Lỗi khi xóa phòng trọ: ${error.message}`);
            }
        }
    };

    // Cập nhật hàm getStatusClass để thêm màu cho 3 trạng thái
    const getStatusClass = (status) => {
        if (status === "Hoạt động") {
            return "border-green-500 text-green-500";
        } else if (status === "Đã hủy") {
            return "border-red-700 text-red-700";
        } else if (status === "Chờ duyệt") {
            return "border-yellow-500 text-yellow-500";
        } else if (status === "Hết phòng") {
            return "border-gray-500 text-gray-500";
        }
        return "border-gray-300 text-gray-700";
    };

    return (
        <div className="space-y-4">
            <div className="w-full">
                <Search
                    onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                        setSearchParams((prevParams) => {
                            const newParams = new URLSearchParams(prevParams);
                            Object.entries(newFilters).forEach(([key, value]) => {
                                if (value) newParams.set(key, value);
                                else newParams.delete(key);
                            });
                            return newParams;
                        });
                    }}
                />
            </div>

            <div className="w-full mb-4">
                <label htmlFor="status" className="mr-2">Lọc theo trạng thái:</label>
                <select
                    id="status"
                    className="border border-gray-300 p-2 rounded-md"
                    value={filters.status}
                    onChange={(e) => {
                        const status = e.target.value;
                        setFilters((prevFilters) => ({
                            ...prevFilters,
                            status,
                        }));
                    }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Đã hủy">Đã hủy</option>
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Hết phòng">Hết phòng</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
            ) : filteredRooms.length === 0 ? (
                <div className="text-center py-4">Không có phòng nào.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-secondary2 text-white">
                                <th className="border border-gray-300 px-4 py-2">STT</th>
                                <th className="border border-gray-300 px-4 py-2">Tên Phòng</th>
                                <th className="border border-gray-300 px-4 py-2">Giá Phòng</th>
                                <th className="border border-gray-300 px-4 py-2">Diện Tích</th>
                                <th className="border border-gray-300 px-4 py-2">Tổng Phòng</th>
                                <th className="border border-gray-300 px-4 py-2">Phòng Trống</th>
                                <th className="border border-gray-300 px-4 py-2">Địa Chỉ</th>
                                <th className="border border-gray-300 px-4 py-2">Trạng Thái</th>
                                <th className="border border-gray-300 px-4 py-2">Hình Ảnh</th>
                                <th className="border border-gray-300 px-4 py-2">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRooms.map((room, index) => (
                                <tr key={room.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{room.tenPhong}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-500">{room.gia}</td>
                                    <td className="border border-gray-300 px-4 py-2">{room.dienTich} m²</td>
                                    <td className="border border-gray-300 px-4 py-2 text-green-500">{room.soLuongPhong} phòng</td>
                                    <td className="border border-gray-300 px-4 py-2 text-red-500">{room.soLuongPhongTrong} phòng</td>
                                    <td className="border border-gray-300 px-4 py-2">{room.diaChi}</td>
                                    <td className={`border px-4 py-2 ${getStatusClass(room.trangThai)}`}>
                                        {room.trangThai}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {room.anh.length > 0 && (
                                            <div className="relative w-16 h-16">
                                                <img
                                                    src={`${process.env.REACT_APP_SERVER_URL}${room.anh[0]}`}
                                                    alt={room.tenPhong}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                {room.anh.length > 1 && (
                                                    <span className="absolute bottom-0 right-0 bg-black text-white text-xs p-1 rounded-full">
                                                        +{room.anh.length - 1}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <div className="flex justify-start space-x-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded-md"
                                                onClick={() => handleViewDetails(room.id)}
                                            >
                                                Chi Tiết
                                            </button>
                                            <button
                                                className="bg-yellow-500 text-white p-2 rounded-md"
                                                onClick={() => handleEdit(room.id)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded-md"
                                                onClick={() => handleDelete(room.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default RoomList;
