import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, userNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import * as service from '../../services';
import 'swiper/css';
import 'swiper/css/navigation';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhoneAlt } from 'react-icons/fa';
import { SidebarRoom } from '../../components';
import DOMPurify from 'dompurify';


const RoomDetail = () => {
    const { id } = useParams();
    const [room, setRoom] = useState([]);
    const [roomsLasted, setRoomsLasted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const swiperRef = useRef(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRoomDetail = async () => {
            try {
                const response = await service.apiRoomDetail(id);
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

    useEffect(() => {
        const fetchRoomsLasted = async () => {
            try {
                const response = await service.apiRoomLasted();
                if (response && response.data.err === 0) {
                    setRoomsLasted(response.data.result);
                } else {
                    setError('Không có phòng');
                }
            } catch (err) {
                setError('Đã xảy ra lỗi khi lấy dữ liệu.');
            }
        };

        fetchRoomsLasted();
    }, []);

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

    const handleOpenModal = (image) => {
        setModalImage(image);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Xử lý khi ấn nút "Thêm vào danh sách tạm đặt"
    const handleAddToCart = async () => {
        try {
            const payload = {
                maPhongTro: room.id, // Lấy ID phòng hiện tại
                soLuong: 1, // Số lượng phòng (có thể thay đổi nếu cần)
            };

            // Gọi API để thêm phòng vào giỏ hàng
            const response = await service.apiAddRoomToCart(payload);
            if(response.data.err === 0) {
                toast.success(response.data.msg)
                navigate("/danh-sach-dat-phong")
            }
            else {
                toast.error(response.data.msg)
            }
        } catch (error) {
            setError('Đã có lỗi xảy ra khi thêm phòng vào giỏ hàng');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex gap-8 bg-white p-6 rounded-lg shadow-lg">
                <div className="w-2/3">
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
                                        onClick={() => handleOpenModal(`${process.env.REACT_APP_SERVER_URL}${a}`)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-4">
                        {room?.anh?.map((a, index) => (
                            <img
                                key={index}
                                src={`${process.env.REACT_APP_SERVER_URL}${a}`}
                                alt={`Room ${index}`}
                                className={`w-full h-20 object-cover rounded-lg cursor-pointer ${currentImageIndex === index ? 'border-4 border-red-500' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-1/3 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-secondary2 mb-4">{room?.tenPhong}</h2>
                        <div className="text-lg text-gray-700 space-y-2">
                            <p><span className='text-secondary2 font-semibold'>Giá phòng:</span> <span className='text-green-600'> {room?.gia} VND</span></p>
                            <p><span className='text-secondary2 font-semibold'>Diện tích:</span>  <span className='text-gray-500'> {room?.dienTich} m²</span></p>
                            <p><span className='text-secondary2 font-semibold'>Giá cọc:</span> <span className='text-green-600'> {room?.tienCoc} VND</span></p>
                            <p className="text-red-500 font-semibold py-2">Còn trống {room.soLuongPhongTrong} phòng</p>
                            <p><span className='text-secondary2 font-semibold'>Địa chỉ:</span> <span className='text-black'> {room?.diaChi}</span></p>
                        </div>
                    </div>

                    {/* Nút thêm vào danh sách tạm đặt */}
                    <div className="mt-4">
                        <button
                            className="w-full px-6 py-3 bg-secondary2 text-white rounded-lg shadow-lg hover:opacity-80"
                            onClick={handleAddToCart}
                        >
                            Thêm vào danh sách tạm đặt
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseModal}>
                    <div className="relative">
                        <img
                            src={modalImage}
                            alt="Full Screen"
                            className="w-[90vw] h-[90vh] object-contain rounded-lg shadow-lg shadow-black/80"
                        />
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-white text-2xl font-bold"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-8">
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
                                __html: DOMPurify.sanitize(room?.moTa),
                            }}
                        />
                    </div>
                </div>

                <div className="bg-secondary1 p-4">
                    <p className="font-semibold text-lg mb-4">Phòng trọ mới nhất</p>
                    {roomsLasted.slice(0, 5).map((room) => (
                        <SidebarRoom key={room.id} room={room} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
