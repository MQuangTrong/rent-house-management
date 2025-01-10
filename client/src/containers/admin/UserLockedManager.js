import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as service from "../../services";
import { Pagination } from "../../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UserLockedManager = () => {
    const [searchTerm, setSearchTerm] = useState(""); // Tìm kiếm theo tên
    const [filter, setFilter] = useState(""); // Lọc theo vai trò
    const [accounts, setAccounts] = useState([]); // Lưu trữ tài khoản từ API
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;
    const accountsPerPage = 5;

    // Set initial values for searchTerm and filter from URL
    useEffect(() => {
        const initialSearchTerm = searchParams.get("searchTerm") || "";
        const initialFilter = searchParams.get("filter") || "";
        setSearchTerm(initialSearchTerm);
        setFilter(initialFilter);
    }, [searchParams]);

    // Gọi API khi component mount hoặc khi searchTerm, filter thay đổi
    useEffect(() => {
        const fetchAccounts = async () => {
            setLoading(true);
            try {
                const response = await service.apiGetAllLocked(searchTerm, filter, currentPage, accountsPerPage);
                setAccounts(response.data.result);
            } catch (error) {
                console.error("Lỗi khi lấy tài khoản: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [currentPage]); // Chạy lại mỗi khi searchTerm, filter, hoặc currentPage thay đổi

    // Lọc danh sách tài khoản theo tìm kiếm và vai trò ở frontend
    const filteredAccounts = accounts.filter((account) => {
        const accountName = account.tenChu || account.tenKH || ""; // Tìm kiếm tên
        const searchCondition = searchTerm ? accountName.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const roleCondition = filter ? account.maPhanQuyen === parseInt(filter) : true;
        return searchCondition && roleCondition;
    });

    const indexOfLastAccount = currentPage * accountsPerPage;
    const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
    const paginatedAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

    const handlePageChange = (pageNumber) => {
        // Only update the URL parameters that are not empty
        setSearchParams((prevParams) => {
            const newParams = { page: pageNumber };
            if (searchTerm) newParams.searchTerm = searchTerm;
            if (filter) newParams.filter = filter;
            return newParams;
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // Reset to first page and update the search term in URL
        setSearchParams((prevParams) => {
            const newParams = { page: 1, searchTerm: e.target.value };
            if (filter) newParams.filter = filter;
            return newParams;
        });
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        // Reset to first page and update the filter in URL
        setSearchParams((prevParams) => {
            const newParams = { page: 1, filter: e.target.value };
            if (searchTerm) newParams.searchTerm = searchTerm;
            return newParams;
        });
    };

    // Remove searchTerm and filter if both are empty
    useEffect(() => {
        if (!searchTerm && !filter) {
            // If both are empty, remove both from the URL
            setSearchParams((prevParams) => {
                const newParams = { page: currentPage }; // Keep page in URL
                return newParams;
            });
        }
    }, [searchTerm, filter, currentPage, setSearchParams]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Mượt mà khi cuộn
        });
    }, [currentPage]);

    // Hàm xử lý mở khóa tài khoản
    const handleUnLockUser = async (account) => {
        const result = await MySwal.fire({
            title: "Xác nhận mở khóa tài khoản",
            text: `Bạn có chắc chắn muốn mở khóa tài khoản: ${account.hoTen}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const response = await service.apiUnLockUser(account.id);
                if (response.data.err === 0) {
                    if (response.data.msg.includes("Đã mở khóa tài khoản")) {
                        toast.success(response.data.msg)
                        const updatedAccounts = await service.apiGetAllLocked(searchTerm, filter, currentPage, accountsPerPage);
                        setAccounts(updatedAccounts.data.result);
                    } else {
                        toast.error(response.data.msg)
                    }
                } else {
                    alert(`Không thể khóa tài khoản: ${response.data.msg}`);
                }
            } catch (error) {
                alert(`Lỗi khi khóa tài khoản: ${error.message}`);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Các tài khoản đã khóa</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    className="p-2 border border-gray-300 rounded-lg w-1/3"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select
                    className="p-2 border border-gray-300 rounded-lg"
                    value={filter}
                    onChange={handleFilterChange}
                >
                    <option value="">Tất cả</option>
                    <option value="2">Chủ trọ</option>
                    <option value="3">Người dùng</option>
                </select>
            </div>

            {/* Hiển thị loading nếu đang tải */}
            {loading ? (
                <div>Đang tải...</div>
            ) : paginatedAccounts.length === 0 ? (
                <div className="text-center text-gray-500">Không có kết quả tìm kiếm.</div>
            ) : (
                // Bảng tài khoản
                <table className="min-w-full bg-white border border-gray-200 shadow-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">STT</th>
                            <th className="px-4 py-2 text-left">Tên</th>
                            <th className="px-4 py-2 text-left">Vai trò</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Số điện thoại</th>
                            <th className="px-4 py-2 text-left">Căn cước công dân</th>
                            <th className="px-4 py-2 text-left">Giới tính</th>
                            <th className="px-4 py-2 text-left">Ảnh</th>
                            <th className="px-4 py-2 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAccounts.map((account, i) => (
                            <tr key={account.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{i + 1}</td>
                                <td className="px-4 py-2">
                                    {account.hoTen}
                                </td>
                                <td className="px-4 py-2">{account.tenQuyen}</td>
                                <td className="px-4 py-2">{account.email}</td>
                                <td className="px-4 py-2">
                                    {/* Hiển thị số điện thoại của chủ trọ hoặc khách hàng */}
                                    {account.SDT}
                                </td>
                                <td className="px-4 py-2">
                                    {/* Hiển thị số điện thoại của chủ trọ hoặc khách hàng */}
                                    {account.CCCD}
                                </td>
                                <td className="px-4 py-2">
                                    {/* Hiển thị số điện thoại của chủ trọ hoặc khách hàng */}
                                    {account.gioiTinh}
                                </td>
                                <td className="px-4 py-2">
                                    <img
                                        src={`${process.env.REACT_APP_SERVER_URL}${account.anh}`}
                                        alt="avatar"
                                        className="w-20 h-20 object-cover"
                                    />
                                </td>
                                <td className="px-4 py-2 text-center space-x-2">
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-red-600"
                                        onClick={() => handleUnLockUser(account)}
                                    >
                                        Mở khóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            )}

            {paginatedAccounts.length > 0 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

        </div>
    );
};

export default UserLockedManager;
