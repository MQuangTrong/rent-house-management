import db from '../models'
import { Op } from 'sequelize'
import { sequelize } from '../models'

export const getRoomLastedService = () => new Promise(async (resolve, reject) => {
    try {
        const rooms = await db.PhongTro.findAll({
            where: {
                daXoa: false,
                trangThai: 'Hoạt động',
                soLuongPhongTrong: {
                    [Op.gt]: 0, // Điều kiện "lớn hơn 0"
                },
            },
            attributes: ['id', 'tenPhong', 'giaPhong', 'dienTich', 'diaChi', 'soLuongPhong', 'soLuongPhongTrong'],
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
                {
                    model: db.AnhTro,
                    as: 'anhTros',
                    attributes: ['anh'],
                    limit: 1,
                    order: [['id', 'ASC']],
                },
            ],
            order: [['id', 'DESC']],
            limit: 8
        })
        const result = rooms.map((room) => {
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong}, ${room.phuong?.quan?.tenQuan}`;
            return {
                id: room.id,
                tenPhong: room.tenPhong,
                gia: room.giaPhong,
                dienTich: room.dienTich,
                anh: room.anhTros?.[0]?.anh || null,
                diaChi: fullAddress,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong
            }
        })
        resolve({
            err: result.length > 0 ? 0 : 1,
            msg: result.length > 0 ? 'OK' : 'Failed to get rooms',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getRoomsFilterSortService = (filters, sort) => new Promise(async (resolve, reject) => {
    try {
        const { district, ward, price, area } = filters;
        const filterConditions = {};

        if (ward) filterConditions.maPhuong = ward;

        if (price) {
            if (price === "6+") {
                filterConditions.dienTich = { [Op.gt]: 6000000 };
            } else if (area === "0-2") {
                filterConditions.dienTich = { [Op.lt]: 2000000 };
            } else {
                const [minPrice, maxPrice] = price.split("-");
                filterConditions.giaPhong = {
                    ...(minPrice && { [Op.gte]: Number(minPrice) * 1000000 }),
                    ...(maxPrice && { [Op.lte]: Number(maxPrice) * 1000000 }),
                };
            }
        }

        if (area) {
            if (area === "50+") {
                filterConditions.dienTich = { [Op.gt]: 50 };
            } else if (area === "0-20") {
                filterConditions.dienTich = { [Op.lt]: 20 };
            } else {
                const [minArea, maxArea] = area.split("-");
                filterConditions.dienTich = {
                    ...(minArea && { [Op.gte]: Number(minArea) }),
                    ...(maxArea && { [Op.lte]: Number(maxArea) }),
                };
            }
        }

        const rooms = await db.PhongTro.findAll({
            where: {
                ...filterConditions,
                daXoa: false,
                trangThai: 'Hoạt động',
                soLuongPhongTrong: {
                    [Op.gt]: 0, // Điều kiện "lớn hơn 0"
                },
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    where: district ? { maQuan: district } : {},
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
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
            order: [[sort || 'tenPhong', 'ASC']], // Thêm sắp xếp tại đây
        });

        const result = rooms.map((room) => {
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong}, ${room.phuong?.quan?.tenQuan}`;
            return {
                id: room.id,
                tenPhong: room.tenPhong,
                moTa: room.moTa,
                gia: room.giaPhong,
                dienTich: room.dienTich,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong,
                anh: room.anhTros?.map(anh => anh.anh) || [],
                diaChi: fullAddress,
                hoTen: room.chuTro?.nguoiDung?.hoTen,
                avatar: room.chuTro?.nguoiDung?.anh || null,
                SDT: room.chuTro?.nguoiDung?.SDT
            }
        });

        resolve({
            err: result.length > 0 ? 0 : 1,
            msg: result.length > 0 ? 'OK' : 'Failed to get rooms',
            result
        });

    } catch (error) {
        reject(error);
    }
});

export const getRoomDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const room = await db.PhongTro.findOne({
            where: {
                id,
                daXoa: false,
                trangThai: 'Hoạt động',
                soLuongPhongTrong: {
                    [Op.gt]: 0, // Điều kiện "lớn hơn 0"
                },
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
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

                },
            ],
        })

        // Kiểm tra nếu không tìm thấy phòng
        if (!room) {
            return resolve({
                err: 1,
                msg: 'Room not found',
                result: null
            });
        }

        const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong || ''}, ${room.phuong?.quan?.tenQuan || ''}`;

        const result = {
            id: room.id,
            tenPhong: room.tenPhong,
            moTa: room.moTa,
            soLuongPhong: room.soLuongPhong,
            soLuongPhongTrong: room.soLuongPhongTrong,
            gia: room.giaPhong,
            tienCoc: room.tienCoc,
            dienTich: room.dienTich,
            trangThai: room.trangThai,
            anh: room.anhTros?.map(anh => anh.anh) || [],
            diaChi: fullAddress,
            hoTen: room.chuTro?.nguoiDung?.hoTen,
            avatar: room.chuTro?.nguoiDung?.anh || null,
            SDT: room.chuTro?.nguoiDung?.SDT
        };

        // Kiểm tra nếu không có kết quả hợp lệ
        resolve({
            err: result ? 0 : 1,
            msg: result ? 'OK' : 'Failed to get room details',
            result
        });
    } catch (error) {
        console.error(error);  // Log error for debugging
        reject(error);
    }
});

export const getPenddingApprovePostService = () => new Promise(async (resolve, reject) => {
    try {
        const rooms = await db.PhongTro.findAll({
            where: {
                trangThai: "Chờ duyệt",
                daXoa: false,
                soLuongPhongTrong: {
                    [Op.gt]: 0, // Điều kiện "lớn hơn 0"
                },
            },
            include: [
                {
                    model: db.ChuTro,
                    as: 'chuTro',
                    include: [
                        {
                            model: db.NguoiDung,
                            as: 'nguoiDung',
                        }
                    ],
                },
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
                {
                    model: db.AnhTro,
                    as: 'anhTros',
                    attributes: ['anh'],
                    order: [['id', 'ASC']],
                },

            ],
        });

        const result = rooms.map((room) => {
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong}, ${room.phuong?.quan?.tenQuan}`;
            return {
                id: room.id,
                tenPhong: room.tenPhong,
                moTa: room.moTa,
                gia: room.giaPhong,
                dienTich: room.dienTich,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong,
                anh: room.anhTros?.map(anh => anh.anh) || [],
                diaChi: fullAddress,
                hoTen: room.chuTro?.nguoiDung?.hoTen,
                avatar: room.chuTro?.nguoiDung?.anh || null,
                SDT: room.chuTro?.nguoiDung?.SDT
            }
        });
        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const approvePostService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.PhongTro.update(
            { trangThai: "Hoạt động" },
            { where: { id } },
        );
        resolve({
            err: 0,
            msg: 'Bài đăng đã được phê duyệt thành công',
        });
    } catch (error) {
        reject(error)
    }
})

export const rejectPostService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.PhongTro.update(
            { trangThai: "Đã hủy" },
            { where: { id } },
        );
        resolve({
            err: 0,
            msg: 'Bài đăng đã bị từ chối',
        });
    } catch (error) {
        reject(error)
    }
})

export const getAllPostFilterService = (filters) => new Promise(async (resolve, reject) => {
    try {
        const { district, ward, price, area } = filters;
        const filterConditions = {};

        if (ward) filterConditions.maPhuong = ward;

        if (price) {
            if (price === "6+") {
                filterConditions.dienTich = { [Op.gt]: 6000000 };
            } else if (area === "0-2") {
                filterConditions.dienTich = { [Op.lt]: 2000000 };
            } else {
                const [minPrice, maxPrice] = price.split("-");
                filterConditions.giaPhong = {
                    ...(minPrice && { [Op.gte]: Number(minPrice) * 1000000 }),
                    ...(maxPrice && { [Op.lte]: Number(maxPrice) * 1000000 }),
                };
            }
        }

        if (area) {
            if (area === "50+") {
                filterConditions.dienTich = { [Op.gt]: 50 };
            } else if (area === "0-20") {
                filterConditions.dienTich = { [Op.lt]: 20 };
            } else {
                const [minArea, maxArea] = area.split("-");
                filterConditions.dienTich = {
                    ...(minArea && { [Op.gte]: Number(minArea) }),
                    ...(maxArea && { [Op.lte]: Number(maxArea) }),
                };
            }
        }

        const rooms = await db.PhongTro.findAll({
            where: {
                ...filterConditions,
                daXoa: false,
                trangThai: {
                    [Op.in]: ['Hoạt động', 'Đã hủy', 'Hết phòng'],
                }
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    where: district ? { maQuan: district } : {},
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
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
            order: [['id', 'DESC']],
        });

        const result = rooms.map((room) => {
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong}, ${room.phuong?.quan?.tenQuan}`;
            return {
                id: room.id,
                tenPhong: room.tenPhong,
                moTa: room.moTa,
                gia: room.giaPhong,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong,
                dienTich: room.dienTich,
                trangThai: room.trangThai,
                anh: room.anhTros?.map(anh => anh.anh) || [],
                diaChi: fullAddress,
                hoTen: room.chuTro?.nguoiDung?.hoTen,
                avatar: room.chuTro?.nguoiDung?.anh || null,
                SDT: room.chuTro?.nguoiDung?.SDT
            }
        });

        resolve({
            err: result.length > 0 ? 0 : 1,
            msg: result.length > 0 ? 'OK' : 'Failed to get rooms',
            result
        });

    } catch (error) {
        reject(error);
    }
});

export const getPostDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const room = await db.PhongTro.findOne({
            where: {
                id,
                daXoa: false,
                trangThai: {
                    [Op.in]: ['Hoạt động', 'Đã hủy', "Chờ duyệt", "Hết phòng"],
                },
                // soLuongPhongTrong: {
                //     [Op.gt]: 0, // Điều kiện "lớn hơn 0"
                // },
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
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

                },
            ],
        })
        const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong || ''}, ${room.phuong?.quan?.tenQuan || ''}`;

        const result = {
            id: room.id,
            tenPhong: room.tenPhong,
            moTa: room.moTa,
            gia: room.giaPhong,
            tienCoc: room.tienCoc,
            dienTich: room.dienTich,
            soLuongPhong: room.soLuongPhong,
            soLuongPhongTrong: room.soLuongPhongTrong,
            trangThai: room.trangThai,
            anh: room.anhTros?.map(anh => anh.anh) || [],
            diaChi: fullAddress,
            hoTen: room.chuTro?.nguoiDung?.hoTen,
            avatar: room.chuTro?.nguoiDung?.anh || null,
            SDT: room.chuTro?.nguoiDung?.SDT
        };

        resolve({
            err: 0,
            msg: 'OK',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getRoomListFilterService = (filters, id) => new Promise(async (resolve, reject) => {
    try {
        const { district, ward, price, area } = filters;
        const filterConditions = {};

        if (ward) filterConditions.maPhuong = ward;

        if (price) {
            if (price === "6+") {
                filterConditions.dienTich = { [Op.gt]: 6000000 };
            } else if (area === "0-2") {
                filterConditions.dienTich = { [Op.lt]: 2000000 };
            } else {
                const [minPrice, maxPrice] = price.split("-");
                filterConditions.giaPhong = {
                    ...(minPrice && { [Op.gte]: Number(minPrice) * 1000000 }),
                    ...(maxPrice && { [Op.lte]: Number(maxPrice) * 1000000 }),
                };
            }
        }

        if (area) {
            if (area === "50+") {
                filterConditions.dienTich = { [Op.gt]: 50 };
            } else if (area === "0-20") {
                filterConditions.dienTich = { [Op.lt]: 20 };
            } else {
                const [minArea, maxArea] = area.split("-");
                filterConditions.dienTich = {
                    ...(minArea && { [Op.gte]: Number(minArea) }),
                    ...(maxArea && { [Op.lte]: Number(maxArea) }),
                };
            }
        }

        const user = await db.NguoiDung.findOne({
            where: { id }
        })

        if (!user) {
            resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        const rooms = await db.PhongTro.findAll({
            where: {
                ...filterConditions,
                daXoa: false,
                maChuTro: user.maChuTro,
                trangThai: {
                    [Op.in]: ['Hoạt động', 'Đã hủy', 'Chờ duyệt', 'Hết phòng'],
                }
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    where: district ? { maQuan: district } : {},
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
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
            order: [['id', 'DESC']],
        });

        const result = rooms.map((room) => {
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong}, ${room.phuong?.quan?.tenQuan}`;
            return {
                id: room.id,
                tenPhong: room.tenPhong,
                moTa: room.moTa,
                gia: room.giaPhong,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong,
                dienTich: room.dienTich,
                trangThai: room.trangThai,
                anh: room.anhTros?.map(anh => anh.anh) || [],
                diaChi: fullAddress,
                tenChu: room.chuTro?.nguoiDung?.hoTen,
                avatar: room.chuTro?.nguoiDung?.anh || null,
                SDT: room.chuTro?.nguoiDung?.SDT
            }
        });

        resolve({
            err: result.length > 0 ? 0 : 1,
            msg: result.length > 0 ? 'OK' : 'Failed to get rooms',
            result
        });

    } catch (error) {
        reject(error);
    }
});

export const getRoomListDeletedFilterService = (filters, id) => new Promise(async (resolve, reject) => {
    try {
        const { district, ward, price, area } = filters;
        const filterConditions = {};

        if (ward) filterConditions.maPhuong = ward;

        if (price) {
            if (price === "6+") {
                filterConditions.dienTich = { [Op.gt]: 6000000 };
            } else if (area === "0-2") {
                filterConditions.dienTich = { [Op.lt]: 2000000 };
            } else {
                const [minPrice, maxPrice] = price.split("-");
                filterConditions.giaPhong = {
                    ...(minPrice && { [Op.gte]: Number(minPrice) * 1000000 }),
                    ...(maxPrice && { [Op.lte]: Number(maxPrice) * 1000000 }),
                };
            }
        }

        if (area) {
            if (area === "50+") {
                filterConditions.dienTich = { [Op.gt]: 50 };
            } else if (area === "0-20") {
                filterConditions.dienTich = { [Op.lt]: 20 };
            } else {
                const [minArea, maxArea] = area.split("-");
                filterConditions.dienTich = {
                    ...(minArea && { [Op.gte]: Number(minArea) }),
                    ...(maxArea && { [Op.lte]: Number(maxArea) }),
                };
            }
        }

        const user = await db.NguoiDung.findOne({
            where: { id }
        })

        if (!user) {
            resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        const rooms = await db.PhongTro.findAll({
            where: {
                ...filterConditions,
                daXoa: true,
                maChuTro: user.maChuTro,
                trangThai: {
                    [Op.in]: ['Hoạt động', 'Đã hủy', 'Chờ duyệt', 'Hết phòng'],
                }
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong'],
                    where: district ? { maQuan: district } : {},
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
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
            order: [['id', 'DESC']],
        });

        const result = rooms.map((room) => {
            const fullAddress = `${room.diaChi}, ${room.phuong?.tenPhuong}, ${room.phuong?.quan?.tenQuan}`;
            return {
                id: room.id,
                tenPhong: room.tenPhong,
                moTa: room.moTa,
                gia: room.giaPhong,
                soLuongPhong: room.soLuongPhong,
                soLuongPhongTrong: room.soLuongPhongTrong,
                dienTich: room.dienTich,
                trangThai: room.trangThai,
                anh: room.anhTros?.map(anh => anh.anh) || [],
                diaChi: fullAddress,
                hoTen: room.chuTro?.nguoiDung?.hoTen,
                avatar: room.chuTro?.nguoiDung?.anh || null,
                SDT: room.chuTro?.nguoiDung?.SDT
            }
        });

        resolve({
            err: result.length > 0 ? 0 : 1,
            msg: result.length > 0 ? 'OK' : 'Failed to get rooms',
            result
        });

    } catch (error) {
        reject(error);
    }
});

export const addRoomService = (body, id) => new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await db.NguoiDung.findOne({
            where: { id },
            transaction,
        })

        if (!user || !user.maChuTro) {
            await transaction.rollback();
            resolve({
                err: 1,
                msg: 'Người dùng không phải chủ trọ hoặc không tồn tại',
            });
            return;
        }

        const newRoom = await db.PhongTro.create({
            tenPhong: body.tenPhong,
            giaPhong: body.gia,
            dienTich: body.dienTich,
            moTa: body.moTa,
            soLuongPhong: body.soLuongPhong,
            soLuongPhongTrong: body.soLuongPhongTrong,
            diaChi: body.diaChi,
            maPhuong: body.ward,
            maChuTro: user.maChuTro,
            tienCoc: body.tienCoc,
        }, { transaction });

        // Nếu có ảnh, lưu ảnh vào bảng AnhTro
        if (body.anh && body.anh.length > 0) {
            const images = body.anh.map((a) => ({
                maPhongTro: newRoom.id,
                anh: a,
            }));
            await db.AnhTro.bulkCreate(images, { transaction });
        }

        await transaction.commit();
        resolve({
            err: 0,
            msg: 'Thêm mới phòng thành công',
        });


    } catch (error) {
        reject(error);
    }
});

export const deleteRoomService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.PhongTro.update(
            { daXoa: true },
            { where: { id } }
        )

        resolve({
            err: 0,
            msg: 'Đã xóa phòng trọ thành công',
        });

    } catch (error) {
        reject(error);
    }
});

export const recoverRoomService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.PhongTro.update(
            { daXoa: false },
            { where: { id } }
        )
        resolve({
            err: 0,
            msg: 'Đã khôi phục phòng trọ thành công',
        });

    } catch (error) {
        reject(error);
    }
});

export const getRoomEditService = (id) => new Promise(async (resolve, reject) => {
    try {
        const room = await db.PhongTro.findOne({
            where: {
                id,
                daXoa: false,
                trangThai: {
                    [Op.in]: ['Hoạt động', 'Đã hủy', 'Chờ duyệt', 'Hết phòng'],
                },
            },
            include: [
                {
                    model: db.Phuong,
                    as: 'phuong',
                    attributes: ['tenPhuong', 'maQuan'],
                    include: [
                        {
                            model: db.Quan,
                            as: 'quan',
                            attributes: ['tenQuan']
                        }
                    ]
                },
                {
                    model: db.AnhTro,
                    as: 'anhTros',
                    attributes: ['anh'],
                    order: [['id', 'ASC']],
                },
            ],
        })

        const result = {
            tenPhong: room.tenPhong,
            giaPhong: room.giaPhong,
            dienTich: room.dienTich,
            moTa: room.moTa,
            soLuongPhong: room.soLuongPhong,
            soLuongPhongTrong: room.soLuongPhongTrong,
            trangThai: room.trangThai,
            anh: room.anhTros?.map(anh => anh.anh) || [],
            ward: room.maPhuong,
            district: room.phuong?.maQuan,
            diaChi: room.diaChi,
            tienCoc: room.tienCoc,
        };

        resolve({
            err: 0,
            msg: 'Ok',
            result
        });


    } catch (error) {
        reject(error);
    }
});

export const EditRoomService = (id, body) => new Promise(async (resolve, reject) => {
    try {
        const currentImages = await db.AnhTro.findAll({
            where: {
                maPhongTro: id
            }
        })

        const currentImagesPath = currentImages.map(img => img.anh)

        const imagesToDelete = currentImagesPath.filter(img => !body.anh.includes(img))
        if (imagesToDelete.length > 0) {
            await db.AnhTro.destroy({
                where: {
                    maPhongTro: id,
                    anh: imagesToDelete,
                },
            });
        }

        const imagesToAdd = body.anh.filter(img => !currentImagesPath.includes(img));

        const newImages = imagesToAdd.map(img => ({
            anh: img,
            maPhongTro: id,
        }));

        if (newImages.length > 0) {
            await db.AnhTro.bulkCreate(newImages);
        }

        const currentRoom = await db.PhongTro.findOne({
            where: { id },
            attributes: ['soLuongPhong', 'soLuongPhongTrong', 'trangThai'],
        });

        if (currentRoom) {
            const { trangThai } = currentRoom;

            // Trạng thái "Hết phòng" chỉ thay đổi khi có phòng trống
            if (Number(body.soLuongPhongTrong) === 0 && trangThai === 'Hoạt động') {
                await db.PhongTro.update(
                    { trangThai: "Hết phòng" },
                    { where: { id } }
                );
            }

            // Trạng thái "Hoạt động" chỉ thay đổi khi hết phòng (soLuongPhongTrong > 0)
            else if (Number(body.soLuongPhongTrong) > 0 && trangThai === 'Hết phòng') {
                await db.PhongTro.update(
                    { trangThai: "Hoạt động" },
                    { where: { id } }
                );
            }

            // Nếu trạng thái là "Đã hủy" hoặc "Chờ duyệt", giữ nguyên
            if (trangThai === 'Đã hủy' || trangThai === 'Chờ duyệt') {
                await db.PhongTro.update(
                    { trangThai: trangThai }, // Giữ nguyên trạng thái hiện tại
                    { where: { id } }
                );
            }
        }

        await db.PhongTro.update({
            tenPhong: body.tenPhong,
            giaPhong: body.gia,
            dienTich: body.dienTich,
            moTa: body.moTa,
            soLuongPhong: body.soLuongPhong,
            soLuongPhongTrong: body.soLuongPhongTrong,
            maPhuong: body.ward,
            diaChi: body.diaChi,
            tienCoc: body.tienCoc,
        },
            {
                where: { id }
            })

        resolve({
            err: 0,
            msg: 'Đã cập nhập thành công',
        });

    } catch (error) {
        reject(error);
    }
});