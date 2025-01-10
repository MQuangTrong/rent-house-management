'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnhTro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AnhTro.belongsTo(models.PhongTro, {
        foreignKey: 'maPhongTro',  
        as: 'phongTro' 
      });
    }
  }
  AnhTro.init({
    anh: DataTypes.STRING,
    maPhongTro: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'AnhTro',
  });
  return AnhTro;
};