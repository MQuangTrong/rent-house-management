import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from 'react-icons/fa';
import * as services from '../../services';
import { FormInput } from "../../components"
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { path } from "../../ultils/constant";

const MySwal = withReactContent(Swal);

const BookingList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentData } = useSelector(state => state.user);
    const [invalidFields, setInvalidFields] = useState([]);
    const navigate = useNavigate()
    const [payload, setPayLoad] = useState({
        hoTen: currentData?.hoTen || '',
        email: currentData?.email || '',
        SDT: currentData?.SDT || '',
        CCCD: currentData?.CCCD || '',
        gioiTinh: currentData?.gioiTinh ? "Nu" : "Nam" || 'Nam',
        anhCCCDMatTruoc: currentData?.anhCCCDMatTruoc || null,
        anhCCCDMatSau: currentData?.anhCCCDMatSau || null,
    });

    useEffect(() => {
        const fetchCartDetails = async () => {
            try {
                const response = await services.apiCartDetail();
                if (response.data.err === 0) {
                    setRooms(response.data.result);
                } else {
                    toast.error(response.data.msg);
                }
            } catch (error) {
                toast.error("Failed to fetch cart details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartDetails();
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === id ? { ...room, soLuong: Math.max(newQuantity, 1) } : room
            )
        );
    };

    const handleMonthsChange = (id, newMonths) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === id ? { ...room, thoiGianThue: Math.max(newMonths, 1) } : room
            )
        );
    };

    const calculateTotal = () => {
        return rooms?.reduce(
            (total, room) => total + room.tienCoc * room.soLuong,
            0
        );
    };

    const handleBooking = async () => {
        try {
            // Gửi yêu cầu API lưu thông tin đặt phòng
            const bookingData = {
                userInfo: payload,
                rooms: rooms.map(room => ({
                    roomId: room.maPhongTro,
                    soLuong: room.soLuong,
                    thoiGianThue: room.thoiGianThue,
                })),
                totalAmount: calculateTotal(),
                bookingId: rooms[0]?.maDatPhong

            };

            const response = await services.apiCreateBooking(bookingData);

            if (response.data.err === 0) {
                // Gọi API thanh toán VNPAY
                const paymentData = {
                    totalAmount: calculateTotal(),
                    bookingId: rooms[0]?.maDatPhong,
                };
                const paymentResponse = await services.apiVnpayPayment(paymentData);

                if (paymentResponse.data.err === 0) {
                    // Chuyển hướng sang trang thanh toán VNPAY
                    window.location.href = paymentResponse.data.vnpUrl; // Redirect to VNPAY payment page
                } else {
                    toast.error(paymentResponse.data.msg);
                }
            } else {
                toast.error(response.data.msg);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi đặt phòng.");
        }
    };

    const handleBookingNow = () => {
        navigate(`/${path.ROOM}`)
    };

    const handleRemoveRoom = async (id) => {
        const result = await MySwal.fire({
            title: "Xác nhận xóa phòng trọ",
            text: `Bạn có chắc chắn muốn xóa phòng trọ này?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const response = await services.apiDeleteCartDetail(id);
                if (response.data.err === 0) {
                    toast.success(response.data.msg)
                    const roomUpdate = await services.apiCartDetail();
                    setRooms(roomUpdate.data.result);
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa.');
            }
        }
    };


    const handleCCCDMatTruocChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('anhCCCDMatTruoc', file);

            try {
                const response = await services.apiUploadImageCCCD(formData);
                if (response.data.err === 0) {
                    const uploadedFilePath = response.data.filePath;
                    setPayLoad((prevState) => ({
                        ...prevState,
                        anhCCCDMatTruoc: uploadedFilePath,
                    }))
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi upload ảnh.');
            }
        }
    };

    const handleCCCDMatSauChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('anhCCCDMatSau', file);

            try {
                const response = await services.apiUploadImageCCCDBack(formData);
                if (response.data.err === 0) {
                    const uploadedFilePath = response.data.filePath;
                    setPayLoad((prevState) => ({
                        ...prevState,
                        anhCCCDMatSau: uploadedFilePath,
                    }))
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi upload ảnh.');
            }
        }
    };

    return (
        <div className="w-full mt-8">
            {/* Danh sách đặt phòng */}
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md ">
                {loading ? (
                    <div className="text-center py-4">Đang tải dữ liệu...</div>
                ) : rooms?.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-center text-secondary2">Danh sách đặt tạm</h2>
                        <table className="w-full table-auto bg-white shadow-md rounded-lg">
                            <thead className="bg-secondary2 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">Phòng Trọ</th>
                                    <th className="px-4 py-2 text-left">Tiền Phòng</th>
                                    <th className="px-4 py-2 text-left">Tiền Cọc</th>
                                    <th className="px-4 py-2 text-left">Số Lượng</th>
                                    <th className="px-4 py-2 text-left">Số Tháng Thuê</th>
                                    <th className="px-4 py-2 text-left">Tổng Tiền</th>
                                    <th className="px-4 py-2 text-left">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>

                                {rooms?.map((room) => (
                                    <tr key={room.id} className="border-t">
                                        <td className="px-4 py-2 flex items-center">
                                            <img
                                                src={`${process.env.REACT_APP_SERVER_URL}${room.anh}` || null}
                                                alt={room.tenPhong}
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                            <span className="block truncate w-44">{room.tenPhong}</span>
                                        </td>
                                        <td className="px-4 py-2 text-black">{room.gia}<span className="text-sm align-top">đ</span></td>
                                        <td className="px-4 py-2 text-green-600 font-semibold">{room.tienCoc}<span className="text-sm align-top">đ</span></td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleQuantityChange(room.id, room.soLuong - 1)}
                                                    className="px-2 border border-gray-300"
                                                    disabled={room.soLuong <= 1}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={room.soLuong}
                                                    onChange={(e) =>
                                                        handleQuantityChange(room.id, parseInt(e.target.value, 10))
                                                    }
                                                    className="w-10 border border-gray-300 text-center"
                                                    min="1"
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(room.id, room.soLuong + 1)}
                                                    className="px-2 border border-gray-300"
                                                    disabled={room.soLuong >= room.soLuongPhongTrong}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleMonthsChange(room.id, room.thoiGianThue - 1)}
                                                    className="px-2 border border-gray-300"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={room.thoiGianThue}
                                                    onChange={(e) =>
                                                        handleMonthsChange(room.id, parseInt(e.target.value, 10))
                                                    }
                                                    className="w-10 border border-gray-300 text-center m-0"
                                                    min="1"
                                                />
                                                <button
                                                    onClick={() => handleMonthsChange(room.id, room.thoiGianThue + 1)}
                                                    className="px-2 border border-gray-300"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-red-500 font-semibold">
                                            {(room.tienCoc * room.soLuong)}<span className="text-sm align-top">đ</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleRemoveRoom(room.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>
                        <div className="text-center py-4 text-gray-500 font-semibold text-xl w-full">
                            Không có phòng nào
                        </div>
                        <button
                            onClick={handleBookingNow}
                            className="bg-secondary2 text-white font-bold py-3 px-6 rounded-lg hover:opacity-80 mx-auto block"
                        >
                            Đặt phòng ngay
                        </button>
                    </div>
                )}
            </div>

            {/* Thông tin người đặt */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-secondary2">Thông Tin Đặt Phòng</h2>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Họ và tên'}
                        value={payload.hoTen}
                        setValue={setPayLoad}
                        keyName="hoTen"
                        type="text"
                    />
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Email'}
                        value={payload.email}
                        setValue={setPayLoad}
                        keyName="email"
                        type="email"
                        readOnly={true}
                    />
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'SDT'}
                        value={payload.SDT}
                        setValue={setPayLoad}
                        keyName="SDT"
                        type="text"
                    />
                    <FormInput
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        label={'Căn cước công dân'}
                        value={payload.CCCD}
                        setValue={setPayLoad}
                        keyName="CCCD"
                        type="text"
                    />
                    {/* Ảnh CCCD Mặt Trước */}
                    <div className="flex flex-col gap-2">
                        <div className="w-full mb-4 text-left">
                            <span className="block text-secondary2 font-medium mb-2">Ảnh CCCD Mặt Trước</span>
                        </div>
                        <div className="relative mb-4 flex m-auto w-full pr-40">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${payload.anhCCCDMatTruoc}` || null}
                                alt="CCCD Mặt Trước"
                                className="w-full h-60 object-cover rounded-md border-2 border-gray-300"
                            />
                            <label className="absolute bottom-0 right-40 bg-yellow-400 rounded-full p-4 cursor-pointer">
                                <FaCamera className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCCCDMatTruocChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Ảnh CCCD Mặt Sau */}
                    <div className="flex flex-col gap-2">
                        <div className="w-full mb-4 text-left">
                            <span className="block text-secondary2 font-medium mb-2">Ảnh CCCD Mặt Sau</span>
                        </div>
                        <div className="relative mb-4 flex m-auto w-full pr-40">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${payload.anhCCCDMatSau}` || null}
                                alt="CCCD Mặt Sau"
                                className="w-full h-60 object-cover rounded-md border-2 border-gray-300"
                            />
                            <label className="absolute bottom-0 right-40 bg-yellow-400 rounded-full p-4 cursor-pointer">
                                <FaCamera className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCCCDMatSauChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tổng tiền và nút Đặt Phòng */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-secondary2">Tổng tiền cọc: <span className="text-red-500 font-bold">{calculateTotal()?.toLocaleString()} VNĐ</span> </h2>
                <button
                    onClick={handleBooking}
                    className="bg-secondary2 text-white font-bold py-3 px-6 rounded-lg hover:opacity-80"
                >
                    Đặt phòng
                </button>
            </div>
        </div>
    );
};

export default BookingList;
