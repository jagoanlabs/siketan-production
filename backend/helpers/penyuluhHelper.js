const { Op } = require('sequelize');
const { dataPenyuluh, kelompok } = require('../app/models');

/**
 * Check whether the user has penyuluh role
 * @param {Object} user - req.user object
 * @returns {boolean}
 */
const isPenyuluhUser = (user) => {
  if (!user) return false;
  const { peran, role } = user;
  const roleName = role?.name || '';
  return (
    peran === 'penyuluh' ||
    roleName === 'penyuluh' ||
    roleName === 'penyuluh_reguler' ||
    roleName === 'penyuluh_swadaya'
  );
};

/**
 * Get dataPenyuluh record belonging to the logged in user
 * @param {Object} user - req.user object
 * @returns {Promise<Object|null>}
 */
const getPenyuluhRecord = async (user) => {
  if (!user) return null;

  const orConditions = [];
  if (user.accountID) orConditions.push({ accountID: user.accountID });
  if (user.id) orConditions.push({ accountID: user.id });
  if (user.email) orConditions.push({ email: user.email });
  if (user.nik || user.NIK) orConditions.push({ nik: user.nik || user.NIK });
  if (user.nama) orConditions.push({ nama: user.nama });

  if (orConditions.length === 0) return null;

  const penyuluh = await dataPenyuluh.findOne({
    where: { [Op.or]: orConditions }
  });

  return penyuluh;
};

/**
 * Get list of Poktan IDs assigned strictly to this penyuluh
 * @param {number|string} penyuluhId - ID of dataPenyuluh
 * @returns {Promise<number[]>}
 */
const getAssignedPoktanIds = async (penyuluhId) => {
  if (!penyuluhId) return [];

  const groups = await kelompok.findAll({
    where: {
      [Op.or]: [
        { penyuluh: String(penyuluhId) },
        { penyuluh: Number(penyuluhId) }
      ]
    },
    attributes: ['id']
  });

  return groups.map((g) => g.id);
};

module.exports = {
  isPenyuluhUser,
  getPenyuluhRecord,
  getAssignedPoktanIds
};
