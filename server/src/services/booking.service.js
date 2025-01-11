import db from '../models';
const moment = require('moment');
const { Op } = require('sequelize');

export const addRoomToCardService = (body, id) => new Promise(async (resolve, reject) => {
    const { maPhongTro, soLuong } = body;
    try {

        // Nếu người dùng đã đăng nhập, kiểm tra giỏ hàng trong database
        let datPhong = await db.DatPhong.findOne({
            where: {
                maNguoiDung: id,
                trangThai: 'Đang chờ', // Giỏ hàng chưa thanh toán
            },
        });

        // Nếu chưa có giỏ hàng, tạo mới
        if (!datPhong) {
            datPhong = await db.DatPhong.create({
                maNguoiDung: id,
                trangThai: 'Đang chờ',
            });
        }

        // Lấy thông tin phòng trọ
        const phongTro = await db.PhongTro.findOne({
            where: {
                id: maPhongTro,
            },
        });

        if (!phongTro) {
            resolve({
                err: 1,
                msg: 'Phòng trọ không tồn tại',
            });
        }

        // Kiểm tra số lượng phòng trống
        if (soLuong > phongTro.soLuongPhongTrong) {
            resolve({
                err: 1,
                msg: 'Số lượng phòng yêu cầu vượt quá số lượng phòng trống',
            });
        }

        // Kiểm tra nếu phòng đã có trong giỏ hàng, chỉ cần cập nhật số lượng
        const existingRoom = await db.ChiTietDatPhong.findOne({
            where: {
                maDatPhong: datPhong.id,
                maPhongTro,
            },
        });

        if (existingRoom) {
            const updatedQuantity = existingRoom.soLuong + soLuong;

            if (updatedQuantity > phongTro.soLuongPhongTrong) {
                existingRoom.soLuong = phongTro.soLuongPhongTrong;
                await existingRoom.save();
                resolve({
                    err: 1, // Không có lỗi
                    msg: `Số lượng yêu cầu vượt quá số lượng phòng trống. Số lượng đã được điều chỉnh về ${phongTro.soLuongPhongTrong}`,
                    data: existingRoom,
                });
            } else {
                // Cập nhật số lượng phòng trong giỏ hàng nếu không vượt quá số lượng phòng trống
                existingRoom.soLuong = updatedQuantity;
                await existingRoom.save();
                resolve({
                    err: 0,
                    msg: 'Giỏ hàng đã được cập nhật thành công.',
                    data: existingRoom,
                });
            }
        } else {
            // Thêm phòng mới vào giỏ
            await db.ChiTietDatPhong.create({
                maDatPhong: datPhong.id,
                maPhongTro,
                soLuong,
                ngayDat: new Date(),
                trangThai: "Chờ duyệt",
                thoiGianThue: 1
            });
        }

        resolve({
            err: 0,
            msg: 'Phòng đã được thêm vào danh sách',
            data: datPhong,
        });

    } catch (error) {
        reject(error);
    }
});

export const getCartDetailsService = (id) => new Promise(async (resolve, reject) => {
    try {
        const cart = await db.DatPhong.findOne({
            where: {
                maNguoiDung: id,
                trangThai: "Đang chờ"
            },
            include: [
                {
                    model: db.ChiTietDatPhong,
                    as: "chiTietDatPhongs", // Alias đã khai báo trong model
                    include: [
                        {
                            model: db.PhongTro,
                            as: "phongTro", // Alias đã khai báo trong model
                            attributes: ["tenPhong", "giaPhong", "diaChi", "dienTich", "tienCoc", "maPhuong", "soLuongPhong", "soLuongPhongTrong"],
                            include: [
                                {
                                    model: db.Phuong,
                                    as: "phuong", // Alias đã khai báo trong model
                                    attributes: ["tenPhuong"],
                                    include: [
                                        {
                                            model: db.Quan,
                                            as: "quan", // Alias đã khai báo trong model
                                            attributes: ["tenQuan"],
                                        }
                                    ]
                                },
                                {
                                    model: db.AnhTro,
                                    as: "anhTros",
                                    attributes: ["anh"],
                                },
                            ]
                        },
                    ],
                },
            ],
        });

        if (!cart || !cart.chiTietDatPhongs || cart.chiTietDatPhongs.length === 0) {
            return resolve({
                err: 1,
            });
        }
        const result = cart.chiTietDatPhongs.map((roomDetail) => {
            const id = roomDetail.id
            const soLuong = roomDetail.soLuong
            const thoiGianThue = roomDetail.thoiGianThue
            const room = roomDetail.phongTro;
            const maDatPhong = roomDetail.maDatPhong
            const maPhongTro = roomDetail.maPhongTro

            // Kiểm tra các giá trị trước khi truy cập
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong || 'N/A'}, ${room.phuong?.quan?.tenQuan || 'N/A'}`;

            return {
                id,
                soLuong,
                thoiGianThue,
                maDatPhong,
                maPhongTro,
                tenPhong: room.tenPhong,
                gia: room.giaPhong,
                tienCoc: room.tienCoc,
                dienTich: room.dienTich,
                anh: room.anhTros?.[0]?.anh || null,
                diaChi: fullAddress,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong
            };
        });


        resolve({
            err: 0,
            msg: "Lấy dữ liệu giỏ hàng thành công.",
            result
        });
    } catch (error) {
        console.error(error);  // Ghi lỗi để dễ dàng kiểm tra
        reject({ err: 1, msg: "Có lỗi xảy ra.", error });
    }
});

export const deleteCartDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const result = await db.ChiTietDatPhong.destroy({
            where: { id }
        });

        if (result > 0) {
            resolve({
                err: 0,
                msg: "Đã xóa thành công!"
            });
        } else {
            resolve({
                err: 1,
                msg: "Không tìm thấy phòng cần xóa."
            });
        }

    } catch (error) {
        reject({
            err: 2,
            msg: "Có lỗi xảy ra trong quá trình xóa.",
            error
        });
    }
})

export const createBookingService = (body) => new Promise(async (resolve, reject) => {
    const { userInfo, rooms, totalAmount, bookingId } = body;

    try {
        const user = await db.NguoiDung.findOne({
            where: { email: userInfo.email }
        });

        if (!user) {
            resolve({
                err: 1,
                msg: 'người dùng không tồn tại'
            })
        }

        await db.NguoiDung.update({
            hoTen: userInfo.hoTen,
            SDT: userInfo.SDT,
            CCCD: userInfo.CCCD,
            anhCCCDMatTruoc: userInfo.anhCCCDMatTruoc,
            anhCCCDMatSau: userInfo.anhCCCDMatSau
        }, { where: { id: user.id } })

        const booking = await db.DatPhong.findOne({ where: { id: bookingId, maNguoiDung: user.id } });

        if (!booking) {
            return resolve({
                err: 1,
                msg: 'Đơn đặt phòng không tồn tại hoặc không thuộc người dùng này'
            });
        }

        await booking.update({
            trangThai: 'Đã thanh toán',  // Trạng thái mới
            tongTien: totalAmount,          // Cập nhật tổng tiền
        });


        for (let room of rooms) {
            const existingRoomDetail = await db.ChiTietDatPhong.findOne({
                where: {
                    maDatPhong: booking.id,
                    maPhongTro: room.roomId
                }
            });

            if (existingRoomDetail) {
                // Cập nhật chi tiết phòng nếu đã có
                await existingRoomDetail.update({
                    soLuong: room.soLuong,
                    thoiGianThue: room.thoiGianThue,
                    trangThai: 'Đang chờ xác nhận',  // Trạng thái cho chi tiết phòng
                });
            }

            // Cập nhật bảng Phòng Trọ
            const phongTro = await db.PhongTro.findOne({
                where: { id: room.roomId }
            });

            if (phongTro) {
                const soLuongPhongTrongMoi = phongTro.soLuongPhongTrong - room.soLuong;

                await phongTro.update({
                    soLuongPhongTrong: soLuongPhongTrongMoi,
                    trangThai: soLuongPhongTrongMoi <= 0 ? 'Hết phòng' : phongTro.trangThai
                });
            }
        }

        resolve({
            err: 0,
            msg: 'Cập nhật đơn đặt phòng thành công',
            bookingId: booking.id,
            totalAmount
        });
    } catch (error) {
        reject(error)
    }
})

export const getBookingPendingApprovalService = (id) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: { id },
        })

        if (!user) {
            resolve({
                err: 1,
                msg: "Người dùng không tồn tại"
            });
        }

        const pendingBookings = await db.ChiTietDatPhong.findAll({
            where: {
                trangThai: 'Đang chờ xác nhận', // Trạng thái yêu cầu đang chờ xác nhận
            },
            include: [
                {
                    model: db.DatPhong,
                    as: 'datPhong',
                    include: [
                        {
                            model: db.NguoiDung,
                            as: 'nguoiDung',
                        },
                    ],
                },
                {
                    model: db.PhongTro,
                    as: 'phongTro',
                    attributes: ['tenPhong', 'giaPhong', 'moTa', 'maChuTro', "tienCoc"], // Thông tin phòng trọ
                    where: {
                        maChuTro: user.maChuTro, // Lọc theo chủ trọ
                    },
                    include: [
                        {
                            model: db.AnhTro,
                            as: 'anhTros',
                        }
                    ]
                },
            ],
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('ngayDat')), 'ngayDat'], 'soLuong', 'thoiGianThue', "trangThai", "id"
            ]
        })

        const result = pendingBookings.map((p) => {
            const ngayDat = moment(p.ngayDat);
            const ngayKetThuc = ngayDat.add(p.thoiGianThue, 'months').format('YYYY-MM-DD'); // Cộng thêm thời gian thuê
            return {
                id: p.id,
                hoTen: p.datPhong?.nguoiDung?.hoTen,
                email: p.datPhong?.nguoiDung?.email,
                SDT: p.datPhong?.nguoiDung?.SDT,
                CCCD: p.datPhong?.nguoiDung?.CCCD,
                gioiTinh: p.datPhong?.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
                anhCCCDMatTruoc: p.datPhong?.nguoiDung?.anhCCCDMatTruoc,
                anhCCCDMatSau: p.datPhong?.nguoiDung?.anhCCCDMatSau,
                tenPhong: p.phongTro?.tenPhong,
                giaPhong: p.phongTro?.giaPhong,
                tienCoc: p.phongTro?.tienCoc,
                anh: p.phongTro?.anhTros[0]?.anh,
                soLuong: p.soLuong,
                ngayDat: p.ngayDat, // Phần ngày đã được trích xuất từ `ngayDat`
                ngayKetThuc: ngayKetThuc, // Ngày kết thúc (ngày thuê)
                trangThai: p.trangThai,
            }
        })
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getBookedRoomService = (id) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: { id },
        });

        if (!user) {
            resolve({
                err: 1,
                msg: "Người dùng không tồn tại"
            });
        }

        const pendingBookings = await db.ChiTietDatPhong.findAll({
            where: {
                trangThai: {
                    [Op.in]: ['Hết hạn', 'Đã đặt'],
                }
            },
            include: [
                {
                    model: db.DatPhong,
                    as: 'datPhong',
                    include: [
                        {
                            model: db.NguoiDung,
                            as: 'nguoiDung',
                        },
                    ],
                },
                {
                    model: db.PhongTro,
                    as: 'phongTro',
                    attributes: ['tenPhong', 'giaPhong', 'moTa', 'maChuTro', "tienCoc"], // Thông tin phòng trọ
                    where: {
                        maChuTro: user.maChuTro, // Lọc theo chủ trọ
                    },
                    include: [
                        {
                            model: db.AnhTro,
                            as: 'anhTros',
                        }
                    ]
                },
            ],
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('ngayDat')), 'ngayDat'], 'soLuong', 'thoiGianThue', "trangThai", "id"
            ]
        });

        const today = moment().format('YYYY-MM-DD'); // Lấy ngày hôm nay

        const result = await Promise.all(pendingBookings.map(async (p) => {
            const ngayDat = moment(p.ngayDat);
            const ngayKetThuc = ngayDat.add(p.thoiGianThue, 'months').format('YYYY-MM-DD'); // Cộng thêm thời gian thuê

            // Kiểm tra nếu ngày kết thúc là hôm nay thì cập nhật trạng thái "Hết hạn"
            if (ngayKetThuc === today) {
                await p.update({
                    trangThai: 'Hết hạn'
                });
            }

            return {
                id: p.id,
                hoTen: p.datPhong?.nguoiDung?.hoTen,
                avatar: p.datPhong?.nguoiDung?.anh,
                email: p.datPhong?.nguoiDung?.email,
                SDT: p.datPhong?.nguoiDung?.SDT,
                CCCD: p.datPhong?.nguoiDung?.CCCD,
                gioiTinh: p.datPhong?.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
                anhCCCDMatTruoc: p.datPhong?.nguoiDung?.anhCCCDMatTruoc,
                anhCCCDMatSau: p.datPhong?.nguoiDung?.anhCCCDMatSau,
                tenPhong: p.phongTro?.tenPhong,
                giaPhong: p.phongTro?.giaPhong,
                tienCoc: p.phongTro?.tienCoc,
                anh: p.phongTro?.anhTros[0]?.anh,
                soLuong: p.soLuong,
                ngayDat: p.ngayDat, // Phần ngày đã được trích xuất từ `ngayDat`
                ngayKetThuc: ngayKetThuc, // Ngày kết thúc (ngày thuê)
                trangThai: p.trangThai,
            };
        }));

        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
});

export const approvalBookingService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.ChiTietDatPhong.update({
            trangThai: "Đã đặt"
        }, {
            where: {
                id
            }
        })

        resolve({
            err: 0,
            msg: 'Đã xác nhận đặt phòng thành công',
        });
    } catch (error) {
        reject(error)
    }
})

export const getHistoryService = (id) => new Promise(async (resolve, reject) => {
    try {
        const pendingBookings = await db.ChiTietDatPhong.findAll({
            include: [
                {
                    model: db.DatPhong,
                    as: 'datPhong',
                    where: {
                        maNguoiDung: id,
                    },
                },
                {
                    model: db.PhongTro,
                    as: 'phongTro',
                    include: [
                        {
                            model: db.AnhTro,
                            as: 'anhTros',
                            attributes: ['anh'],
                            order: [['id', 'ASC']],
                        },
                        {
                            model: db.ChuTro,
                            as: 'chuTro',
                            include: [
                                {
                                    model: db.NguoiDung,
                                    as: 'nguoiDung',
                                }
                            ]
                        }
                    ],
                },
            ],
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('ngayDat')), 'ngayDat'], 'soLuong', 'thoiGianThue', "trangThai", "id"
            ]
        });

        const today = moment().format('YYYY-MM-DD'); // Lấy ngày hôm nay

        const result = await Promise.all(pendingBookings.map(async (p) => {
            const ngayDat = moment(p.ngayDat);
            const ngayKetThuc = ngayDat.add(p.thoiGianThue, 'months').format('YYYY-MM-DD');

            return {
                id: p.id,
                hoTen: p.phongTro?.chuTro?.nguoiDung?.hoTen,
                SDT: p.phongTro?.chuTro?.nguoiDung?.SDT,
                maPhongTro: p.phongTro?.id,
                tenPhong: p.phongTro?.tenPhong,
                giaPhong: p.phongTro?.giaPhong,
                tienCoc: p.phongTro?.tienCoc,
                anh: p.phongTro?.anhTros[0]?.anh,
                soLuong: p.soLuong,
                ngayDat: p.ngayDat,
                ngayKetThuc: ngayKetThuc,
                trangThai: p.trangThai,
            };
        }));

        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
});

export const getHistoryDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const bookingDetail = await db.ChiTietDatPhong.findOne({
            where: {
                id
            },
            include: [
                {
                    model: db.PhongTro,
                    as: 'phongTro',
                    attributes: ['tenPhong', 'giaPhong', 'moTa', "tienCoc", "diaChi"], // Thông tin phòng trọ
                    include: [
                        {
                            model: db.AnhTro,
                            as: 'anhTros',
                        },
                        {
                            model: db.Phuong,
                            as: 'phuong',
                            include: [
                                {
                                    model: db.Quan,
                                    as: 'quan',
                                },
                            ]
                        },
                        {
                            model: db.ChuTro,
                            as: 'chuTro',
                            include: [
                                {
                                    model: db.NguoiDung,
                                    as: 'nguoiDung',
                                },
                            ],
                        },
                    ]
                },
            ],
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('ngayDat')), 'ngayDat'], 'soLuong', 'thoiGianThue', "trangThai", "id"
            ]
        })

        const ngayDat = moment(bookingDetail.ngayDat);
        const ngayKetThuc = ngayDat.add(bookingDetail.thoiGianThue, 'months').format('YYYY-MM-DD'); // Cộng thêm thời gian thuê
        const fullAddress = `${bookingDetail.phongTro?.diaChi}, ${bookingDetail.phongTro?.phuong?.tenPhuong}, ${bookingDetail.phongTro?.phuong?.quan?.tenQuan}`;

        const result = {
            id: bookingDetail.id,
            hoTen: bookingDetail.phongTro?.chuTro?.nguoiDung?.hoTen,
            email: bookingDetail.phongTro?.chuTro?.nguoiDung?.email,
            SDT: bookingDetail.phongTro?.chuTro?.nguoiDung?.SDT,
            CCCD: bookingDetail.phongTro?.chuTro?.nguoiDung?.CCCD,
            gioiTinh: bookingDetail.phongTro?.chuTro?.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
            anhCCCDMatTruoc: bookingDetail.phongTro?.chuTro?.nguoiDung?.anhCCCDMatTruoc,
            anhCCCDMatSau: bookingDetail.phongTro?.chuTro?.nguoiDung?.anhCCCDMatSau,
            tenPhong: bookingDetail.phongTro?.tenPhong,
            giaPhong: bookingDetail.phongTro?.giaPhong,
            tienCoc: bookingDetail.phongTro?.tienCoc,
            anh: bookingDetail.phongTro?.anhTros[0]?.anh,
            diaChi: fullAddress,
            soLuong: bookingDetail.soLuong,
            ngayDat: bookingDetail.ngayDat, // Phần ngày đã được trích xuất từ `ngayDat`
            ngayKetThuc: ngayKetThuc, // Ngày kết thúc (ngày thuê)
            trangThai: bookingDetail.trangThai,
        }
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const finishBookingService = (id) => new Promise(async (resolve, reject) => {
    try {
        const detailBooking = await db.ChiTietDatPhong.findOne({
            where: {
                id
            }
        })

        detailBooking.update({
            trangThai: "Kết thúc"
        })

        const room = await db.PhongTro.findOne({
            where: { id: detailBooking.maPhongTro }
        })

        const newQuantity = room.soLuongPhongTrong + detailBooking.soLuong
        room.update({
            soLuongPhongTrong: newQuantity
        })

        resolve({
            err: 0,
            msg: 'Đã kết thúc phòng thành công',
        });
    } catch (error) {
        reject(error)
    }
})

export const getBookingDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const bookingDetail = await db.ChiTietDatPhong.findOne({
            where: {
                trangThai: 'Đang chờ xác nhận',
                id
            },
            include: [
                {
                    model: db.DatPhong,
                    as: 'datPhong',
                    include: [
                        {
                            model: db.NguoiDung,
                            as: 'nguoiDung',
                        },
                    ],
                },
                {
                    model: db.PhongTro,
                    as: 'phongTro',
                    attributes: ['tenPhong', 'giaPhong', 'moTa', "tienCoc", "diaChi"], // Thông tin phòng trọ
                    include: [
                        {
                            model: db.AnhTro,
                            as: 'anhTros',
                        },
                        {
                            model: db.Phuong,
                            as: 'phuong',
                            include: [
                                {
                                    model: db.Quan,
                                    as: 'quan',
                                },
                            ]
                        }
                    ]
                },
            ],
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('ngayDat')), 'ngayDat'], 'soLuong', 'thoiGianThue', "trangThai", "id"
            ]
        })

        const ngayDat = moment(bookingDetail.ngayDat);
        const ngayKetThuc = ngayDat.add(bookingDetail.thoiGianThue, 'months').format('YYYY-MM-DD'); // Cộng thêm thời gian thuê
        const fullAddress = `${bookingDetail.phongTro?.diaChi}, ${bookingDetail.phongTro?.phuong?.tenPhuong}, ${bookingDetail.phongTro?.phuong?.quan?.tenQuan}`;

        const result = {
            id: bookingDetail.id,
            hoTen: bookingDetail.datPhong?.nguoiDung?.hoTen,
            email: bookingDetail.datPhong?.nguoiDung?.email,
            SDT: bookingDetail.datPhong?.nguoiDung?.SDT,
            CCCD: bookingDetail.datPhong?.nguoiDung?.CCCD,
            gioiTinh: bookingDetail.datPhong?.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
            anhCCCDMatTruoc: bookingDetail.datPhong?.nguoiDung?.anhCCCDMatTruoc,
            anhCCCDMatSau: bookingDetail.datPhong?.nguoiDung?.anhCCCDMatSau,
            tenPhong: bookingDetail.phongTro?.tenPhong,
            giaPhong: bookingDetail.phongTro?.giaPhong,
            tienCoc: bookingDetail.phongTro?.tienCoc,
            anh: bookingDetail.phongTro?.anhTros[0]?.anh,
            diaChi: fullAddress,
            soLuong: bookingDetail.soLuong,
            ngayDat: bookingDetail.ngayDat, // Phần ngày đã được trích xuất từ `ngayDat`
            ngayKetThuc: ngayKetThuc, // Ngày kết thúc (ngày thuê)
            trangThai: bookingDetail.trangThai,
        }
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getBookedUserDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const bookingDetail = await db.ChiTietDatPhong.findOne({
            where: {
                trangThai: {
                    [Op.in]: ['Hết hạn', 'Đã đặt'],
                },
                id
            },
            include: [
                {
                    model: db.DatPhong,
                    as: 'datPhong',
                    include: [
                        {
                            model: db.NguoiDung,
                            as: 'nguoiDung',
                        },
                    ],
                },
                {
                    model: db.PhongTro,
                    as: 'phongTro',
                    attributes: ['tenPhong', 'giaPhong', 'moTa', "tienCoc", "diaChi"], // Thông tin phòng trọ
                    include: [
                        {
                            model: db.AnhTro,
                            as: 'anhTros',
                        },
                        {
                            model: db.Phuong,
                            as: 'phuong',
                            include: [
                                {
                                    model: db.Quan,
                                    as: 'quan',
                                },
                            ]
                        }
                    ]
                },
            ],
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('ngayDat')), 'ngayDat'], 'soLuong', 'thoiGianThue', "trangThai", "id"
            ]
        })

        const ngayDat = moment(bookingDetail.ngayDat);
        const ngayKetThuc = ngayDat.add(bookingDetail.thoiGianThue, 'months').format('YYYY-MM-DD'); // Cộng thêm thời gian thuê
        const fullAddress = `${bookingDetail.phongTro?.diaChi}, ${bookingDetail.phongTro?.phuong?.tenPhuong}, ${bookingDetail.phongTro?.phuong?.quan?.tenQuan}`;

        const result = {
            id: bookingDetail.id,
            hoTen: bookingDetail.datPhong?.nguoiDung?.hoTen,
            email: bookingDetail.datPhong?.nguoiDung?.email,
            SDT: bookingDetail.datPhong?.nguoiDung?.SDT,
            CCCD: bookingDetail.datPhong?.nguoiDung?.CCCD,
            gioiTinh: bookingDetail.datPhong?.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
            anhCCCDMatTruoc: bookingDetail.datPhong?.nguoiDung?.anhCCCDMatTruoc,
            anhCCCDMatSau: bookingDetail.datPhong?.nguoiDung?.anhCCCDMatSau,
            tenPhong: bookingDetail.phongTro?.tenPhong,
            giaPhong: bookingDetail.phongTro?.giaPhong,
            tienCoc: bookingDetail.phongTro?.tienCoc,
            diaChi: fullAddress,
            anh: bookingDetail.phongTro?.anhTros[0]?.anh,
            soLuong: bookingDetail.soLuong,
            ngayDat: bookingDetail.ngayDat, // Phần ngày đã được trích xuất từ `ngayDat`
            ngayKetThuc: ngayKetThuc, // Ngày kết thúc (ngày thuê)
            trangThai: bookingDetail.trangThai,
        }
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})