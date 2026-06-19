'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create riwayatImports table
    await queryInterface.createTable('riwayatImports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaFile: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jumlahData: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      statusRealisasi: {
        type: Sequelize.ENUM('belum', 'sudah'),
        defaultValue: 'belum',
        allowNull: false
      },
      fk_akunId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_akun',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // 2. Add fk_importHistoryId to dataTanamans table
    await queryInterface.addColumn('dataTanamans', 'fk_importHistoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'riwayatImports',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    // 1. Remove fk_importHistoryId from dataTanamans
    await queryInterface.removeColumn('dataTanamans', 'fk_importHistoryId');
    // 2. Drop riwayatImports table
    await queryInterface.dropTable('riwayatImports');
  }
};
