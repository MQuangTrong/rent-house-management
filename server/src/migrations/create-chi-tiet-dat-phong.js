'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChiTietDatPhongs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maDatPhong: {
        type: Sequelize.INTEGER,
      },
      maPhongTro: {
        type: Sequelize.INTEGER,
      },
      soLuong: {
        type: Sequelize.INTEGER,
      },
      ngayDat: {
        type: Sequelize.DATE,
      },
      thoiGianThue: {
        type: Sequelize.INTEGER,
      },
      trangThai: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChiTietDatPhongs');
  }
};