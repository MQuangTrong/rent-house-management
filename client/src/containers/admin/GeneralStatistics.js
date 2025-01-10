import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import * as services from "../../services"; // Đảm bảo đã export đúng API từ service

const GeneralStatistics = () => {
    const [userStatistics, setUserStatistics] = useState([
        ['Tài khoản', 'Số lượng'],
        ['Chủ trọ', 0],  // Mặc định 0
        ['Người dùng', 0], // Mặc định 0
    ]);

    const [postStatistics, setPostStatistics] = useState([
        ['Trạng thái', 'Số lượng'],
        ['Hoạt động', 0],
        ['Đã hủy', 0],
        ['Chờ duyệt', 0],
        ['Hết phòng', 0],
    ]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await services.apiGeneralStatistic();
                if (response?.data?.err === 0) {
                    const userData = response.data.userCounts;
                    const postData = response.data.postCounts;

                    // Cập nhật dữ liệu thống kê người dùng
                    setUserStatistics([
                        ['Tài khoản', 'Số lượng'],
                        ['Chủ trọ', userData.chuTro],
                        ['Người dùng', userData.nguoiDung],
                    ]);

                    // Cập nhật dữ liệu thống kê bài đăng
                    setPostStatistics([
                        ['Trạng thái', 'Số lượng'],
                        ['Hoạt động', postData['Hoạt động'] || 0],
                        ['Đã hủy', postData['Đã hủy'] || 0],
                        ['Chờ duyệt', postData['Chờ duyệt'] || 0],
                        ['Hết phòng', postData['Hết phòng'] || 0],
                    ]);
                }
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Thống Kê Tổng Quan</h1>

            {/* Biểu đồ tài khoản người dùng */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Thống kê tài khoản người dùng</h3>
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={userStatistics}
                    options={{
                        title: 'Tỷ lệ tài khoản người dùng',
                        slices: {
                            0: { offset: 0.1 },  // Tùy chỉnh cho chủ trọ
                            1: { offset: 0.1 }   // Tùy chỉnh cho người dùng
                        }
                    }}
                />
            </div>

            {/* Biểu đồ bài đăng phòng trọ */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Thống kê bài đăng phòng trọ</h3>
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={postStatistics}
                    options={{
                        title: 'Tỷ lệ bài đăng phòng trọ',
                        slices: {
                            0: { offset: 0.1, color: '#32CD32' }, // Hoạt động - Màu xanh lá
                            1: { offset: 0.1, color: '#FF6347' }, // Đã hủy - Màu đỏ
                            2: { offset: 0.1, color: '#FFD700' }, // Chờ duyệt - Màu vàng
                            3: { offset: 0.1, color: '#808080' }, // Hết phòng - Màu xám
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default GeneralStatistics;
