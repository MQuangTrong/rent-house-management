import nodemailer from 'nodemailer';
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác thực email của bạn',
    html: `<p>Xin chào,</p>
           <p>Vui lòng nhấn vào liên kết dưới đây để xác thực email của bạn:</p>
           <a href="${verificationLink}">${verificationLink}</a>
           <p>Liên kết có hiệu lực trong 24 giờ.</p>`,
  });
};

export const sendForgotPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Khôi phục mật khẩu',
    html: `<p>Bấm vào <a href="${resetLink}">đây</a> để đổi mật khẩu.</p>`,
  });
};
