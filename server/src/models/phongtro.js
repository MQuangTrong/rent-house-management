'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PhongTro extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PhongTro.hasMany(models.AnhTro, {
                foreignKey: 'maPhongTro', // Khóa ngoại trong bảng Image
                as: 'anhTros',  // Alias quan hệ
            });

            PhongTro.hasMany(models.ChiTietDatPhong, {
                foreignKey: 'maPhongTro',
                as: 'chiTietDatPhongs',
            });

            PhongTro.belongsTo(models.ChuTro, {
                foreignKey: 'maChuTro',
                as: 'chuTro'
            });

            PhongTro.belongsTo(models.Phuong, {
                foreignKey: 'maPhuong',
                as: 'phuong'
            });
        }
    }
    PhongTro.init({
        tenPhong: DataTypes.STRING,
        giaPhong: DataTypes.INTEGER,
        dienTich: DataTypes.FLOAT,
        diaChi: DataTypes.STRING,
        moTa: DataTypes.TEXT,
        soLuongPhong: DataTypes.INTEGER,
        soLuongPhongTrong: DataTypes.INTEGER,
        maPhuong: DataTypes.INTEGER,
        maChuTro: DataTypes.INTEGER,
        tienCoc: DataTypes.INTEGER,
        trangThai: DataTypes.STRING,
        daXoa: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'PhongTro',
    });
    return PhongTro;
};