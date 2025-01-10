import db from '../models'
import axios from 'axios';

export const saveQuansToDB = () => new Promise(async (resolve, reject) => {
  const QUAN_API_URL = 'https://open.oapi.vn/location/districts/48'; // API lấy quận Đà Nẵng

  try {
    const response = await axios.get(QUAN_API_URL);
    const quans =  response.data 
    // Lưu quận vào cơ sở dữ liệu
    for (const quan of quans.data) {
      console.log(quan.name);
      await db.Quan.create({
        id: quan.id,
        tenQuan: quan.name,
      });
    }

    resolve({
      err: 0,
      msg: 'Quận đã lưu vào DB',
    });

  } catch (error) {
    reject(error)
  }
});

export const savePhuongsToDB = (districtId) => new Promise(async (resolve, reject) => {
  const PHUONG_API_URL = `https://open.oapi.vn/location/wards/${districtId}`;

  try {
    const response = await axios.get(PHUONG_API_URL);
    const phuongs = response.data

    // Lưu phường vào cơ sở dữ liệu
    for (const phuong of phuongs.data) {
      await db.Phuong.create({
        id: phuong.id,
        tenPhuong: phuong.name,  // Giả sử response trả về tên phường
        maQuan: districtId,  // Giả sử districtId là mã quận
      });
    }

    resolve({
      err: 0,
      msg: 'Phường đã lưu vào DB',
    });
  } catch (error) {
    reject(error)
  }
});
