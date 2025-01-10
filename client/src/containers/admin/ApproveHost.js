import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as service from "../../services";
import { path } from '../../ultils/constant';

const ApproveHost = () => {
    const [hosts, setHosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHostPendingApprove = async () => {
            try {
                const response = await service.apiHostPendingApprove();
                if (response.data.err === 0) {
                    setHosts(response.data.result);
                } else {
                    console.error('Failed to fetch host');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchHostPendingApprove();
    }, []);

    const getStatusClass = (status) => {
        if (status === "Chờ duyệt") {
            return "text-red-800 bg-red-100";
        }
        if (status === "Đã duyệt") {
            return "text-green-500 bg-green-100";
        }
        return "text-gray-500 bg-gray-100";
    };

    const handleViewDetails = (id) => {
        navigate(`${path.ADMIN}/chi-tiet-dang-ky-chu-tro/${id}`);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-secondary2">Duyệt Đăng Ký Chủ Trọ</h1>
            {hosts.length > 0 ? (
                <table className="min-w-full bg-white border-black">
                    <thead className="bg-secondary2 text-white">
                        <tr>
                            <th className="px-4 py-2 border">STT</th>
                            <th className="px-4 py-2 border">Họ Tên</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Số Điện Thoại</th>
                            <th className="px-4 py-2 border">Giới Tính</th>
                            <th className="px-4 py-2 border">CCCD</th>
                            <th className="px-4 py-2 border">Ảnh CCCD Mặt Trước</th>
                            <th className="px-4 py-2 border">Ảnh CCCD Mặt Sau</th>
                            <th className="px-4 py-2 border">Trạng Thái</th>
                            <th className="px-4 py-2 border">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hosts.map((host, index) => (
                            <tr key={host.id}>
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{host.hoTen}</td>
                                <td className="px-4 py-2 border">{host.email}</td>
                                <td className="px-4 py-2 border">{host.SDT}</td>
                                <td className="px-4 py-2 border">{host.gioiTinh ? 'Nam' : 'Nữ'}</td>
                                <td className="px-4 py-2 border">{host.CCCD}</td>
                                <td className="px-4 py-2 border">
                                    <img src={`${process.env.REACT_APP_SERVER_URL}${host.anhCCCDMatTruoc}`} alt="CCCD Mặt Trước" className="w-20 h-20 object-cover" />
                                </td>
                                <td className="px-4 py-2 border">
                                    <img src={`${process.env.REACT_APP_SERVER_URL}${host.anhCCCDMatSau}`} alt="CCCD Mặt Sau" className="w-20 h-20 object-cover" />
                                </td>
                                <td className={`px-4 py-2 border ${getStatusClass(host.trangThai ? 'Đã duyệt' : 'Chờ duyệt')}`}>
                                    {host.trangThai ? 'Đã duyệt' : 'Chờ duyệt'}
                                </td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => handleViewDetails(host.id)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-xl text-gray-600">
                    Hiện không có chủ trọ nào cần duyệt.
                </div>
            )}
        </div>
    );
};

export default ApproveHost;
