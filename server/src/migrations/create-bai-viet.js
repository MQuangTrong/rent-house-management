'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BaiViets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tieuDe: {
        type: Sequelize.STRING
      },
      maNguoiDung: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      anh: {
        type: Sequelize.STRING
      },
      noiDung: {
        type: Sequelize.TEXT
      },
      daXoa: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('BaiViets');
  }
};