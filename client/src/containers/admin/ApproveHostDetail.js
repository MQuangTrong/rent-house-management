import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as service from "../../services";
import { toast } from "react-toastify";
import Swal from "sweetalert2";  // Import SweetAlert2
import "react-toastify/dist/ReactToastify.css";
import { path } from "../../ultils/constant";

const ApproveHostDetail = () => {
    const { id } = useParams();
    const [host, setHost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHostDetail = async () => {
            try {
                const response = await service.apiHostPendingApproveDetail(id);
                if (response.data.err === 0) {
                    setHost(response.data.response);
                } else {
                    console.error('Failed to fetch host detail');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchHostDetail();
    }, [id]);

    const handleApprove = async () => {
        try {
            const response = await service.apiApproveHost(id);
            if (response.data.err === 0) {
                if(response.data.msg.includes("Chủ trọ đã được phê duyệt thành công")) {
                    toast.success(response.data.msg)
                    navigate(`${path.ADMIN}/duyet-dang-ky-chu-tro`)
                } else {
                    toast.error(response.data.msg)
                }
            } else {
                console.error('Failed to approve host');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async () => {
        // Sử dụng SweetAlert2 để xác nhận hành động hủy
        const result = await Swal.fire({
            title: 'Bạn chắc chắn muốn hủy?',
            text: 'Hành động này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const response = await service.apiRejectHost(id);
                if (response.data.err === 0) {
                    if(response.data.msg.includes("Chủ trọ đã bị hủy")) {
                        toast.success(response.data.msg)
                        navigate(`${path.ADMIN}/duyet-dang-ky-chu-tro`)
                    } else {
                        toast.error(response.data.msg)
                    }
                } else {
                    console.error('Failed to reject host');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            // Nếu người dùng hủy, có thể thêm hành động ở đây nếu cần
            Swal.fire({
                title: 'Đã hủy',
                icon: 'info',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    if (!host) {
        return <div className="text-center text-xl">Loading...</div>; // Hiển thị khi dữ liệu chưa được tải
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4 text-center text-secondary2">Chi Tiết Chủ Trọ</h1>
            <div className="space-y-6 ">
                {/* Hiển thị các trường thông tin trên cùng một dòng */}
                <div className="flex justify-around">
                    <div className="w-1/2 pr-4">
                        <strong className="text-lg font-medium inline-block">Họ Tên:</strong>
                        <p className="inline-block ml-2">{host.hoTen}</p>
                    </div>
                    <div className="w-1/2 pl-4">
                        <strong className="block text-lg font-medium inline-block">Email:</strong>
                        <p className="inline-block ml-2">{host.email}</p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="w-1/2 pr-4">
                        <strong className="block text-lg font-medium inline-block">Số Điện Thoại:</strong>
                        <p className="inline-block ml-2">{host.SDT}</p>
                    </div>
                    <div className="w-1/2 pl-4">
                        <strong className="block text-lg font-medium inline-block">Giới Tính:</strong>
                        <p className="inline-block ml-2">{host.gioiTinh}</p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="w-1/2 pr-4">
                        <strong className="block text-lg font-medium inline-block">Trạng Thái:</strong>
                        <p className={`text-lg font-medium inline-block ml-2 ${host.trangThai ? 'text-green-800' : 'text-red-800'}`}>
                            {host.trangThai ? 'Đã duyệt' : 'Chờ duyệt'}
                        </p>
                    </div>
                    <div className="w-1/2 pl-4">
                        <strong className="block text-lg font-medium inline-block">CCCD:</strong>
                        <p className="inline-block ml-2">{host.CCCD}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <div className="w-1/2">
                            <strong className="block text-lg font-medium">Ảnh CCCD Mặt Trước:</strong>
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${host.anhCCCDMatTruoc}`}
                                alt="CCCD Mặt Trước"
                                className="w-60 h-40 object-cover rounded-lg shadow-md"
                            />
                        </div>

                        <div className="w-1/2 pl-4">
                            <strong className="block text-lg font-medium" >Ảnh CCCD Mặt Sau:</strong>
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${host.anhCCCDMatSau}`}
                                alt="CCCD Mặt Sau"
                                className="w-60 h-40 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex justify-evenly">
                    <button
                        onClick={handleReject}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleApprove}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Phê Duyệt
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ApproveHostDetail;
