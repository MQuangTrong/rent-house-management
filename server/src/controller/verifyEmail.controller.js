import db from '../models';
import jwt from 'jsonwebtoken';
require('dotenv').config()

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    const user = await db.NguoiDung.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Người dùng không tồn tại.' });
    }
    

    user.xacThucEmail = true;
    await user.save();

    res.status(200).json({ msg: 'Xác thực email thành công.' });
  } catch (error) {
    res.status(400).json({ msg: 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.', error });
  }
};
