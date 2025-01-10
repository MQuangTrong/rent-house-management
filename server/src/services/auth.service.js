import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
require('dotenv').config()
import { sendVerificationEmail, sendForgotPasswordEmail } from '../ultis/email';

const hashedPassword = async (matKhau) => {
    return await bcrypt.hash(matKhau, bcrypt.genSaltSync(12)); // Dùng async/await để đảm bảo trả về giá trị
};

// Tạo token xác thực email
const createVerificationToken = (email) => {
    return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1d' });
};

export const registerService = (body) => new Promise(async (resolve, reject) => {
    try {
        const { email, matKhau} = body;
        const existingEmail = await db.NguoiDung.findOne({ where: { email } });
        if (existingEmail) {
            return resolve({ status: 400, msg: 'Email đã được sử dụng.' });
        }

        const maPhanQuyen = 3;
        const hashedPwd = await hashedPassword(matKhau)
        await db.NguoiDung.create({
            email,
            matKhau: hashedPwd,
            maPhanQuyen,
            anh: null // Không có ảnh khi đăng ký
        })

        const verificationToken = createVerificationToken(email);
        await sendVerificationEmail(email, verificationToken);

        resolve({
            err: 0,
            msg: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
        });
    } catch (error) {
        reject(error)
    }
})

export const loginService = (body) => new Promise(async (resolve, reject) => {
    try {
        const { email, matKhau } = body;
        const response = await db.NguoiDung.findOne({
            where: { email },
            raw: true
        });

        // Kiểm tra nếu email không tồn tại
        if (!response) {
            return resolve({
                err: 1,
                msg: 'Email không tìm thấy!',
                token: null
            });
        }

        // Kiểm tra mật khẩu
        const isCorrectPassword = bcrypt.compareSync(matKhau, response.matKhau);
        if (!isCorrectPassword) {
            return resolve({
                err: 2,
                msg: 'Sai mật khẩu!',
                token: null
            });
        }

        // Kiểm tra nếu người dùng đã xác thực email
        if (!response.xacThucEmail) {
            return resolve({
                err: 3,
                msg: 'Vui lòng xác thực email trước khi đăng nhập!',
                token: null
            });
        }

        // Kiểm tra nếu người dùng đã xác thực email
        if (response.daKhoa) {
            return resolve({
                err: 3,
                msg: 'Tài khoản của bạn đã bị khóa',
                token: null
            });
        }

        // Tạo token đăng nhập nếu mật khẩu đúng và email đã xác thực
        const token = jwt.sign(
            {
                id: response.id,
                email: response.email,
                maPhanQuyen: response.maPhanQuyen // Thêm maPhanQuyen vào payload 
            },
            process.env.SECRET_KEY, { expiresIn: '2d' });

        resolve({
            err: 0,
            msg: 'Đăng nhập thành công!',
            token: token
        });
    } catch (error) {
        reject(error);
    }
});

export const forgotPasswordService = (body) => new Promise(async (resolve, reject) => {
    try {
        const { email } = body;
        const user = await db.NguoiDung.findOne({
            where: { email },
            raw: true
        });
        if (!user) {
            return resolve({
                err: 3,
                msg: 'Email không tồn tại!',
                token: null
            });
        }

        const verificationToken = createVerificationToken(email);
        await sendForgotPasswordEmail(email, verificationToken);

        resolve({
            err: 0,
            msg: 'Email khôi phục mật khẩu đã được gửi!',
        });

    } catch (error) {
        reject(error);
    }
});

export const resetPasswordService = (body, token) => new Promise(async (resolve, reject) => {
    const { matKhauMoi } = body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email
        const user = await db.NguoiDung.findOne({
            where: { email },
        });

        if (!user) {
            return resolve({
                err: 3,
                msg: 'Người dùng không tồn tại!',
                token: null
            });
        }

        const hashedPwd = await hashedPassword(matKhauMoi)
        user.matKhau = hashedPwd;
        await user.save();

        resolve({
            err: 0,
            msg: 'Đặt lại mật khẩu thành công!',
        });
    } catch (error) {
        reject(error);
    }
});