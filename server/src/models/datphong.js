'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DatPhong extends Model {
    static associate(models) {
      // Mối quan hệ với bảng NguoiDung
      DatPhong.belongsTo(models.NguoiDung, {
        foreignKey: 'maNguoiDung',
        as: 'nguoiDung',
      });

      // Mối quan hệ với bảng ChiTietDatPhong
      DatPhong.hasMany(models.ChiTietDatPhong, {
        foreignKey: 'maDatPhong',
        as: 'chiTietDatPhongs',
      });
    }
  }
  DatPhong.init(
    {
      maNguoiDung: DataTypes.INTEGER,
      trangThai: DataTypes.STRING,
      hinhThucThanhToan: DataTypes.STRING,
      tongTien: DataTypes.BIGINT
    },
    {
      sequelize,
      modelName: 'DatPhong',
    }
  );
  return DatPhong;
};
