import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import * as service from '../../services';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaPhoneAlt } from 'react-icons/fa';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from 'dompurify';

const PostDetail = () => {
    const { id } = useParams();
    const [room, setRoom] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const swiperRef = useRef(null); // Tham chiếu đến Swiper instance
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRoomDetail = async () => {
            try {
                const response = await service.apiPostDetail(id);
                if (response.data.err === 0) {
                    setRoom(response.data.result);
                } else {
                    setError('Không tìm thấy phòng');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi lấy dữ liệu phòng');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetail();
    }, [id]);

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn phê duyệt lại bài đăng này?',
            text: "Bạn sẽ không thể phục hồi hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Phê duyệt',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            try {
                const response = await service.apiApprovePost(id);
                if (response.data.err === 0) {
                    if (response.data.msg.includes("Bài đăng đã được phê duyệt thành công")) {
                        toast.success(response.data.msg);
                        navigate(-1)
                    } else {
                        toast.error(response.data.msg);
                    }
                } else {
                    console.error('Failed to approve host');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        swiperRef.current.swiper.slideTo(index);
    };

    const getStatusColor = (status) => {
        if (status === 'Hoạt động') return 'text-green-600';
        if (status === 'Đã hủy') return 'text-red-600';
        return 'text-gray-500';
    };

    const handleBackClick = () => {
        navigate(-1); // Điều hướng về trang trước đó
    };


    return (
        <div className="container mx-auto p-6 w-[800px]">
            {/* Nút Trở về */}
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
            {/* Card chứa ảnh và thông tin phòng */}
            <div className="gap-8 bg-white p-6 rounded-lg shadow-lg">
                {/* Phần trái: Ảnh */}
                <div className="">
                    <div className="relative">
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            modules={[Navigation, A11y]}
                            className="room-swiper"
                            initialSlide={currentImageIndex}
                            onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                            ref={swiperRef}
                        >
                            {room?.anh?.map((a, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={`${process.env.REACT_APP_SERVER_URL}${a}`}
                                        alt={`Room Image ${index + 1}`}
                                        className="w-full h-80 object-cover rounded-lg shadow-lg"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Danh sách các ảnh nhỏ */}
                    <div className="mt-4 grid grid-cols-4 gap-4">
                        {room?.anh?.map((a, index) => (
                            <img
                                key={index}
                                src={`${process.env.REACT_APP_SERVER_URL}${a}`}
                                alt={`Room ${index}`}
                                className={`w-full h-20 object-cover rounded-lg cursor-pointer ${currentImageIndex === index ? 'border-4 border-red-500' : ''
                                    }`}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Phần phải: Thông tin phòng */}
                <div className="flex flex-col justify-between mt-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-secondary2 mb-4">{room?.tenPhong}</h2>
                        <div className="text-lg  text-gray-700 space-y-2">
                            <p><span className='text-secondary2 font-semibold'>Giá phòng:</span> <span className='text-green-600'> {room?.gia} VND</span> </p>
                            <p><span className='text-secondary2 font-semibold'>Trạng thái:</span> <span className={getStatusColor(room?.trangThai)}>{room?.trangThai}</span></p>
                            <p><span className='text-secondary2 font-semibold'>Diện tích:</span>  <span className='text-gray-500'> {room?.dienTich} m²</span></p>
                            <p><span className='text-secondary2 font-semibold'>Giá cọc:</span> <span className='text-green-600'> {room?.tienCoc} VND</span></p>
                            <p className="text-red-500 font-semibold py-2">Còn trống {room.soLuongPhongTrong} phòng</p>
                            <p><span className='text-secondary2 font-semibold'>Địa chỉ:</span> <span className='text-black'> {room?.diaChi}</span></p>
                        </div>
                    </div>

                    {/* Nút phê duyệt chỉ hiển thị khi trạng thái là "Đã hủy" */}
                    {room?.trangThai === 'Đã hủy' && (
                        <button
                            onClick={() => handleApprove(room.id)}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                            Phê duyệt lại
                        </button>
                    )}
                </div>
            </div>

            {/* Phần dưới */}
            <div className="mt-8 gap-8">
                {/* Bên trái: Thông tin chủ nhà và thông tin phòng trọ */}
                <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
                    <div className="items-center gap-4 bg-secondary2 p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-white pb-4">Thông tin chủ trọ</h3>
                        <div className="flex gap-8">
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${room?.avatar}`}
                                alt="Avatar Chủ nhà"
                                className="w-20 h-20 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{room?.hoTen}</h3>
                                <div className="flex items-center gap-2 bg-[#0D6EFD] text-white px-4 py-2 rounded-lg mt-2">
                                    <FaPhoneAlt />
                                    <span>{room?.SDT}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-primary">Thông tin phòng trọ</h3>
                        <div
                            className="description"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(room?.moTa)
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
