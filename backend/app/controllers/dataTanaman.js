const { dataTanaman, kelompok, riwayatImport, tbl_akun, sequelize } = require('../models');

const ApiError = require('../../utils/ApiError');
const dotenv = require('dotenv');
const { Op, Sequelize } = require('sequelize');
const ExcelJS = require('exceljs');
const { postActivity } = require('./logActivity');
const {
  tanamanPangan,
  tanamanPerkebunan,
  komoditasSemusim,
  komoditasTahunan
} = require('../../utils/constants/tanaman');
const monthOrder = require('../../utils/constants/months');

dotenv.config();

const getAllDataTanaman = async (req, res) => {
  const { peran } = req.user || {};
  const {
    limit,
    page,
    sortBy,
    sortType,
    poktan_id,
    isExport,
    search,
    kategori,
    komoditas,
    tahun,
    bulan
  } = req.query;

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const limitFilter = Number(limit) || 10;
    const pageFilter = Number(page) || 1;
    const isExportFilter = Boolean(isExport);

    // base filter
    const whereClause = {};

    // filter poktan
    if (poktan_id && poktan_id !== 'undefined') {
      whereClause.fk_kelompokId = { [Op.eq]: poktan_id };
    }

    // filter kategori
    if (kategori && kategori !== 'undefined') {
      whereClause.kategori = { [Op.like]: `%${kategori}%` };
    }

    // filter komoditas
    if (komoditas && komoditas !== 'undefined') {
      whereClause.komoditas = { [Op.like]: `%${komoditas}%` };
    }

    // filter tahun (created at) dan bulan
    if (tahun && tahun !== 'undefined') {
      const yearNum = Number(tahun);
      if (!isNaN(yearNum)) {
        if (bulan && bulan !== 'undefined') {
          const monthNum = Number(bulan);
          if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
            const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
            const lastDay = new Date(yearNum, monthNum, 0).getDate();
            whereClause.createdAt = {
              [Op.and]: [
                { [Op.gte]: `${yearNum}-${monthStr}-01 00:00:00` },
                { [Op.lte]: `${yearNum}-${monthStr}-${lastDay} 23:59:59` }
              ]
            };
          }
        } else {
          whereClause.createdAt = {
            [Op.and]: [
              { [Op.gte]: `${yearNum}-01-01 00:00:00` },
              { [Op.lte]: `${yearNum}-12-31 23:59:59` }
            ]
          };
        }
      }
    }

    // pencarian umum (kategori / komoditas / periodeTanam / kelompok.namaKelompok)
    if (search && search !== 'undefined') {
      whereClause[Op.or] = [
        { kategori: { [Op.like]: `%${search}%` } },
        { komoditas: { [Op.like]: `%${search}%` } },
        { periodeTanam: { [Op.like]: `%${search}%` } },
        { '$kelompok.namaKelompok$': { [Op.like]: `%${search}%` } }
      ];
    }

    const filter = {
      where: whereClause,
      include: [{ model: kelompok, as: 'kelompok', required: true }],
      limit: limitFilter,
      offset: (pageFilter - 1) * limitFilter,
      order: [[sortBy || 'id', sortType || 'DESC']]
    };

    const data = await dataTanaman.findAll(
      isExportFilter
        ? { where: whereClause, include: [{ model: kelompok, as: 'kelompok', required: true }] }
        : filter
    );

    const total = await dataTanaman.count({
      where: whereClause,
      include: [{ model: kelompok, as: 'kelompok', required: true }],
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
      include: [{ model: kelompok, as: 'kelompok' }]
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

    const data = await dataTanaman.create({
      kategori,
      komoditas,
      periodeTanam,
      luasLahan,
      prakiraanLuasPanen,
      prakiraanHasilPanen,
      prakiraanBulanPanen,
      fk_kelompokId
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

const uploadDataTanaman = async (req, res) => {
  const { peran, id: userId } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const { file } = req;
    if (!file) throw new ApiError(400, 'File tidak ditemukan.');

    // Validasi tipe file
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
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
    const worksheet = workbook.getWorksheet(1);

    const rowCount = worksheet.rowCount;
    if (rowCount < 2) throw new ApiError(400, 'Data tidak ditemukan.');

    const validatedRows = [];

    for (let i = 2; i <= rowCount; i++) {
      const row = worksheet.getRow(i);

      let isRowEmpty = true;
      for (let j = 1; j <= 11; j++) {
        if (row.getCell(j).value) {
          isRowEmpty = false;
          break;
        }
      }
      if (isRowEmpty) {
        continue;
      }

      const fk_kelompokId = row.getCell(1).value;
      let kategori = row.getCell(2).value;
      const komoditas = row.getCell(3).value;
      const periodeTanam = row.getCell(4).value;
      const luasLahan = row.getCell(5).value;
      const prakiraanLuasPanen = row.getCell(6).value;
      const prakiraanHasilPanen = row.getCell(7).value;
      const prakiraanBulanPanen = row.getCell(8).value;
      const realisasiLuasPanen = row.getCell(9).value;
      const realisasiHasilPanen = row.getCell(10).value;
      const realisasiBulanPanen = row.getCell(11).value;

      if (typeof kategori === 'string') kategori = kategori.toLowerCase().trim();
      if (!['pangan', 'perkebunan', 'sayur', 'buah'].includes(kategori))
        throw new ApiError(
          400,
          `Kategori (${kategori}) tidak valid. Data ke-${i - 1} (baris ${i})`
        );
      if (
        !tanamanPangan
          .concat(tanamanPerkebunan)
          .concat(komoditasSemusim)
          .concat(komoditasTahunan)
          .concat(['Perkebunan Tembakau', 'Perkebunan Tebu'])
          .includes(komoditas)
      )
        throw new ApiError(
          400,
          `Komoditas (${komoditas}) tidak valid. Data ke-${i - 1} (baris ${i})`
        );
      if (!monthOrder.includes(periodeTanam))
        throw new ApiError(400, `Periode tanam tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (!luasLahan || isNaN(luasLahan))
        throw new ApiError(400, `Luas lahan tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (!prakiraanLuasPanen || isNaN(prakiraanLuasPanen))
        throw new ApiError(400, `Prakiraan luas panen tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (!prakiraanHasilPanen || isNaN(prakiraanHasilPanen))
        throw new ApiError(400, `Prakiraan hasil panen tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (prakiraanBulanPanen && !monthOrder.includes(prakiraanBulanPanen))
        throw new ApiError(400, `Prakiraan bulan panen tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (realisasiLuasPanen && isNaN(realisasiLuasPanen))
        throw new ApiError(400, `Realisasi luas panen tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (realisasiHasilPanen && isNaN(realisasiHasilPanen))
        throw new ApiError(400, `Realisasi hasil panen tidak valid. Data ke-${i - 1} (baris ${i})`);
      if (realisasiBulanPanen && !monthOrder.includes(realisasiBulanPanen))
        throw new ApiError(400, `Realisasi bulan panen tidak valid. Data ke-${i - 1} (baris ${i})`);

      const kelompokTani = await kelompok.findOne({ where: { id: fk_kelompokId } });

      if (!kelompokTani)
        throw new ApiError(
          400,
          `Kelompok (${fk_kelompokId}) tidak ditemukan.  Data ke-${i - 1} (baris ${i})`
        );

      validatedRows.push({
        fk_kelompokId,
        kategori,
        komoditas,
        periodeTanam,
        luasLahan: Number(luasLahan),
        prakiraanLuasPanen: Number(prakiraanLuasPanen),
        prakiraanHasilPanen: Number(prakiraanHasilPanen),
        prakiraanBulanPanen: prakiraanBulanPanen || null,
        realisasiLuasPanen: realisasiLuasPanen ? Number(realisasiLuasPanen) : null,
        realisasiHasilPanen: realisasiHasilPanen ? Number(realisasiHasilPanen) : null,
        realisasiBulanPanen: realisasiBulanPanen || null
      });
    }

    if (validatedRows.length === 0) {
      throw new ApiError(400, 'Tidak ada data valid untuk diimport.');
    }

    const transaction = await sequelize.transaction();
    try {
      // Create riwayat import record
      const riwayat = await riwayatImport.create(
        {
          namaFile: file.originalname,
          jumlahData: validatedRows.length,
          statusRealisasi: 'belum',
          fk_akunId: userId
        },
        { transaction }
      );

      // Create dataTanaman records linked to this import session
      for (const rowData of validatedRows) {
        await dataTanaman.create(
          {
            ...rowData,
            fk_importHistoryId: riwayat.id
          },
          { transaction }
        );
      }

      await transaction.commit();
      postActivity({
        user_id: userId,
        activity: 'IMPORT',
        type: 'DATA TANAMAN',
        detail_id: riwayat.id
      });

      res.status(201).json({
        message: 'Data berhasil ditambahkan.',
        imported_count: validatedRows.length,
        riwayatId: riwayat.id
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getStatistikYears = async (req, res) => {
  const { peran } = req.user || {};
  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const data = await dataTanaman.findAll({
      attributes: [[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year']],
      group: [Sequelize.fn('YEAR', Sequelize.col('createdAt'))],
      raw: true
    });

    const years = data
      .map((item) => item.year)
      .filter(Boolean)
      .sort((a, b) => b - a);

    res.status(200).json({
      message: 'Daftar tahun berhasil didapatkan.',
      data: years
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getRiwayatImport = async (req, res) => {
  const { peran, id: userId } = req.user || {};
  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const whereClause = {};
    if (peran !== 'operator super admin' && peran !== 'super admin') {
      whereClause.fk_akunId = userId;
    }

    const data = await riwayatImport.findAll({
      where: whereClause,
      include: [
        {
          model: tbl_akun,
          as: 'uploader',
          attributes: ['id', 'nama', 'peran']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: 'Daftar riwayat import berhasil diperoleh.',
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const downloadRealisasiTemplate = async (req, res) => {
  const { id } = req.params;
  const { peran, id: userId } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const riwayat = await riwayatImport.findByPk(id);
    if (!riwayat) {
      throw new ApiError(404, 'Sesi riwayat import tidak ditemukan.');
    }

    // Access check: non-admins can only download their own session's template
    if (
      peran !== 'operator super admin' &&
      peran !== 'super admin' &&
      riwayat.fk_akunId !== userId
    ) {
      throw new ApiError(403, 'Anda tidak memiliki akses untuk mengunduh template ini.');
    }

    const listData = await dataTanaman.findAll({
      where: { fk_importHistoryId: id },
      include: [{ model: kelompok, as: 'kelompok' }],
      order: [['id', 'ASC']]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Formulir Realisasi');

    // Headers config
    worksheet.columns = [
      { header: 'ID Data', key: 'id', width: 12 },
      { header: 'Nama Kelompok', key: 'kelompok', width: 25 },
      { header: 'Kategori', key: 'kategori', width: 15 },
      { header: 'Komoditas', key: 'komoditas', width: 25 },
      { header: 'Luas Lahan (Ha)', key: 'luasLahan', width: 18 },
      { header: 'Periode Tanam', key: 'periodeTanam', width: 18 },
      { header: 'Prakiraan Luas Panen (Ha)', key: 'prakiraanLuasPanen', width: 25 },
      { header: 'Prakiraan Hasil Panen (Ton)', key: 'prakiraanHasilPanen', width: 25 },
      { header: 'Prakiraan Bulan Panen', key: 'prakiraanBulanPanen', width: 22 },
      { header: 'Realisasi Luas Panen (Ha)', key: 'realisasiLuasPanen', width: 25 },
      { header: 'Realisasi Hasil Panen (Ton)', key: 'realisasiHasilPanen', width: 25 },
      { header: 'Realisasi Bulan Panen', key: 'realisasiBulanPanen', width: 22 }
    ];

    // Style headers row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F497D' } // Dark blue
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Fill data rows
    listData.forEach((item) => {
      const row = worksheet.addRow({
        id: item.id,
        kelompok: item.kelompok ? `${item.kelompok.gapoktan} - ${item.kelompok.namaKelompok}` : '',
        kategori: item.kategori,
        komoditas: item.komoditas,
        luasLahan: item.luasLahan,
        periodeTanam: item.periodeTanam,
        prakiraanLuasPanen: item.prakiraanLuasPanen,
        prakiraanHasilPanen: item.prakiraanHasilPanen,
        prakiraanBulanPanen: item.prakiraanBulanPanen,
        realisasiLuasPanen: item.realisasiLuasPanen !== null ? item.realisasiLuasPanen : '',
        realisasiHasilPanen: item.realisasiHasilPanen !== null ? item.realisasiHasilPanen : '',
        realisasiBulanPanen: item.realisasiBulanPanen || ''
      });

      // Locked reference cells styling (A to I)
      for (let c = 1; c <= 9; c++) {
        const cell = row.getCell(c);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' } // Light gray
        };
        cell.protection = { locked: true };
      }

      // Unlocked inputs styling (J to L)
      for (let c = 10; c <= 12; c++) {
        const cell = row.getCell(c);
        cell.protection = { locked: false };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE2EFDA' } // Light green tint
        };
      }
    });

    // Protect sheet with password from .env, allowing selection of both locked and unlocked cells
    // await worksheet.protect(process.env.EXCEL_PROTECT_PASSWORD || 'siketan', {
    //   selectLockedCells: true,
    //   selectUnlockedCells: true
    // });

    // Write file to buffer and stream response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=formulir_realisasi_${riwayat.id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const uploadRealisasiData = async (req, res) => {
  let { id } = req.params;
  const { peran, id: userId } = req.user || {};

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    }

    const { file } = req;
    if (!file) throw new ApiError(400, 'File tidak ditemukan.');

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(file.buffer);
    } catch (error) {
      throw new ApiError(
        400,
        'File Excel tidak valid atau rusak. Pastikan file dalam format .xlsx yang benar.'
      );
    }
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      throw new ApiError(400, 'Format excel tidak valid (lembar kerja kosong).');
    }

    const rowCount = worksheet.rowCount;
    if (rowCount < 2) throw new ApiError(400, 'Data tidak ditemukan.');

    if (!id) {
      throw new ApiError(400, 'Sesi riwayat import tidak ditemukan.');
    }

    const riwayat = await riwayatImport.findByPk(id);
    if (!riwayat) {
      throw new ApiError(404, 'Sesi riwayat import tidak ditemukan.');
    }

    // Access check: non-admins can only upload to their own session
    if (
      peran !== 'operator super admin' &&
      peran !== 'super admin' &&
      riwayat.fk_akunId !== userId
    ) {
      throw new ApiError(403, 'Anda tidak memiliki akses untuk memperbarui realisasi sesi ini.');
    }

    const updates = [];
    const inserts = [];

    // Parse & Validate Excel Rows
    for (let i = 2; i <= rowCount; i++) {
      const row = worksheet.getRow(i);

      let isRowEmpty = true;
      for (let j = 1; j <= 12; j++) {
        if (row.getCell(j).value) {
          isRowEmpty = false;
          break;
        }
      }
      if (isRowEmpty) {
        continue;
      }

      let idData = row.getCell(1).value;
      if (typeof idData === 'string') {
        idData = idData.trim();
      }

      const realisasiLuasPanen = row.getCell(10).value;
      const realisasiHasilPanen = row.getCell(11).value;
      const realisasiBulanPanen = row.getCell(12).value;

      const isNewRow = idData === null || idData === undefined || idData === '';

      if (isNewRow) {
        // This is a NEW row.
        const kelompokVal = row.getCell(2).value;
        let kategori = row.getCell(3).value;
        const komoditas = row.getCell(4).value;
        const luasLahan = row.getCell(5).value;
        const periodeTanam = row.getCell(6).value;
        const prakiraanLuasPanen = row.getCell(7).value;
        const prakiraanHasilPanen = row.getCell(8).value;
        const prakiraanBulanPanen = row.getCell(9).value;

        // Kelompok Tani lookup
        if (!kelompokVal) {
          throw new ApiError(400, `Nama Kelompok tidak boleh kosong pada baris ${i}`);
        }
        let gapoktan = '';
        let namaKelompok = '';
        if (typeof kelompokVal === 'string') {
          const parts = kelompokVal.split('-');
          if (parts.length >= 2) {
            gapoktan = parts[0].trim();
            namaKelompok = parts.slice(1).join('-').trim();
          } else {
            namaKelompok = kelompokVal.trim();
          }
        } else {
          throw new ApiError(400, `Format Nama Kelompok tidak valid pada baris ${i}`);
        }

        let kelompokTani = null;
        if (gapoktan && namaKelompok) {
          kelompokTani = await kelompok.findOne({
            where: {
              gapoktan: { [Op.like]: gapoktan },
              namaKelompok: { [Op.like]: namaKelompok }
            }
          });
        } else if (namaKelompok) {
          kelompokTani = await kelompok.findOne({
            where: {
              [Op.or]: [
                { namaKelompok: { [Op.like]: namaKelompok } },
                { gapoktan: { [Op.like]: namaKelompok } }
              ]
            }
          });
        }

        if (!kelompokTani) {
          throw new ApiError(
            400,
            `Kelompok tani (${kelompokVal}) tidak ditemukan di database pada baris ${i}`
          );
        }

        // Validate values
        if (typeof kategori === 'string') kategori = kategori.toLowerCase().trim();
        if (!['pangan', 'perkebunan', 'sayur', 'buah'].includes(kategori)) {
          throw new ApiError(400, `Kategori (${kategori}) tidak valid pada baris ${i}`);
        }
        const allowedKomoditas = tanamanPangan
          .concat(tanamanPerkebunan)
          .concat(komoditasSemusim)
          .concat(komoditasTahunan)
          .concat(['Perkebunan Tembakau', 'Perkebunan Tebu']);

        if (!allowedKomoditas.includes(komoditas)) {
          throw new ApiError(400, `Komoditas (${komoditas}) tidak valid pada baris ${i}`);
        }
        if (!periodeTanam || !monthOrder.includes(periodeTanam)) {
          throw new ApiError(400, `Periode tanam tidak valid pada baris ${i}`);
        }
        if (!luasLahan || isNaN(luasLahan)) {
          throw new ApiError(400, `Luas lahan tidak valid pada baris ${i}`);
        }
        if (!prakiraanLuasPanen || isNaN(prakiraanLuasPanen)) {
          throw new ApiError(400, `Prakiraan luas panen tidak valid pada baris ${i}`);
        }
        if (!prakiraanHasilPanen || isNaN(prakiraanHasilPanen)) {
          throw new ApiError(400, `Prakiraan hasil panen tidak valid pada baris ${i}`);
        }
        if (prakiraanBulanPanen && !monthOrder.includes(prakiraanBulanPanen)) {
          throw new ApiError(400, `Prakiraan bulan panen tidak valid pada baris ${i}`);
        }
        if (realisasiLuasPanen && isNaN(realisasiLuasPanen)) {
          throw new ApiError(400, `Realisasi luas panen tidak valid pada baris ${i}`);
        }
        if (realisasiHasilPanen && isNaN(realisasiHasilPanen)) {
          throw new ApiError(400, `Realisasi hasil panen tidak valid pada baris ${i}`);
        }
        if (realisasiBulanPanen && !monthOrder.includes(realisasiBulanPanen)) {
          throw new ApiError(400, `Realisasi bulan panen tidak valid pada baris ${i}`);
        }

        inserts.push({
          fk_kelompokId: kelompokTani.id,
          kategori,
          komoditas,
          luasLahan: Number(luasLahan),
          periodeTanam,
          prakiraanLuasPanen: Number(prakiraanLuasPanen),
          prakiraanHasilPanen: Number(prakiraanHasilPanen),
          prakiraanBulanPanen: prakiraanBulanPanen || null,
          realisasiLuasPanen: realisasiLuasPanen ? Number(realisasiLuasPanen) : null,
          realisasiHasilPanen: realisasiHasilPanen ? Number(realisasiHasilPanen) : null,
          realisasiBulanPanen: realisasiBulanPanen || null,
          fk_importHistoryId: id
        });
      } else {
        // This is an EXISTING row.
        if (isNaN(idData)) {
          throw new ApiError(400, `ID Data tidak valid pada baris ${i}`);
        }

        // Check if record exists and belongs to this batch (or was created manually with null fk_importHistoryId)
        const item = await dataTanaman.findOne({
          where: {
            id: idData,
            [Op.or]: [
              { fk_importHistoryId: id },
              { fk_importHistoryId: null }
            ]
          }
        });

        if (!item) {
          throw new ApiError(
            400,
            `Data Tanaman dengan ID ${idData} pada baris ${i} tidak terikat dengan sesi import ini.`
          );
        }

        // Validate inputs if provided
        if (realisasiLuasPanen && isNaN(realisasiLuasPanen)) {
          throw new ApiError(400, `Realisasi luas panen tidak valid pada baris ${i}`);
        }
        if (realisasiHasilPanen && isNaN(realisasiHasilPanen)) {
          throw new ApiError(400, `Realisasi hasil panen tidak valid pada baris ${i}`);
        }
        if (realisasiBulanPanen && !monthOrder.includes(realisasiBulanPanen)) {
          throw new ApiError(400, `Realisasi bulan panen tidak valid pada baris ${i}`);
        }

        updates.push({
          id: idData,
          item,
          realisasiLuasPanen: realisasiLuasPanen ? Number(realisasiLuasPanen) : null,
          realisasiHasilPanen: realisasiHasilPanen ? Number(realisasiHasilPanen) : null,
          realisasiBulanPanen: realisasiBulanPanen || null
        });
      }
    }

    // Execute bulk updates and inserts inside transaction
    const transaction = await sequelize.transaction();
    try {
      // 1. Process updates
      let pulledCount = 0;
      for (const update of updates) {
        const originalHistoryId = update.item.fk_importHistoryId;
        await update.item.update(
          {
            realisasiLuasPanen: update.realisasiLuasPanen,
            realisasiHasilPanen: update.realisasiHasilPanen,
            realisasiBulanPanen: update.realisasiBulanPanen,
            fk_importHistoryId: originalHistoryId || id
          },
          { transaction }
        );
        if (!originalHistoryId) {
          pulledCount++;
        }
      }

      // 2. Process inserts
      for (const insertData of inserts) {
        await dataTanaman.create(insertData, { transaction });
      }

      // 3. Update import history status to 'sudah' and update the count if new/pulled items were added
      const newTotal = riwayat.jumlahData + inserts.length + pulledCount;
      await riwayat.update(
        {
          statusRealisasi: 'sudah',
          jumlahData: newTotal
        },
        { transaction }
      );

      await transaction.commit();
      postActivity({ user_id: userId, activity: 'REALISASI', type: 'DATA TANAMAN', detail_id: id });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    res.status(200).json({
      message: `Realisasi massal berhasil diperbarui. (${updates.length} data diperbarui, ${inserts.length} data baru ditambahkan).`
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
  fixKategori,
  fixKomoditas,
  getStatistikYears,
  getRiwayatImport,
  downloadRealisasiTemplate,
  uploadRealisasiData
};
