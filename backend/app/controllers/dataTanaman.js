const {
  dataTanaman,
  kelompok,
  dataPenyuluh,
  dataOperator,
  kecamatan,
  desa,
  tbl_akun
} = require('../models');

const ApiError = require('../../utils/ApiError');
const dotenv = require('dotenv');
const { Op, Sequelize } = require('sequelize');
const ExcelJS = require('exceljs');
const moment = require('moment');
const { postActivity } = require('./logActivity');
const { getPenyuluhRecord, getAssignedPoktanIds, isPenyuluhUser } = require('../../helpers/penyuluhHelper');
const {
  tanamanPangan,
  tanamanPerkebunan,
  komoditasSemusim,
  komoditasTahunan
} = require('../../utils/constants/tanaman');
const monthOrder = require('../../utils/constants/months');

dotenv.config();

const getAllDataTanaman = async (req, res) => {
  const { peran, id: userId, role } = req.user || {};
  const { limit, page, sortBy, sortType, poktan_id, isExport, search, kategori, komoditas, tahun, prakiraanMin, prakiraanMax, kecamatan } =
    req.query;

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const limitFilter = Number(limit) || 10;
    const pageFilter = Number(page) || 1;
    const isExportFilter = Boolean(isExport);

    // base filter
    const whereClause = {};

    // Role detection
    const operatorRoles = ['operator_super_admin', 'operator_admin', 'operator_poktan'];
    const isOperator = (role && operatorRoles.includes(role.name)) || peran === 'operator';
    const isPenyuluh = isPenyuluhUser(req.user);

    if (isPenyuluh) {
      // Exclude data without createdAt for Penyuluh
      whereClause.createdAt = { [Op.not]: null };

      const penyuluhData = await getPenyuluhRecord(req.user);
      const binaanIds = penyuluhData ? await getAssignedPoktanIds(penyuluhData.id) : [];

      if (poktan_id && poktan_id !== 'undefined') {
        const poktanArray = Array.isArray(poktan_id)
          ? poktan_id
          : typeof poktan_id === 'string' && poktan_id.includes(',')
            ? poktan_id.split(',').map((id) => Number(id.trim())).filter(Boolean)
            : [Number(poktan_id)];

        const allowedPoktan = poktanArray.filter((id) => binaanIds.includes(id));
        whereClause.fk_kelompokId = { [Op.in]: allowedPoktan.length > 0 ? allowedPoktan : [-1] };
      } else {
        whereClause.fk_kelompokId = { [Op.in]: binaanIds.length > 0 ? binaanIds : [-1] };
      }
    } else if (isOperator) {
      // Operator bisa melihat semua data, atau filter berdasarkan poktan jika dipilih
      if (poktan_id && poktan_id !== 'undefined') {
        const poktanArray = Array.isArray(poktan_id)
          ? poktan_id
          : typeof poktan_id === 'string' && poktan_id.includes(',')
            ? poktan_id.split(',').map((id) => id.trim()).filter(Boolean)
            : [poktan_id];

        if (poktanArray.length === 1) {
          whereClause.fk_kelompokId = { [Op.eq]: poktanArray[0] };
        } else if (poktanArray.length > 1) {
          whereClause.fk_kelompokId = { [Op.in]: poktanArray };
        }
      }
    } else {
      whereClause.created_by = userId;
    }

    // filter kategori
    if (kategori && kategori !== 'undefined') {
      whereClause.kategori = { [Op.like]: `%${kategori}%` };
    }

    // filter komoditas
    if (komoditas && komoditas !== 'undefined') {
      whereClause.komoditas = { [Op.eq]: komoditas };
    }

    // filter tahun (created at)
    if (tahun && tahun !== 'undefined') {
      const yearNum = Number(tahun);
      if (!isNaN(yearNum)) {
        whereClause['$dataTanaman.createdAt$'] = {
          [Op.and]: [
            { [Op.gte]: `${yearNum}-01-01 00:00:00` },
            { [Op.lte]: `${yearNum}-12-31 23:59:59` }
          ]
        };
      }
    }

    // filter prakiraan panen range
    if ((prakiraanMin && prakiraanMin !== 'undefined') || (prakiraanMax && prakiraanMax !== 'undefined')) {
      const plantingMonthSql = `CASE periodeTanam
        WHEN 'Januari' THEN 1
        WHEN 'Februari' THEN 2
        WHEN 'Maret' THEN 3
        WHEN 'April' THEN 4
        WHEN 'Mei' THEN 5
        WHEN 'Juni' THEN 6
        WHEN 'Juli' THEN 7
        WHEN 'Agustus' THEN 8
        WHEN 'September' THEN 9
        WHEN 'Oktober' THEN 10
        WHEN 'November' THEN 11
        WHEN 'Desember' THEN 12
        ELSE 1
      END`;

      const harvestMonthSql = `CASE prakiraanBulanPanen
        WHEN 'Januari' THEN 1
        WHEN 'Februari' THEN 2
        WHEN 'Maret' THEN 3
        WHEN 'April' THEN 4
        WHEN 'Mei' THEN 5
        WHEN 'Juni' THEN 6
        WHEN 'Juli' THEN 7
        WHEN 'Agustus' THEN 8
        WHEN 'September' THEN 9
        WHEN 'Oktober' THEN 10
        WHEN 'November' THEN 11
        WHEN 'Desember' THEN 12
        ELSE 1
      END`;

      const harvestYearSql = `CASE
        WHEN (${harvestMonthSql}) < (${plantingMonthSql}) THEN YEAR(\`dataTanaman\`.\`createdAt\`) + 1
        ELSE YEAR(\`dataTanaman\`.\`createdAt\`)
      END`;

      const harvestValueSql = `((${harvestYearSql}) * 100 + (${harvestMonthSql}))`;

      const conditions = [];

      if (prakiraanMin && prakiraanMin !== 'undefined') {
        const [minYear, minMonth] = prakiraanMin.split('-').map(Number);
        if (!isNaN(minYear) && !isNaN(minMonth)) {
          const minVal = minYear * 100 + minMonth;
          conditions.push(
            Sequelize.where(Sequelize.literal(harvestValueSql), { [Op.gte]: minVal })
          );
        }
      }

      if (prakiraanMax && prakiraanMax !== 'undefined') {
        const [maxYear, maxMonth] = prakiraanMax.split('-').map(Number);
        if (!isNaN(maxYear) && !isNaN(maxMonth)) {
          const maxVal = maxYear * 100 + maxMonth;
          conditions.push(
            Sequelize.where(Sequelize.literal(harvestValueSql), { [Op.lte]: maxVal })
          );
        }
      }

      if (conditions.length > 0) {
        if (!whereClause[Op.and]) {
          whereClause[Op.and] = [];
        }
        whereClause[Op.and].push(...conditions);
      }
    }

    // pencarian umum (kategori / komoditas / periodeTanam / kelompok.namaKelompok / kelompok.kecamatan / kelompok.desa)
    if (search && search !== 'undefined') {
      whereClause[Op.or] = [
        { kategori: { [Op.like]: `%${search}%` } },
        { komoditas: { [Op.like]: `%${search}%` } },
        { periodeTanam: { [Op.like]: `%${search}%` } },
        { '$kelompok.namaKelompok$': { [Op.like]: `%${search}%` } },
        { '$kelompok.kecamatan$': { [Op.like]: `%${search}%` } },
        { '$kelompok.desa$': { [Op.like]: `%${search}%` } }
      ];
    }

    const isFilteredByPoktan = isPenyuluh || Boolean(poktan_id && poktan_id !== 'undefined');
    const isFilteredByKecamatan = Boolean(kecamatan && kecamatan !== 'undefined' && kecamatan.trim() !== '');

    const kelompokWhere = {};
    if (isFilteredByKecamatan) {
      kelompokWhere.kecamatan = kecamatan.trim();
    }

    const kelompokInclude = {
      model: kelompok,
      as: 'kelompok',
      required: isFilteredByPoktan || isFilteredByKecamatan,
      ...(isFilteredByKecamatan ? { where: kelompokWhere } : {})
    };

    const filter = {
      where: whereClause,
      include: [kelompokInclude],
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'id', sortType || 'DESC']]
    };

    const data = await dataTanaman.findAll(
      isExportFilter
        ? { where: whereClause, include: [kelompokInclude] }
        : filter
    );

    if (isExportFilter && req.user?.id) {
      postActivity({
        user_id: req.user.id,
        activity: 'EXPORT',
        type: 'DATA TANAMAN'
      });
    }

    const total = await dataTanaman.count({
      where: whereClause,
      include: [kelompokInclude],
      distinct: true
    });

    res.status(200).json({
      message: 'Data berhasil didapatkan.',
      data: {
        data,
        total,
        currentPages: pageFilter,
        limit: limitFilter,
        maxPages: Math.ceil(total / limitFilter),
        from: pageFilter ? (pageFilter - 1) * limitFilter + 1 : 1,
        to: pageFilter ? (pageFilter - 1) * limitFilter + data.length : data.length,
        sortBy: sortBy || 'id',
        sortType: sortType || 'DESC'
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const fixKategori = async (req, res) => {
  const { peran } = req.user || {};
  const { category } = req.query;
  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const whereFilter = category ? { where: { kategori: category } } : {};
    const data = await dataTanaman.findAll(whereFilter);

    if (whereFilter.where) {
      return res.status(200).json({ message: 'Data berhasil didapatkan.', data });
    }

    data.forEach(async (item) => {
      let correctCategory = '';
      if (tanamanPangan.includes(item.komoditas)) {
        correctCategory = 'pangan';
      } else if (
        tanamanPerkebunan.includes(item.komoditas) ||
        item.komoditas.toLowerCase().includes('perkebunan')
      ) {
        correctCategory = 'perkebunan';
      } else if (komoditasSemusim.includes(item.komoditas)) {
        correctCategory = 'buah';
      } else if (komoditasTahunan.includes(item.komoditas)) {
        correctCategory = 'sayur';
      }
      await item.update({ kategori: correctCategory });
    });

    res.status(200).json({ message: 'Data berhasil diupdate.' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const fixKomoditas = async (req, res) => {
  const { peran } = req.user || {};
  const { wrongKomoditas, correctKomoditas, getWrong, debug } = req.query;
  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    if (getWrong) {
      const correctKomoditas = tanamanPangan
        .concat(tanamanPerkebunan)
        .concat(komoditasSemusim)
        .concat(komoditasTahunan)
        .concat(['Perkebunan Tebu', 'Perkebunan Tembakau']);
      return res.status(200).json({
        message: 'Data berhasil didapatkan.',
        data: await dataTanaman.findAll({
          where: { komoditas: { [Op.notIn]: correctKomoditas } }
        })
      });
    }

    const data = await dataTanaman.findAll({ where: { komoditas: wrongKomoditas } });
    if (debug) {
      return res.status(200).json({ message: 'Data berhasil didapatkan.', data });
    }
    data.forEach(async (item) => {
      await item.update({ komoditas: correctKomoditas });
    });

    res.status(200).json({ message: 'Data berhasil diupdate.' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getDetailedDataTanaman = async (req, res) => {
  const { id } = req.params;
  const { peran } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const data = await dataTanaman.findOne({
      where: { id },
      include: [
        { model: kelompok, as: 'kelompok' },
        {
          model: tbl_akun,
          as: 'creator',
          attributes: ['id', 'nama', 'email', 'peran', 'foto']
        }
      ]
    });

    res.status(200).json({ message: 'Data berhasil didapatkan.', data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const tambahDataTanaman = async (req, res) => {
  const { peran, id } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const {
      kategori,
      komoditas,
      periodeTanam,
      luasLahan,
      prakiraanLuasPanen,
      prakiraanHasilPanen,
      prakiraanBulanPanen,
      fk_kelompokId
    } = req.body;

    if (!kategori) throw new ApiError(400, 'Kategori tidak boleh kosong.');
    if (!komoditas) throw new ApiError(400, 'Komoditas tidak boleh kosong.');
    if (!periodeTanam) throw new ApiError(400, 'Periode tanam tidak boleh kosong.');
    if (!luasLahan) throw new ApiError(400, 'Luas lahan tidak boleh kosong.');
    if (!prakiraanLuasPanen) throw new ApiError(400, 'Prakiraan luas panen tidak boleh kosong.');
    if (!prakiraanHasilPanen) throw new ApiError(400, 'Prakiraan hasil panen tidak boleh kosong.');
    if (!prakiraanBulanPanen) throw new ApiError(400, 'Prakiraan bulan panen tidak boleh kosong.');
    if (!fk_kelompokId) throw new ApiError(400, 'Kelompok tidak boleh kosong.');

    const kelompokTani = await kelompok.findOne({ where: { id: fk_kelompokId } });
    if (!kelompokTani) throw new ApiError(400, 'Kelompok tidak ditemukan.');

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth(); // 0 = Jan, 11 = Des
    const currentDay = now.getDate();
    const inputYear = req.body.tahun ? Number(req.body.tahun) : currentYear;
    const monthIdx = monthOrder.indexOf(periodeTanam);

    if (monthIdx === -1) {
      throw new ApiError(400, 'Format periode/bulan tanam tidak valid.');
    }

    // Role-based validation khusus role Penyuluh (Operator/Admin bebas menginput 12 bulan)
    const isPenyuluh = peran === 'penyuluh' || (req.user?.role?.name && req.user.role.name.includes('penyuluh'));
    if (isPenyuluh) {
      // 1. Penyuluh tidak boleh input bulan tanam di masa depan
      if (inputYear > currentYear || (inputYear === currentYear && monthIdx > currentMonthIdx)) {
        throw new ApiError(400, 'Periode/Bulan tanam tidak boleh di masa depan.');
      }

      // 2. Sistem W1 untuk penyuluh
      const isCurrentMonth = inputYear === currentYear && monthIdx === currentMonthIdx;
      const isPrevMonth =
        (currentMonthIdx === 0 && monthIdx === 11 && inputYear === currentYear - 1) ||
        (inputYear === currentYear && monthIdx === currentMonthIdx - 1);

      if (isPrevMonth) {
        if (currentDay > 7) {
          const currentMonthName = monthOrder[currentMonthIdx];
          throw new ApiError(
            400,
            `Batas waktu penginputan data tanaman periode ${periodeTanam} ${inputYear} telah berakhir pada tanggal 7 ${currentMonthName} pukul 23:59.`
          );
        }
      } else if (!isCurrentMonth) {
        throw new ApiError(
          400,
          `Penginputan data tanaman periode ${periodeTanam} ${inputYear} sudah melewati batas waktu.`
        );
      }

      // Validasi 1 data per kelompok tani per periode tanam per tahun
      const existingData = await dataTanaman.findOne({
        where: {
          fk_kelompokId,
          periodeTanam,
          createdAt: {
            [Op.between]: [
              new Date(`${inputYear}-01-01 00:00:00`),
              new Date(`${inputYear}-12-31 23:59:59`)
            ]
          }
        }
      });

      if (existingData) {
        throw new ApiError(
          400,
          `Data tanaman untuk kelompok tani ini pada periode ${periodeTanam} sudah diinput. Penyuluh hanya dapat menginput 1 data per kelompok tani per bulan.`
        );
      }
    }

    const data = await dataTanaman.create({
      kategori,
      komoditas,
      periodeTanam,
      luasLahan,
      prakiraanLuasPanen,
      prakiraanHasilPanen,
      prakiraanBulanPanen,
      fk_kelompokId,
      created_by: id
    });

    postActivity({ user_id: id, activity: 'CREATE', type: 'DATA TANAMAN', detail_id: data.id });

    res.status(201).json({ message: 'Data berhasil ditambahkan.', data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const editDataTanaman = async (req, res) => {
  const { id } = req.params;
  const { peran, id: UserId } = req.user || {};

  try {
    if (peran === 'petani' || peran === 'penyuluh' || peran === 'operator poktan') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    const {
      kategori,
      komoditas,
      periodeTanam,
      luasLahan,
      prakiraanLuasPanen,
      prakiraanHasilPanen,
      prakiraanBulanPanen,
      fk_kelompokId,
      realisasiLuasPanen,
      realisasiHasilPanen,
      realisasiBulanPanen
    } = req.body;

    if (!kategori) throw new ApiError(400, 'Kategori tidak boleh kosong.');
    if (!komoditas) throw new ApiError(400, 'Komoditas tidak boleh kosong.');
    if (!periodeTanam) throw new ApiError(400, 'Periode tanam tidak boleh kosong.');
    if (!luasLahan) throw new ApiError(400, 'Luas lahan tidak boleh kosong.');
    if (!prakiraanLuasPanen) throw new ApiError(400, 'Prakiraan luas panen tidak boleh kosong.');
    if (!prakiraanHasilPanen) throw new ApiError(400, 'Prakiraan hasil panen tidak boleh kosong.');
    if (!prakiraanBulanPanen) throw new ApiError(400, 'Prakiraan bulan panen tidak boleh kosong.');
    if (!fk_kelompokId) throw new ApiError(400, 'Kelompok tidak boleh kosong.');

    const kelompokTani = await kelompok.findOne({ where: { id: fk_kelompokId } });
    if (!kelompokTani) throw new ApiError(400, 'Kelompok tidak ditemukan.');

    await dataTanaman.update(
      {
        kategori,
        komoditas,
        periodeTanam,
        luasLahan,
        prakiraanLuasPanen,
        prakiraanHasilPanen,
        prakiraanBulanPanen,
        fk_kelompokId,
        realisasiLuasPanen,
        realisasiHasilPanen,
        realisasiBulanPanen
      },
      { where: { id } }
    );

    postActivity({ user_id: UserId, activity: 'EDIT', type: 'DATA TANAMAN', detail_id: id });

    res.status(201).json({ message: 'Data berhasil diupdate.', data: req.body });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const hapusDataTanaman = async (req, res) => {
  const { id } = req.params;
  const { peran, id: UserId } = req.user || {};

  try {
    if (peran === 'petani' || peran === 'penyuluh' || peran === 'operator poktan') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    await dataTanaman.destroy({ where: { id } });

    postActivity({ user_id: UserId, activity: 'DELETE', type: 'DATA TANAMAN', detail_id: id });

    res.status(200).json({ message: 'Data berhasil dihapus.' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const uploadDataTanaman = async (req, res) => {
  const { file } = req;
  const { id: userId, peran } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    if (!file) {
      throw new ApiError(400, 'File tidak boleh kosong.');
    }

    // Validasi tipe file
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (!allowedMimeTypes.includes(file.mimetype) && !file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
      throw new ApiError(
        400,
        'Format file tidak valid. Harap upload file Excel (.xlsx atau .xls).'
      );
    }

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(file.buffer);
    } catch (error) {
      throw new ApiError(
        400,
        'File Excel tidak valid atau rusak. Pastikan file dalam format .xlsx yang benar.'
      );
    }
    const worksheet = workbook.worksheets[0] || workbook.getWorksheet(1);
    if (!worksheet) {
      throw new ApiError(400, 'Sheet tidak ditemukan di dalam file Excel.');
    }

    const rowCount = worksheet.rowCount;
    if (rowCount < 2) throw new ApiError(400, 'Data tidak ditemukan.');

    let successCount = 0;

    for (let i = 2; i <= rowCount; i++) {
      const row = worksheet.getRow(i);

      let isRowEmpty = true;
      for (let j = 1; j <= 8; j++) {
        if (row.getCell(j).value !== null && row.getCell(j).value !== undefined && row.getCell(j).value !== '') {
          isRowEmpty = false;
          break;
        }
      }
      if (isRowEmpty) {
        continue;
      }

      const fk_kelompokId = row.getCell(1).value;
      let kategori = row.getCell(2).value;
      let komoditas = row.getCell(3).value;
      let periodeTanam = row.getCell(4).value;
      const luasLahan = row.getCell(5).value;
      const prakiraanLuasPanen = row.getCell(6).value;
      const prakiraanHasilPanen = row.getCell(7).value;
      let prakiraanBulanPanen = row.getCell(8).value;

      if (!fk_kelompokId) {
        throw new ApiError(400, `ID Poktan tidak boleh kosong. Data baris ${i}`);
      }

      const kelompokTani = await kelompok.findOne({ where: { id: fk_kelompokId } });
      if (!kelompokTani) {
        throw new ApiError(
          400,
          `Kelompok tani dengan ID (${fk_kelompokId}) tidak ditemukan. Data baris ${i}`
        );
      }

      if (typeof kategori === 'string') {
        kategori = kategori.toLowerCase().trim();
        if (kategori === 'jenis_sayur') kategori = 'sayur';
      }
      if (!['pangan', 'perkebunan', 'sayur', 'buah'].includes(kategori)) {
        throw new ApiError(
          400,
          `Kategori (${kategori}) tidak valid. Data baris ${i}`
        );
      }

      if (typeof komoditas === 'string') {
        komoditas = toTitleCase(komoditas.trim());
      }
      if (!komoditas) {
        throw new ApiError(400, `Komoditas tidak boleh kosong. Data baris ${i}`);
      }

      if (typeof periodeTanam === 'string') {
        periodeTanam = toTitleCase(periodeTanam.trim());
      }
      if (!monthOrder.includes(periodeTanam)) {
        throw new ApiError(400, `Periode tanam (${periodeTanam}) tidak valid. Data baris ${i}`);
      }

      if (!luasLahan || isNaN(Number(luasLahan))) {
        throw new ApiError(400, `Luas lahan tanam tidak valid. Data baris ${i}`);
      }
      if (!prakiraanLuasPanen || isNaN(Number(prakiraanLuasPanen))) {
        throw new ApiError(400, `Prakiraan luas panen tidak valid. Data baris ${i}`);
      }
      if (!prakiraanHasilPanen || isNaN(Number(prakiraanHasilPanen))) {
        throw new ApiError(400, `Prakiraan hasil panen tidak valid. Data baris ${i}`);
      }

      if (typeof prakiraanBulanPanen === 'string') {
        prakiraanBulanPanen = toTitleCase(prakiraanBulanPanen.trim());
      }
      if (prakiraanBulanPanen && !monthOrder.includes(prakiraanBulanPanen)) {
        throw new ApiError(400, `Prakiraan bulan panen (${prakiraanBulanPanen}) tidak valid. Data baris ${i}`);
      }

      await dataTanaman.create({
        fk_kelompokId,
        kategori,
        komoditas,
        periodeTanam,
        luasLahan: Number(luasLahan),
        prakiraanLuasPanen: Number(prakiraanLuasPanen),
        prakiraanHasilPanen: Number(prakiraanHasilPanen),
        prakiraanBulanPanen: prakiraanBulanPanen || null,
        created_by: userId
      });
      successCount++;
    }

    postActivity({
      user_id: userId,
      activity: 'IMPORT',
      type: 'DATA TANAMAN'
    });

    res.status(201).json({ message: `${successCount} data berhasil diimport.` });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateRealisasiBulk = async (req, res) => {
  const { file } = req;
  const { id: userId, peran } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }
    if (!file) {
      throw new ApiError(400, 'File tidak boleh kosong.');
    }

    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (!allowedMimeTypes.includes(file.mimetype) && !file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
      throw new ApiError(
        400,
        'Format file tidak valid. Harap upload file Excel (.xlsx atau .xls).'
      );
    }

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(file.buffer);
    } catch (error) {
      throw new ApiError(
        400,
        'File Excel tidak valid atau rusak. Pastikan file dalam format .xlsx yang benar.'
      );
    }

    const worksheet = workbook.worksheets[0] || workbook.getWorksheet(1);
    if (!worksheet || worksheet.rowCount < 2) {
      throw new ApiError(400, 'Data tidak ditemukan di dalam sheet.');
    }

    // Identifikasi kolom berdasarkan nama header pada baris ke-1
    const headerRow = worksheet.getRow(1);
    let colId = -1;
    let colRealisasiLuas = -1;
    let colRealisasiHasil = -1;
    let colRealisasiBulan = -1;

    headerRow.eachCell((cell, colNumber) => {
      const val = cell.value ? String(cell.value).toLowerCase().trim() : '';
      if (val === 'id' || val === 'no id' || val.startsWith('id data')) {
        colId = colNumber;
      } else if (val.includes('realisasi') && val.includes('luas')) {
        colRealisasiLuas = colNumber;
      } else if (val.includes('realisasi') && (val.includes('hasil') || val.includes('produksi'))) {
        colRealisasiHasil = colNumber;
      } else if (val.includes('realisasi') && val.includes('bulan')) {
        colRealisasiBulan = colNumber;
      }
    });

    // Fallback index default jika header tidak terdeteksi via string
    if (colId === -1) colId = 1;
    if (colRealisasiLuas === -1) colRealisasiLuas = 14;
    if (colRealisasiHasil === -1) colRealisasiHasil = 15;
    if (colRealisasiBulan === -1) colRealisasiBulan = 16;

    let updatedCount = 0;
    const rowCount = worksheet.rowCount;

    for (let i = 2; i <= rowCount; i++) {
      const row = worksheet.getRow(i);

      let isRowEmpty = true;
      for (let j = 1; j <= 20; j++) {
        if (row.getCell(j).value !== null && row.getCell(j).value !== undefined && row.getCell(j).value !== '') {
          isRowEmpty = false;
          break;
        }
      }
      if (isRowEmpty) continue;

      const idVal = row.getCell(colId).value;
      if (!idVal) continue;

      const recordId = Number(String(idVal).replace(/[^0-9]/g, ''));
      if (!recordId || isNaN(recordId)) continue;

      const rawLuas = row.getCell(colRealisasiLuas).value;
      const rawHasil = row.getCell(colRealisasiHasil).value;
      const rawBulan = row.getCell(colRealisasiBulan).value;

      const item = await dataTanaman.findByPk(recordId);
      if (!item) continue;

      const updateData = {};

      if (rawLuas !== null && rawLuas !== undefined && rawLuas !== '' && rawLuas !== '-') {
        const numLuas = parseFloat(rawLuas);
        if (!isNaN(numLuas)) {
          updateData.realisasiLuasPanen = numLuas;
        }
      }

      if (rawHasil !== null && rawHasil !== undefined && rawHasil !== '' && rawHasil !== '-') {
        const numHasil = parseFloat(rawHasil);
        if (!isNaN(numHasil)) {
          updateData.realisasiHasilPanen = numHasil;
        }
      }

      if (rawBulan !== null && rawBulan !== undefined && rawBulan !== '' && rawBulan !== '-') {
        const strBulan = String(rawBulan).trim();
        const titleBulan = toTitleCase(strBulan);
        if (monthOrder.includes(titleBulan) || monthOrder.includes(strBulan)) {
          updateData.realisasiBulanPanen = monthOrder.includes(titleBulan) ? titleBulan : strBulan;
        }
      }

      if (Object.keys(updateData).length > 0) {
        await item.update(updateData);
        updatedCount++;
      }
    }

    postActivity({
      user_id: userId,
      activity: 'UPDATE_REALISASI_BULK',
      type: 'DATA TANAMAN'
    });

    res.status(200).json({
      message: `${updatedCount} data realisasi berhasil diperbarui.`,
      updatedCount
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getStatistikYears = async (req, res) => {
  const { peran, role } = req.user || {};
  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const isPenyuluh =
      peran === 'penyuluh' ||
      (role && (role.name === 'penyuluh' || role.name === 'penyuluh_swadaya' || role.name?.includes('penyuluh')));

    const whereQuery = {};
    if (isPenyuluh) {
      const orConditions = [];
      if (req.user.accountID) orConditions.push({ accountID: req.user.accountID });
      if (req.user.id) orConditions.push({ accountID: req.user.id });
      if (req.user.email) orConditions.push({ email: req.user.email });
      if (req.user.nik || req.user.NIK) orConditions.push({ nik: req.user.nik || req.user.NIK });
      if (req.user.nama) orConditions.push({ nama: req.user.nama });

      const penyuluhData = orConditions.length > 0
        ? await dataPenyuluh.findOne({
            where: { [Op.or]: orConditions }
          })
        : null;

      let penyuluhCondition = { id: -1 };
      if (penyuluhData) {
        const condList = [
          { penyuluh: penyuluhData.id },
          { penyuluh: String(penyuluhData.id) }
        ];
        if (penyuluhData.nama) condList.push({ penyuluh: penyuluhData.nama });
        if (penyuluhData.nik) condList.push({ penyuluh: String(penyuluhData.nik) });

        if (penyuluhData.desaBinaan) {
          const desas = penyuluhData.desaBinaan.split(',').map((d) => d.trim()).filter(Boolean);
          if (desas.length > 0) condList.push({ desa: { [Op.in]: desas } });
        }
        if (penyuluhData.kecamatanBinaan) {
          const kecamatans = penyuluhData.kecamatanBinaan.split(',').map((k) => k.trim()).filter(Boolean);
          if (kecamatans.length > 0) condList.push({ kecamatan: { [Op.in]: kecamatans } });
        }

        penyuluhCondition = { [Op.or]: condList };
      }

      const poktanBinaan = await kelompok.findAll({
        where: penyuluhCondition,
        attributes: ['id']
      });
      const binaanIds = poktanBinaan.map((k) => k.id);
      whereQuery.fk_kelompokId = { [Op.in]: binaanIds.length > 0 ? binaanIds : [-1] };
    }

    const data = await dataTanaman.findAll({
      where: whereQuery,
      attributes: [
        [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year']
      ],
      group: [Sequelize.fn('YEAR', Sequelize.col('createdAt'))],
      raw: true
    });

    const years = data.map((item) => item.year).filter(Boolean).sort((a, b) => b - a);

    res.status(200).json({
      message: 'Daftar tahun berhasil didapatkan.',
      data: years
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getTopKomoditasTanaman = async (req, res) => {
  const { type = 'prakiraan', page = 1, limit = 5, sortBy, sortOrder } = req.query;

  try {
    const pageFilter = Number(page) || 1;
    const limitFilter = Number(limit) || 5;

    const whereQuery = { createdAt: { [Op.gte]: moment().subtract(90, 'days').toDate() } };

    const fieldMap = {
      prakiraan: { hasil: 'prakiraanHasilPanen', luas: 'prakiraanLuasPanen', bulan: 'prakiraanBulanPanen' },
      realisasi: { hasil: 'realisasiHasilPanen', luas: 'realisasiLuasPanen', bulan: 'realisasiBulanPanen' }
    };

    const selected = fieldMap[type] || fieldMap.prakiraan;

    const sortFieldMap = {
      kategori: 'kategori',
      komoditas: 'komoditas',
      periodeTanam: 'periodeTanam',
      prakiraanLuasPanen: selected.luas,
      prakiraanHasilPanen: selected.hasil,
      realisasiLuasPanen: selected.luas,
      realisasiHasilPanen: selected.hasil
    };

    const orderField = sortFieldMap[sortBy] || selected.hasil;
    const direction = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const order = [[orderField, direction]];

    const includeQuery = [
      {
        model: kelompok,
        as: 'kelompok',
        required: true,
        include: [
          { model: dataPenyuluh, as: 'dataPenyuluh' },
          { model: kecamatan, as: 'kecamatanData' },
          { model: desa, as: 'desaData' }
        ]
      },
      {
        model: tbl_akun,
        as: 'creator',
        required: false,
        include: [
          { model: dataPenyuluh, as: 'penyuluh' },
          { model: dataOperator, as: 'operator' }
        ]
      }
    ];

    const countAll = await dataTanaman.count({ where: whereQuery, include: includeQuery, distinct: true });
    // Batasi total data maksimal 10 produk tertinggi
    const total = Math.min(countAll, 10);

    const offset = (pageFilter - 1) * limitFilter;
    let effectiveLimit = limitFilter;

    if (offset >= 10) {
      effectiveLimit = 0;
    } else if (offset + limitFilter > 10) {
      effectiveLimit = 10 - offset;
    }

    const data =
      effectiveLimit > 0
        ? await dataTanaman.findAll({
          where: whereQuery,
          include: includeQuery,
          limit: effectiveLimit,
          offset,
          order
        })
        : [];

    res.status(200).json({
      message: 'Data berhasil didapatkan.',
      data,
      total,
      currentPages: pageFilter,
      limit: limitFilter,
      maxPages: Math.max(1, Math.ceil(total / limitFilter)),
      from: data.length > 0 ? offset + 1 : 0,
      to: data.length > 0 ? offset + data.length : 0
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  tambahDataTanaman,
  getAllDataTanaman,
  getDetailedDataTanaman,
  editDataTanaman,
  hapusDataTanaman,
  uploadDataTanaman,
  updateRealisasiBulk,
  fixKategori,
  fixKomoditas,
  getStatistikYears,
  getTopKomoditasTanaman
};
