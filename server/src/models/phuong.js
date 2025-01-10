'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phuong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Phuong.hasMany(models.PhongTro, {
        foreignKey: 'maPhuong',  
        as: 'phongTros'  
      });

      Phuong.belongsTo(models.Quan, {
        foreignKey: 'maQuan',  
        as: 'quan' 
      });
    }
  }
  Phuong.init({
    tenPhuong: DataTypes.STRING,
    maQuan: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Phuong',
  });
  return Phuong;
};