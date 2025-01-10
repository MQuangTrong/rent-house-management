'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BaiViet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BaiViet.belongsTo(models.NguoiDung, {
        foreignKey: 'maNguoiDung',  
        as: 'nguoiDung' 
      });
    }
  }
  BaiViet.init({
    tieuDe: DataTypes.STRING,
    anh: DataTypes.STRING,
    maNguoiDung: DataTypes.INTEGER,
    noiDung: DataTypes.TEXT,
    daXoa: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'BaiViet',
  });
  return BaiViet;
};