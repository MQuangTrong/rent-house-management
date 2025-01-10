'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhanQuyen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PhanQuyen.hasMany(models.NguoiDung, {
        foreignKey: 'maPhanQuyen',  
        as: 'nguoiDungs'  
      });
    }
  }
  PhanQuyen.init({
    tenQuyen: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PhanQuyen',
  });
  return PhanQuyen;
};