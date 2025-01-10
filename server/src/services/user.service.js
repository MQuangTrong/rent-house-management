import db from '../models'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize'
import sequelize from 'sequelize'

export const getOne = (id) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: { id },
            attributes: {
                exclude: ['matKhau']
            },
            include: [
                {
                    model: db.ChuTro,
                    as: "chuTro",  // Alias cho chủ trọ
                }
            ]
        })

        const response = {
            id: user.id,
            email: user.email,
            maPhanQuyen: user.maPhanQuyen,
            anh: user.anh,
            xacThucEmail: user.xacThucEmail,
            daKhoa: user.daKhoa,
            maChuTro: user.maChuTro,
            hoTen: user.hoTen,
            SDT: user.SDT,
            CCCD: user.CCCD,
            gioiTinh: user.gioiTinh,
            anhCCCDMatTruoc: user.anhCCCDMatTruoc,
            anhCCCDMatSau: user.anhCCCDMatSau,
            tenNganHang: user.chuTro?.tenNganHang || null,
            soTaiKhoanNganHang: user.chuTro?.soTaiKhoanNganHang || null,
            soDuKhaDung: user.chuTro?.soDuKhaDung || null
        }
        resolve({
            err: 0,
            msg: 'OK',
            response
        });
    } catch (error) {
        reject(error)
    }
})

export const updateProfileService = (id, body, file) => new Promise(async (resolve, reject) => {
    try {
        const existingUser = await db.NguoiDung.findOne({
            where: {
                email: body.email,
                id: { [db.Sequelize.Op.ne]: id }, // Điều kiện id khác với id được cung cấp
            },
            raw: true,
        })

        if (existingUser) {
            return resolve({
                err: 1,
                msg: 'Email đã tồn tại',
            });
        }

        if (file) {
            body.anh = `/images/${file.filename}`;
        }

        await db.NguoiDung.update({
            hoTen: body.hoTen,
            SDT: body.SDT,
            CCCD: body.CCCD,
            anh: body.anh,
            gioiTinh: body.gioiTinh === "Nu"
        },
            {
                where: { id }
            })

        const updatedUser = await db.NguoiDung.findOne({
            where: { id },
            attributes: { exclude: ['matKhau'] },
            raw: true,
        });

        resolve({
            err: 0,
            msg: 'Cập nhật thành công',
            response: updatedUser
        });
    } catch (error) {
        reject(error)
    }
})

export const updateHostProfileService = (id, body) => new Promise(async (resolve, reject) => {
    try {
        const existingUser = await db.NguoiDung.findOne({
            where: {
                email: body.email,
                id: { [db.Sequelize.Op.ne]: id },
            },
            raw: true,
        })

        if (existingUser) {
            return resolve({
                err: 1,
                msg: 'Email đã tồn tại',
            });
        }

        const user = await db.NguoiDung.findOne({
            where: {
                id
            },
        })

        if (!user) {
            return resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        await user.update({
            hoTen: body.hoTen,
            email: body.email,
            SDT: body.SDT,
            anh: body.anh,
            CCCD: body.CCCD,
            anhCCCDMatTruoc: body.anhCCCDMatTruoc,
            anhCCCDMatSau: body.anhCCCDMatSau,
            gioiTinh: body.gioiTinh === "Nu"
        },
            {
                where: { id }
            })

        await db.ChuTro.update({
            tenNganHang: body.tenNganHang,
            soTaiKhoanNganHang: body.soTaiKhoanNganHang
        },
            {
                where: {
                    id: user.maChuTro
                }
            })

        const updatedUser = await db.NguoiDung.findOne({
            where: { id },
            attributes: { exclude: ['matKhau'] },
            raw: true,
        });

        const updatedHost = await db.ChuTro.findOne({
            where: { id },
            raw: true,
        });

        resolve({
            err: 0,
            msg: 'Cập nhật thành công',
            response: {
                updatedHost,
                updatedUser
            }
        });
    } catch (error) {
        reject(error)
    }
})

export const changePasswordService = (id, body) => new Promise(async (resolve, reject) => {
    try {

        const { matKhau, matKhauMoi } = body;

        const user = await db.NguoiDung.findOne({
            where: { id },
            raw: true,
        })

        if (!user) {
            return resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        const isMatch = await bcrypt.compare(matKhau, user.matKhau);
        if (!isMatch) {
            return resolve({
                err: 1,
                msg: 'Mật khẩu hiện tại không đúng',
            });
        }

        if (matKhauMoi == matKhau) {
            return resolve({
                err: 1,
                msg: 'Mật khẩu mới trùng với mật khẩu cũ',
            });
        }

        const hashedPassword = await bcrypt.hash(matKhauMoi, bcrypt.genSaltSync(12))
        await db.NguoiDung.update({ matKhau: hashedPassword }, { where: { id } });

        resolve({
            err: 0,
            msg: 'Đổi mật khẩu thành công',
        });
    } catch (error) {
        reject(error)
    }
})

export const getAllService = (search, roleId) => new Promise(async (resolve, reject) => {
    try {
        let whereClause = {}

        // Điều kiện tìm kiếm theo tên không phân biệt hoa thường
        if (search) {
            whereClause[Op.or] = [
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('khachHang.hoTen')),
                    'LIKE',
                    `%${search.toLowerCase()}%`
                ),
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('chuTro.hoTen')),
                    'LIKE',
                    `%${search.toLowerCase()}%`
                )
            ];
        }

        // Điều kiện lọc theo roleId
        if (roleId) {
            whereClause.maPhanQuyen = roleId;// Lọc theo maPhanQuyen dựa trên roleId
        }

        if (!roleId) {
            whereClause.maPhanQuyen = { [Op.ne]: 1 };
        }

        const users = await db.NguoiDung.findAll({
            where: {
                ...whereClause,
                daKhoa: false // Chỉ lấy người dùng chưa bị khóa
            },
            include: [
                {
                    model: db.PhanQuyen,
                    as: 'phanQuyen',
                    attributes: ['tenQuyen'],
                }
            ],
        });

        // Chuyển đổi kết quả trả về
        const result = users.map((user) => {
            return {
                id: user.id,
                email: user.email,
                anh: user.anh,
                maPhanQuyen: user.maPhanQuyen,
                tenQuyen: user.phanQuyen?.tenQuyen,
                hoTen: user.hoTen,
                SDT: user.SDT,
                gioiTinh: user.gioiTinh ? 'Nữ' : "Nam",
                CCCD: user.CCCD,
                anhCCCDMatTruoc: user.anhCCCDMatTruoc,
                anhCCCDMatSau: user.anhCCCDMatSau
            }
        });

        resolve({
            err: 0,
            msg: 'Ok',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const getAllLockedService = (search, roleId) => new Promise(async (resolve, reject) => {
    try {
        let whereClause = {}

        // Điều kiện tìm kiếm theo tên không phân biệt hoa thường
        if (search) {
            whereClause.hoTen = sequelize.where(
                sequelize.fn('LOWER', sequelize.col('hoTen')),
                'LIKE',
                `%${search.toLowerCase()}%`
            );
        }

        // Điều kiện lọc theo roleId
        if (roleId) {
            whereClause.maPhanQuyen = roleId;// Lọc theo maPhanQuyen dựa trên roleId
        }

        if (!roleId) {
            whereClause.maPhanQuyen = { [Op.ne]: 1 };
        }

        const users = await db.NguoiDung.findAll({
            where: {
                ...whereClause,
                daKhoa: true // Chỉ lấy người dùng bị khóa
            },
            include: [
                {
                    model: db.PhanQuyen,
                    as: 'phanQuyen',
                    attributes: ['tenQuyen'],
                },
            ],
        });

        // Chuyển đổi kết quả trả về
        const result = users.map((user) => {
            return {
                id: user.id,
                email: user.email,
                anh: user.anh,
                maPhanQuyen: user.maPhanQuyen,
                tenQuyen: user.phanQuyen?.tenQuyen,
                hoTen: user.hoTen,
                SDT: user.SDT,
                gioiTinh: user.gioiTinh ? 'Nữ' : "Nam",
                CCCD: user.CCCD,
                anhCCCDMatTruoc: user.anhCCCDMatTruoc,
                anhCCCDMatSau: user.anhCCCDMatSau
            }
        });

        resolve({
            err: 0,
            msg: 'Ok',
            result
        });
    } catch (error) {
        reject(error)
    }
})

export const lockUserService = (id) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: {
                id
            },
        });

        if (!user) {
            resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        await db.NguoiDung.update(
            { daKhoa: true },
            { where: { id } }
        )

        resolve({
            err: 0,
            msg: 'Đã khóa tài khoản',
        });
    } catch (error) {
        reject(error)
    }
})

export const unLockUserService = (id) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: {
                id
            },
        });

        if (!user) {
            resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        await db.NguoiDung.update(
            { daKhoa: false },
            { where: { id } }
        )

        resolve({
            err: 0,
            msg: 'Đã mở khóa tài khoản',
        });
    } catch (error) {
        reject(error)
    }
})

export const getUserDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.NguoiDung.findOne({
            where: {
                id
            },
            include: [
                {
                    model: db.ChuTro,
                    as: 'chuTro',
                },
                {
                    model: db.PhanQuyen,
                    as: 'phanQuyen',
                    attributes: ['tenQuyen']
                },
            ]
        });

        if (!user) {
            resolve({
                err: 1,
                msg: 'Người dùng không tồn tại',
            });
        }

        let result = {
            id: user.id,
            email: user.email,
            anh: user.anh,
            maPhanQuyen: user.maPhanQuyen,
            tenQuyen: user.phanQuyen?.tenQuyen,
            maChuTro: user.maChuTro,
            hoTen: user.hoTen,
            SDT: user.SDT,
            gioiTinh: user.gioiTinh ? 'Nữ' : "Nam",
            CCCD: user.CCCD,
            anhCCCDMatTruoc: user.anhCCCDMatTruoc,
            anhCCCDMatSau: user.anhCCCDMatSau,
            tenNganHang: user.chuTro?.tenNganHang,
            soTaiKhoanNganHang: user.chuTro?.soTaiKhoanNganHang,
            soDuKhaDung: user.chuTro?.soDuKhaDung,
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