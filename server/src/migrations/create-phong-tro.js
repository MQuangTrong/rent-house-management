'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('PhongTros', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tenPhong: {
                type: Sequelize.STRING
            },
            giaPhong: {
                type: Sequelize.INTEGER
            },
            dienTich: {
                type: Sequelize.FLOAT
            },
            moTa: {
                type: Sequelize.TEXT
            },
            soLuongPhong: {
                type: Sequelize.INTEGER
            },
            soLuongPhongTrong: {
                type: Sequelize.INTEGER
            },
            diaChi: {
                type: Sequelize.STRING
            },
            maPhuong: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            maChuTro: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            tienCoc: {
                type: Sequelize.INTEGER
            },
            trangThai: {
                type: Sequelize.STRING,
                defaultValue: 'Chờ duyệt'
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
        await queryInterface.dropTable('PhongTros');
    }
};