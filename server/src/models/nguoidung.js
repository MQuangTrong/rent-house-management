'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NguoiDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NguoiDung.belongsTo(models.PhanQuyen, {
        foreignKey: 'maPhanQuyen',
        as: 'phanQuyen'
      });

      NguoiDung.belongsTo(models.ChuTro, {
        foreignKey: 'maChuTro',
        as: 'chuTro',
      });

      NguoiDung.hasMany(models.DatPhong, {
        foreignKey: 'maNguoiDung',
        as: 'datPhongs',
      });

      NguoiDung.hasMany(models.BaiViet, {
        foreignKey: 'maNguoiDung',
        as: 'baiViets',
      });
    }
  }
  NguoiDung.init({
    email: DataTypes.STRING,
    matKhau: DataTypes.STRING,
    maPhanQuyen: DataTypes.INTEGER,
    anh: DataTypes.STRING,
    xacThucEmail: DataTypes.BOOLEAN,
    daKhoa: DataTypes.BOOLEAN,
    hoTen: DataTypes.STRING,
    SDT: DataTypes.STRING,
    CCCD: DataTypes.STRING,
    gioiTinh: DataTypes.BOOLEAN,
    anhCCCDMatTruoc: DataTypes.STRING,
    anhCCCDMatSau: DataTypes.STRING,
    maChuTro: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'NguoiDung',
  });
  return NguoiDung;
};