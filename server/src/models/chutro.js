'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChuTro extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ChuTro.hasOne(models.NguoiDung, {
                foreignKey: 'maChuTro',  // Khoá ngoại trong bảng NguoiDung
                as: 'nguoiDung'  // Alias để truy cập quan hệ này
            });

            ChuTro.hasMany(models.PhongTro, {
                foreignKey: 'maChuTro',
                as: 'phongTros'
            });
        }
    }
    ChuTro.init({
        trangThai: DataTypes.BOOLEAN,
        tenNganHang: DataTypes.STRING,
        soTaiKhoanNganHang: DataTypes.STRING,
        soDuKhaDung: DataTypes.DECIMAL(10,2)
    }, {
        sequelize,
        modelName: 'ChuTro',
    });
    return ChuTro;
};