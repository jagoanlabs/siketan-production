'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Get permission id for 'statistic_realisasi'
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions WHERE name = 'statistic_realisasi' LIMIT 1",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!permissions || permissions.length === 0) {
      console.log('Permission statistic_realisasi not found in permissions table');
      return;
    }

    const permissionId = permissions[0].id;

    // 2. Get role ids for 'penyuluh' and 'penyuluh_swadaya'
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles WHERE name IN ('penyuluh', 'penyuluh_swadaya')",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const role of roles) {
      // Check if mapping already exists
      const existing = await queryInterface.sequelize.query(
        'SELECT id FROM role_permissions WHERE role_id = :roleId AND permission_id = :permissionId',
        {
          replacements: { roleId: role.id, permissionId },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );

      if (!existing || existing.length === 0) {
        await queryInterface.bulkInsert('role_permissions', [
          {
            role_id: role.id,
            permission_id: permissionId,
            created_at: now,
            updated_at: now
          }
        ]);
        console.log(`Assigned statistic_realisasi permission to role ${role.name}`);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const permissions = await queryInterface.sequelize.query(
      "SELECT id FROM permissions WHERE name = 'statistic_realisasi' LIMIT 1",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!permissions || permissions.length === 0) return;
    const permissionId = permissions[0].id;

    const roles = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name IN ('penyuluh', 'penyuluh_swadaya')",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const roleIds = roles.map((r) => r.id);
    if (roleIds.length > 0) {
      await queryInterface.sequelize.query(
        'DELETE FROM role_permissions WHERE permission_id = :permissionId AND role_id IN (:roleIds)',
        {
          replacements: { permissionId, roleIds }
        }
      );
    }
  }
};
