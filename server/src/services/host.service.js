import db from '../models'

export const registerHostService = (body) => new Promise(async (resolve, reject) => {
    try {
        const existingUser = await db.NguoiDung.findOne({
            where: { email: body.email },
            raw: true,
        });

        if (!existingUser) {
            return resolve({
                err: 1,
                msg: 'Người dùng không tồn tại. Vui lòng kiểm tra lại.',
            });
        }

        if (existingUser.maPhanQuyen === 2) {
            return resolve({
                err: 1,
                msg: 'Người dùng này đã là chủ nhà.',
            });
        }

        const newHost = await db.ChuTro.create({
            tenNganHang: body.tenNganHang,
            soTaiKhoanNganHang: body.soTaiKhoanNganHang,
            soDuKhaDung: 0,
        });

        await db.NguoiDung.update(
            { 
                maChuTro: newHost.id,
                gioiTinh: body.gioiTinh === 'Nu',
                anhCCCDMatTruoc: body.anhCCCDMatTruoc,
                anhCCCDMatSau: body.anhCCCDMatSau,
                CCCD: body.CCCD
            },
            { where: { email: body.email } }
        );

        resolve({
            err: 0,
            msg: 'Đăng ký thành công! Chờ admin duyệt.',
            response: newHost,
        });
    } catch (error) {
        reject(error);
    }
});

export const getHostsPendingApprovalService = () => new Promise(async (resolve, reject) => {
    try {
        const hosts = await db.ChuTro.findAll({
            where: { trangThai: false }, // Lọc theo trạng thái "Chờ duyệt"
            include: {
                model: db.NguoiDung,
                as: 'nguoiDung',
            },
        });

        const result = hosts.map((host) => {
            return {
                id: host.id,
                hoTen: host.nguoiDung?.hoTen,
                email: host.nguoiDung?.email,
                SDT: host.nguoiDung?.SDT,
                CCCD: host.nguoiDung?.CCCD,
                gioiTinh: host.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
                anhCCCDMatTruoc: host.nguoiDung?.anhCCCDMatTruoc,
                anhCCCDMatSau: host.nguoiDung?.anhCCCDMatSau,
                trangThai: host.trangThai,
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

export const getHostsPendingApprovalDetailService = (id) => new Promise(async (resolve, reject) => {
    try {
        const host = await db.ChuTro.findOne({
            where: {
                id,
                trangThai: false,
            }, // Lọc theo trạng thái "Đang duyệt"
            include: {
                model: db.NguoiDung,
                as: 'nguoiDung', // Liên kết bảng NguoiDung
            },
        });
        resolve({
            err: 0,
            msg: 'OK',
            response: {
                id: host.id,
                hoTen: host.nguoiDung?.hoTen,
                email: host.nguoiDung?.email,
                SDT: host.nguoiDung?.SDT,
                CCCD: host.nguoiDung?.CCCD,
                gioiTinh: host.nguoiDung?.gioiTinh ? 'Nữ' : 'Nam',
                anhCCCDMatTruoc: host.nguoiDung?.anhCCCDMatTruoc,
                anhCCCDMatSau: host.nguoiDung?.anhCCCDMatSau,
                trangThai: host.trangThai,
                tenNganHang: host.tenNganHang,
                soTaiKhoanNganHang: host.soTaiKhoanNganHang
            }
        });
    } catch (error) {
        reject(error)
    }
})

export const approveHostService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.ChuTro.update(
            { trangThai: true },
            { where: { id } },
        );

        await db.NguoiDung.update(
            { maPhanQuyen: 2 },
            { where: { maChuTro: id } },
        );

        resolve({
            err: 0,
            msg: 'Chủ trọ đã được phê duyệt thành công',
        });
    } catch (error) {
        reject(error)
    }
})

export const RejectHostService = (id) => new Promise(async (resolve, reject) => {
    try {
        await db.ChuTro.destroy(
            { where: { id } },
        );

        await db.NguoiDung.update(
            { maChuTro: null },
            { where: { maChuTro: id } },
        );
        resolve({
            err: 0,
            msg: 'Chủ trọ đã bị hủy',
        });
    } catch (error) {
        reject(error)
    }
})