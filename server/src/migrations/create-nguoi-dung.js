'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NguoiDungs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      matKhau: {
        type: Sequelize.STRING
      },
      Anh: {
        type: Sequelize.STRING
      },
      maPhanQuyen: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      xacThucEmail: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      daKhoa: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      maChuTro: {
        type: Sequelize.INTEGER
      },
      hoTen: {
        type: Sequelize.STRING
      },
      SDT: {
        type: Sequelize.STRING
      },
      CCCD: {
        type: Sequelize.STRING,
      },
      gioiTinh: {
        type: Sequelize.BOOLEAN,
        defaultValue: false //Nam
      },
      anhCCCDMatTruoc: {
        type: Sequelize.STRING
      },
      anhCCCDMatSau: {
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
    await queryInterface.dropTable('NguoiDungs');
  }
};