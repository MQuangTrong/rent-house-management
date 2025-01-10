import db from '../models'
import Sequelize from 'sequelize'
const { Op } = require('sequelize');

// Service trả về thống kê người dùng và bài đăng
export const getGeneralStatisticsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tổng số người dùng (trừ admin) và phân loại chủ trọ, người dùng
            const userStats = await db.NguoiDung.findAll({
                where: {
                    daKhoa: false, // Lọc người dùng chưa bị khóa
                    maPhanQuyen: { // Giả sử '1' là admin, còn lại là người dùng bình thường
                        [Sequelize.Op.ne]: 1
                    }
                }
            });

            const userCounts = {
                chuTro: userStats.filter(user => user.maChuTro).length, // Tính số lượng chủ trọ
                nguoiDung: userStats.filter(user => !user.maChuTro).length, // Tính số lượng người dùng
            };

            // Lấy tổng số bài đăng phòng trọ theo trạng thái
            const postStats = await db.PhongTro.count({
                attributes: [
                    'trangThai',
                ],
                where: {
                    daXoa: false // Lọc các bài đăng không bị xóa
                },
                group: ['trangThai']
            });

            const postCounts = {
                'Hoạt động': 0,
                'Đã hủy': 0,
                'Chờ duyệt': 0,
                'Hết phòng': 0
            };

            postStats.forEach(post => {
                postCounts[post.trangThai] = post.count;
            });

            resolve({
                err: 0,
                msg: "ok",
                userCounts,
                postCounts
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getRevenueByMonthAndYearService = ({ year, month}, id) => 
  new Promise(async (resolve, reject) => {
    try {
      let whereCondition = {};

      if (month) {
        const startOfMonth = new Date(year, month - 1, 1); // Ngày đầu tháng
        const endOfMonth = new Date(year, month, 0); // Ngày cuối tháng
        whereCondition.ngayDat = {
          [Op.gte]: startOfMonth,
          [Op.lt]: new Date(endOfMonth.getTime() + 24 * 60 * 60 * 1000), // Ngày kế tiếp
        };
      } else {
        const startOfYear = new Date(year, 0, 1); // Ngày đầu năm
        const endOfYear = new Date(year, 11, 31); // Ngày cuối năm
        whereCondition.ngayDat = {
          [Op.gte]: startOfYear,
          [Op.lt]: new Date(endOfYear.getTime() + 24 * 60 * 60 * 1000), // Ngày kế tiếp
        };
      }

      const user = await db.NguoiDung.findOne({
        where: {id}
      })

      const revenueData = await db.ChiTietDatPhong.findAll({
        where: {
          ...whereCondition,
          trangThai: {
            [Op.ne]: "Đang chờ xác nhận"
          } 
        },
        include: [
          {
            model: db.DatPhong,
            as: 'datPhong',
            where: { trangThai: 'Đã thanh toán' },
          },
          {
            model: db.PhongTro,
            as: 'phongTro',
            where: {maChuTro: user.maChuTro}
          },
        ],
      });

      let totalRevenue = 0;
      const dailyData = {};
      const monthlyData = {};

      revenueData.forEach((chiTiet) => {
        const date = new Date(chiTiet.ngayDat);
        const day = date.getDate();
        const month = date.getMonth() + 1;

        totalRevenue += chiTiet.soLuong * chiTiet.phongTro.giaPhong;

        if (!dailyData[day]) dailyData[day] = 0;
        dailyData[day] += chiTiet.soLuong * chiTiet.phongTro.giaPhong;

        if (!monthlyData[month]) monthlyData[month] = 0;
        monthlyData[month] += chiTiet.soLuong * chiTiet.phongTro.giaPhong;
      });

      resolve({
        totalRevenue,
        dailyData: month ? Object.entries(dailyData) : null,
        monthlyData: month ? null : Object.entries(monthlyData),
      });
    } catch (error) {
      reject(error);
    }
  });