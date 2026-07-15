'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('dataTanamans', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_akun',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('dataTanamans', 'created_by');
  }
};
