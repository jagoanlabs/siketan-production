'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eventTanis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaKegiatan: {
        type: Sequelize.STRING
      },
      tanggalAcara: {
        type: Sequelize.DATE
      },
      waktuAcara: {
        type: Sequelize.STRING
      },
      tempat: {
        type: Sequelize.STRING
      },
      peserta: {
        type: Sequelize.STRING
      },
      fotoKegiatan: {
        type: Sequelize.TEXT
      },
      createdBy: {
        type: Sequelize.STRING
      },
      isi: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('eventTanis');
  }
};
