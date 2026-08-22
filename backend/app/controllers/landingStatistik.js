const {
  dataPetani,
  kelompok,
  dataPenyuluh,
  dataTanaman,
  tanamanPetani,
  sequelize,
  Sequelize
} = require('../models');

const { Op } = Sequelize;

const normalizeKomoditas = (komoditas) => {
  if (!komoditas) return null;

  const normalized = komoditas
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  const komoditasMap = {
    padi: 'padi_konvensional',
    padi_konvensional: 'padi_konvensional',
    padi_ramah_lingkungan: 'padi_ramah_lingkungan',
    padi_organik: 'padi_organik',
    jagung: 'jagung',
    kedelai: 'kedelai',
    kedelei: 'kedelai',
    ubi_jalar: 'ubi_jalar',
    ubi: 'ubi_jalar',
    singkong: 'singkong',
    ubi_kayu: 'singkong',
    kacang_tanah: 'kacang_tanah',
    kacang_hijau: 'kacang_hijau',
    kacang_panjang: 'kacang_panjang',
    cabai: 'cabai',
    cabe: 'cabai',
    cabe_kecil: 'cabe_kecil',
    bawang_merah: 'bawang_merah',
    bawang_putih: 'bawang_putih',
    tomat: 'tomat',
    kentang: 'kentang',
    wortel: 'wortel',
    kangkung: 'kangkung',
    sayuran: 'sayuran_lain',
    sayuran_lain: 'sayuran_lain',
    perkebunan_tebu: 'perkebunan_tebu',
    perkebunan_tembakau: 'perkebunan_tembakau',
    tebu: 'perkebunan_tebu',
    tembakau: 'perkebunan_tembakau',
    lainnya: 'lainnya'
  };

  return komoditasMap[normalized] || normalized;
};

const monthNameToIndex = (monthStr) => {
  if (!monthStr || typeof monthStr !== 'string') return -1;
  const clean = monthStr.trim().toLowerCase();
  if (clean.startsWith('jan')) return 0;
  if (clean.startsWith('feb')) return 1;
  if (clean.startsWith('mar')) return 2;
  if (clean.startsWith('apr')) return 3;
  if (clean.startsWith('mei') || clean.startsWith('may')) return 4;
  if (clean.startsWith('jun')) return 5;
  if (clean.startsWith('jul')) return 6;
  if (clean.startsWith('agu') || clean.startsWith('aug')) return 7;
  if (clean.startsWith('sep')) return 8;
  if (clean.startsWith('okt') || clean.startsWith('oct')) return 9;
  if (clean.startsWith('nov') || clean.startsWith('nop')) return 10;
  if (clean.startsWith('des') || clean.startsWith('dec')) return 11;
  return -1;
};

const getLandingStatistik = async (req, res) => {
  try {
    const { tahun = new Date().getFullYear() } = req.query;
    const yearNum = Number(tahun) || new Date().getFullYear();

    const jumlahPetani = await dataPetani.count({ where: { deletedAt: null } });
    const jumlahGapoktan = await kelompok.count();
    const jumlahPenyuluh = await dataPenyuluh.count({ where: { deletedAt: null } });

    const whereDataTanaman = {
      komoditas: { [Op.not]: null, [Op.ne]: '' },
      prakiraanBulanPanen: { [Op.not]: null, [Op.ne]: '', [Op.ne]: '-' }
    };

    if (tahun && tahun !== 'all') {
      whereDataTanaman.createdAt = {
        [Op.between]: [
          new Date(`${yearNum}-01-01 00:00:00`),
          new Date(`${yearNum}-12-31 23:59:59`)
        ]
      };
    }

    const areaPertanian =
      (await dataTanaman.sum('luasLahan', { where: whereDataTanaman })) ||
      (await dataTanaman.sum('luasLahan')) ||
      (await tanamanPetani.sum('luasLahan', { where: { deletedAt: null } })) ||
      0;

    const komoditasData = await dataTanaman.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('komoditas')), 'komoditas']],
      where: { komoditas: { [Op.not]: null, [Op.ne]: '' } },
      raw: true
    });
    const jumlahKomoditas = komoditasData.length;

    const dataKomoditasPerBulan = await dataTanaman.findAll({
      attributes: [
        'prakiraanBulanPanen',
        'komoditas',
        [sequelize.fn('SUM', sequelize.col('prakiraanHasilPanen')), 'totalHasilPanen'],
        [sequelize.fn('SUM', sequelize.col('luasLahan')), 'totalLuasLahan'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'jumlah']
      ],
      where: whereDataTanaman,
      group: ['prakiraanBulanPanen', 'komoditas'],
      raw: true
    });

    const allNormalizedCommodities = new Set([
      'padi_konvensional',
      'padi_ramah_lingkungan',
      'padi_organik',
      'jagung',
      'kedelai',
      'ubi_jalar',
      'singkong',
      'kacang_tanah',
      'kacang_hijau',
      'cabai',
      'bawang_merah',
      'bawang_putih',
      'tomat',
      'kentang',
      'wortel',
      'sayuran_lain',
      'perkebunan_tebu',
      'perkebunan_tembakau',
      'lainnya'
    ]);

    dataKomoditasPerBulan.forEach((item) => {
      const norm = normalizeKomoditas(item.komoditas);
      if (norm) allNormalizedCommodities.add(norm);
    });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des'
    ];

    const commodityData = months.map((month, index) => {
      const commoditiesObj = {};
      allNormalizedCommodities.forEach((c) => {
        commoditiesObj[c] = 0;
      });

      const monthData = {
        month: month,
        commodities: commoditiesObj
      };

      const monthDataFromDB = dataKomoditasPerBulan.filter(
        (item) => monthNameToIndex(item.prakiraanBulanPanen) === index
      );

      monthDataFromDB.forEach((item) => {
        const normalizedKomoditas = normalizeKomoditas(item.komoditas);
        const hasilPanen = parseFloat(item.totalHasilPanen) || 0;
        if (normalizedKomoditas && monthData.commodities[normalizedKomoditas] !== undefined) {
          monthData.commodities[normalizedKomoditas] += hasilPanen;
        } else if (normalizedKomoditas) {
          monthData.commodities[normalizedKomoditas] = hasilPanen;
        } else {
          monthData.commodities.lainnya += hasilPanen;
        }
      });

      return monthData;
    });

    res.status(200).json({
      success: true,
      message: 'Data statistik landing page berhasil diambil',
      data: {
        ringkasan: {
          jumlahPetani: jumlahPetani || 0,
          jumlahGapoktan: jumlahGapoktan || 0,
          jumlahPenyuluh: jumlahPenyuluh || 0,
          areaPertanian: areaPertanian ? parseFloat(areaPertanian) : 0,
          jumlahKomoditas: jumlahKomoditas || 0
        },
        commodityData: commodityData
      }
    });
  } catch (error) {
    console.error('Error getting landing statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data statistik',
      error: error.message
    });
  }
};

module.exports = { getLandingStatistik };
