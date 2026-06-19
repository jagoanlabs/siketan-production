const router = require('express').Router();
const { PERMISSIONS } = require('../../helpers/roleHelpers');
const { auth, hasPermission } = require('../../midleware/auth');
const upload = require('../../midleware/uploader');
const {
  tambahDataTanaman,
  getAllDataTanaman,
  getDetailedDataTanaman,
  editDataTanaman,
  hapusDataTanaman,
  uploadDataTanaman,
  fixKategori,
  fixKomoditas,
  getStatistikYears,
  getRiwayatImport,
  downloadRealisasiTemplate,
  uploadRealisasiData
} = require('../controllers/dataTanaman');

router.post('/', auth, hasPermission(PERMISSIONS.STATISTIC_CREATE), tambahDataTanaman);
router.get('/', auth, hasPermission(PERMISSIONS.STATISTIC_INDEX), getAllDataTanaman);
router.get('/years', auth, hasPermission(PERMISSIONS.STATISTIC_INDEX), getStatistikYears);
router.get('/riwayat', auth, hasPermission(PERMISSIONS.STATISTIC_INDEX), getRiwayatImport);
router.get(
  '/riwayat/:id/download-template',
  auth,
  hasPermission(PERMISSIONS.STATISTIC_INDEX),
  downloadRealisasiTemplate
);
router.post(
  '/riwayat/:id/upload-realisasi',
  auth,
  hasPermission(PERMISSIONS.STATISTIC_REALISASI),
  upload.single('file'),
  uploadRealisasiData
);
router.get('/:id', auth, hasPermission(PERMISSIONS.STATISTIC_INDEX), getDetailedDataTanaman);
router.put('/:id', auth, hasPermission(PERMISSIONS.STATISTIC_EDIT), editDataTanaman);
router.delete('/:id', auth, hasPermission(PERMISSIONS.STATISTIC_DELETE), hapusDataTanaman);
router.post(
  '/upload',
  auth,
  hasPermission(PERMISSIONS.STATISTIC_CREATE),
  upload.single('file'),
  uploadDataTanaman
);
router.put('/fix/category', auth, fixKategori);
router.put('/fix/commodity', auth, fixKomoditas);

module.exports = router;
