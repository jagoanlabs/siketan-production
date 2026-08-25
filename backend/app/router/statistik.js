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
  updateRealisasiBulk,
  fixKategori,
  fixKomoditas,
  getStatistikYears
} = require('../controllers/dataTanaman');

router.post('/', auth, hasPermission(PERMISSIONS.STATISTIC_CREATE), tambahDataTanaman);
router.get('/', auth, hasPermission(PERMISSIONS.STATISTIC_INDEX), getAllDataTanaman);
router.get('/years', auth, hasPermission(PERMISSIONS.STATISTIC_INDEX), getStatistikYears);
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
router.post(
  '/update-realisasi',
  auth,
  hasPermission(PERMISSIONS.STATISTIC_EDIT),
  upload.single('file'),
  updateRealisasiBulk
);
router.put('/fix/category', auth, fixKategori);
router.put('/fix/commodity', auth, fixKomoditas);

module.exports = router;
