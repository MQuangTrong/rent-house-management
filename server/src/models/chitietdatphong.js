'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiTietDatPhong extends Model {
    static associate(models) {
      // Mối quan hệ với bảng DatPhong
      ChiTietDatPhong.belongsTo(models.DatPhong, {
        foreignKey: 'maDatPhong',
        as: 'datPhong',
      });

      // Mối quan hệ với bảng PhongTro
      ChiTietDatPhong.belongsTo(models.PhongTro, {
        foreignKey: 'maPhongTro',
        as: 'phongTro',
      });
    }
  }
  ChiTietDatPhong.init(
    {
      maDatPhong: DataTypes.INTEGER, 
      maPhongTro: DataTypes.INTEGER, 
      soLuong: DataTypes.INTEGER,
      ngayDat: DataTypes.DATE,
      thoiGianThue: DataTypes.INTEGER,
      trangThai: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ChiTietDatPhong',
    }
  );
  return ChiTietDatPhong;
};
