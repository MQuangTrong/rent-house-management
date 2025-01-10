'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Quan.hasMany(models.Phuong, {
            foreignKey: 'maQuan',  
            as: 'phuongs'  
          });
    }
  }
  Quan.init({
    tenQuan: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Quan',
  });
  return Quan;
};