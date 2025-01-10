import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';  // Nhập module Navigation
import * as service from "../../services";
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import slide1 from "../../assets/slide1.jpg"
import slide2 from "../../assets/slide2.png"
import slide3 from "../../assets/slide3.jpg"
import DOMPurify from 'dompurify';

const HomePage = () => {

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [blogLoading, setBlogLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await service.apiRoomLasted();
                if (response.data.err === 0) {
                    setRooms(response.data.result);
                } else {
                    console.error('Failed to fetch rooms');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();

        // // Gọi lại fetchRooms mỗi 10 giây
        // const intervalId = setInterval(fetchRooms, 1000);

        // // Cleanup
        // return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await service.apiGetBlogLasted();
                if (response.data.err === 0) {
                    setBlogs(response.data.result);
                } else {
                    console.error('Failed to fetch blogs');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setBlogLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div>
            <div className="py-12 px-4 text-center">
                <h2 className="text-3xl font-semibold mb-4 text-secondary2">Chào mừng đến với hệ thống cho thuê nhà trọ sinh viên tại Đà Nẵng</h2>
                <p className="text-m text-justify text-black">
                    Chúng tôi cung cấp giải pháp tìm kiếm và đặt phòng trọ nhanh chóng và tiện lợi cho sinh viên tại Đà Nẵng.
                    Trang web của chúng tôi giúp bạn dễ dàng tìm được nơi ở phù hợp với giá cả phải chăng, vị trí thuận tiện và dịch vụ chất lượng.
                    Hãy khám phá các phòng trọ và chọn lựa ngôi nhà lý tưởng của bạn ngay hôm nay!
                </p>
            </div>

            {/* Slider đầu trang với Navigation */}
            <Swiper
                spaceBetween={10} // Khoảng cách giữa các slide
                slidesPerView={1} // Hiển thị một slide tại một thời điểm
                loop={true} // Cho phép vòng lặp
                autoplay={{ delay: 2500, disableOnInteraction: false }} // Tự động chuyển slide sau 2.5 giây
                navigation={true} // Bật navigation (nút next/prev)
                scrollbar={true}
                modules={[Navigation, Scrollbar, A11y, Autoplay]}
                className="relative w-[900px] h-[300px] md:h-[300px]" // Tailwind class để thiết lập chiều cao
            >
                <SwiperSlide>
                    <img
                        src={slide1}
                        alt="Slide 1"
                        className="w-full h-full object-cover rounded-md shadow-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src={slide2}
                        alt="Slide 2"
                        className="w-full h-full object-cover rounded-md shadow-lg"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        src={slide3}
                        alt="Slide 3"
                        className="w-full h-full object-cover rounded-md shadow-lg"
                    />
                </SwiperSlide>
            </Swiper>

            {/* Danh sách phòng trọ */}
            <h2 className="text-2xl font-semibold text-secondary2 my-6">Phòng trọ mới đăng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white p-4">
                {blogLoading ? (
                    <p>Đang tải...</p>
                ) : (
                    rooms.map((room) => (
                        <Link
                            key={room.id}
                            to={`/chi-tiet/${room.tenPhong}/${room.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <div>
                                <img
                                    src={`${process.env.REACT_APP_SERVER_URL}${room.anh}`}
                                    alt={room.tenPhong}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 text-blue-500">{room.tenPhong}</h3>
                                    <div className="flex justify-between py-2">
                                        <p className="text-gray-600 text-green-500">{room.gia}/tháng</p>
                                        <p className="text-gray-600">{room.dienTich}m²</p>
                                    </div>
                                    <p className="text-red-500 font-semibold py-2 text-sm">Còn trống {room.soLuongPhongTrong} phòng</p>
                                    <p className="text-gray-500 text-sm">{room.diaChi}</p>
                                </div>
                            </div>
                        </Link>
                    )))}
            </div>

            {/* Danh sách blog */}
            <h2 className="text-2xl font-semibold text-secondary2 my-6">Blog mới nhất</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-white p-4">
                {blogLoading ? (
                    <p>Đang tải...</p>
                ) : (
                    blogs.slice(0, 6).map((blog) => (
                        <Link
                            to={`/chi-tiet-blog/${blog.id}`}
                            key={blog.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <img
                                src={`${process.env.REACT_APP_SERVER_URL}${blog.anh}`}
                                alt={blog.tieuDe}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{blog.tieuDe}</h3>
                                <div
                                    className="text-gray-600 text-sm line-clamp-3"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(blog?.noiDung),
                                    }}
                                />
                            </div>
                        </Link>
                    )))}
            </div>
        </div>
    );
}

export default HomePage;
