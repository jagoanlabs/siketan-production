const { eventTani: EventTani, beritaTani } = require('../models');
const ApiError = require('../../utils/ApiError');
const imageKit = require('../../midleware/imageKit');
const { postActivity } = require('./logActivity');
const { Op } = require('sequelize');

const infoTani = async (req, res) => {
  try {
    const { category, search } = req.query; // ambil search dari query params

    const whereClause = {};

    if (category) {
      whereClause.kategori = category;
    }

    if (search) {
      whereClause.judul = {
        [Op.like]: `%${search}%` // mencari judul yang mengandung kata pencarian
      };
    }

    const data = await beritaTani.findAll({
      where: whereClause,
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      message: 'Berhasil Mendapatkan Data Info Tani',
      infotani: data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};

const infoTaniById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await beritaTani.findOne({ where: { id } });
    res.status(200).json({
      message: 'Berhasil Mendapatkan Data Info Tani',
      infotani: data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};
const tambahInfoTani = async (req, res) => {
  const { peran, id } = req.user;

  try {
    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    } else {
      const { judul, tanggal, status, kategori, isi } = req.body;
      const { nama } = req.user;
      // const{nam} = req
      if (!judul) throw new ApiError(400, 'Judul tidak boleh kosong.');
      if (!tanggal) throw new ApiError(400, 'tanggal tidak boleh kosong.');
      if (!kategori) throw new ApiError(400, 'kategori tidak boleh kosong.');
      if (!isi) throw new ApiError(400, 'isi tidak boleh kosong.');
      const { file } = req;
      let urlImg = '';
      if (file) {
        const validFormat =
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/gif';
        if (!validFormat) {
          return res.status(400).json({
            status: 'failed',
            message: 'Wrong Image Format'
          });
        }
        const split = file.originalname.split('.');
        const ext = split[split.length - 1];

        // upload file ke imagekit
        const img = await imageKit.upload({
          file: file.buffer,
          fileName: `IMG-${Date.now()}.${ext}`
        });
        urlImg = img.url;
      }
      const infoTani = await beritaTani.create({
        judul,
        tanggal,
        status,
        kategori,
        fotoBerita: urlImg,
        createdBy: nama,
        isi
      });

      await postActivity({
        user_id: id,
        activity: 'CREATE',
        type: 'INFO TANI',
        detail_id: infoTani.id
      });

      res.status(200).json({
        message: 'Info Tani Berhasil Dibuat',
        infoTani
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};
const eventTani = async (req, res) => {
  try {
    const data = await EventTani.findAll({ order: [['id', 'DESC']] });
    res.status(200).json({
      message: 'Berhasil Mendapatkan Data Info Tani',
      infotani: data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};
const eventTaniById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await EventTani.findOne({ where: { id } });
    res.status(200).json({
      message: 'Berhasil Mendapatkan Data Info Tani',
      infotani: data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};
const tambahEventTani = async (req, res) => {
  try {
    const { nama, peran, id } = req.user;

    if (peran === 'petani') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    } else {
      let { namaKegiatan, tanggalAcara, waktuAcara, tempat, peserta, isi } = req.body;
      const { file } = req;

      if (!namaKegiatan) throw new ApiError(400, 'namaKegiatan tidak boleh kosong.');
      if (!tanggalAcara) throw new ApiError(400, 'tanggalAcara tidak boleh kosong.');

      // Jika tanggal dalam format DD/MM/YYYY, konversi ke YYYY-MM-DD
      if (tanggalAcara && tanggalAcara.includes('/')) {
        const [day, month, year] = tanggalAcara.split('/');
        tanggalAcara = `${year}-${month}-${day}`;
      }

      let urlImg = '';
      if (file) {
        const validFormat =
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpg' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/gif';

        if (!validFormat) {
          return res.status(400).json({
            status: 'failed',
            message: 'Wrong Image Format'
          });
        }

        const split = file.originalname.split('.');
        const ext = split[split.length - 1];

        // upload file ke imagekit
        const img = await imageKit.upload({
          file: file.buffer,
          fileName: `IMG-${Date.now()}.${ext}`
        });

        urlImg = img.url;
      }

      const evenTani = await EventTani.create({
        namaKegiatan,
        tanggalAcara,
        waktuAcara,
        tempat,
        peserta,
        fotoKegiatan: urlImg,
        createdBy: nama,
        isi
      });

      postActivity({
        user_id: id,
        activity: 'CREATE',
        type: 'EVENT TANI',
        detail_id: evenTani.id
      });

      res.status(200).json({
        message: 'Event Berhasil Dibuat',
        evenTani
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message
    });
  }
};

const deleteInfoTani = async (req, res) => {
  const { peran, id } = req.user;
  try {
    if (peran !== 'operator super admin') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    } else {
      const beritaId = req.params.id;
      const data = await beritaTani.findOne({
        where: {
          id: beritaId
        }
      });
      if (!data) throw new ApiError(400, 'data tidak ditemukan.');
      await beritaTani.destroy({
        where: {
          id: beritaId
        }
      });

      await postActivity({
        user_id: id,
        activity: 'DELETE',
        type: 'INFO TANI',
        detail_id: beritaId
      });

      res.status(200).json({
        message: 'Berita Tani Berhasil DI Hapus'
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: `gagal menghapus data, ${error.message}`
    });
  }
};
const deleteEventTani = async (req, res) => {
  try {
    const { peran, id } = req.user || {};
    if (peran !== 'operator super admin') {
      throw new ApiError(403, 'Anda tidak memiliki akses.');
    } else {
      const eventId = req.params.id;
      const data = await EventTani.findOne({
        where: {
          id: eventId
        }
      });
      if (!data) throw new ApiError(400, 'data tidak ditemukan.');
      await EventTani.destroy({
        where: {
          id: eventId
        }
      });
      postActivity({
        user_id: id,
        activity: 'DELETE',
        type: 'EVENT TANI',
        detail_id: eventId
      });
      res.status(200).json({
        message: 'event Tani Berhasil DI Hapus'
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: `gagal menghapus data, ${error.message}`
    });
  }
};
const updateInfoTani = async (req, res) => {
  try {
    const { id } = req.user;

    const { judul, status, kategori, isi } = req.body;
    const beritaId = req.params.id;

    const data = await beritaTani.findOne({
      where: {
        id: beritaId
      }
    });
    if (!data) throw new ApiError(400, 'data tidak ditemukan.');
    const { file } = req;
    if (file) {
      const validFormat =
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif';
      if (!validFormat) {
        return res.status(400).json({
          status: 'failed',
          message: 'Wrong Image Format'
        });
      }
      const split = file.originalname.split('.');
      const ext = split[split.length - 1];

      // upload file ke imagekit
      const img = await imageKit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`
      });
      await beritaTani.update(
        {
          judul,
          status,
          kategori,
          fotoBerita: img.url,
          isi
        },
        { where: { id: beritaId } }
      );

      postActivity({
        user_id: id,
        activity: 'EDIT',
        type: 'INFO TANI',
        detail_id: beritaId
      });

      return res.status(200).json({
        message: 'Berita Tani Berhasil Di ubah'
      });
    }
    await beritaTani.update(
      {
        judul,
        status,
        kategori,
        isi
      },
      { where: { id: beritaId } }
    );
    res.status(200).json({
      message: 'Berita Tani Berhasil DI ubah tanpa image'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: `gagal menghapus data, ${error.message}`
    });
  }
};
const updateEventTani = async (req, res) => {
  try {
    const { id } = req.user;
    let { namaKegiatan, tanggalAcara, waktuAcara, tempat, peserta, createdBy, isi } = req.body;
    const eventId = req.params.id;
    const data = await EventTani.findOne({
      where: {
        id: eventId
      }
    });
    if (!data) throw new ApiError(400, 'data tidak ditemukan.');
    // Jika tanggal dalam format DD/MM/YYYY, konversi ke YYYY-MM-DD
    if (tanggalAcara && tanggalAcara.includes('/')) {
      const [day, month, year] = tanggalAcara.split('/');
      tanggalAcara = `${year}-${month}-${day}`;
    }

    const { file } = req;
    if (file) {
      const validFormat =
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif';
      if (!validFormat) {
        return res.status(400).json({
          status: 'failed',
          message: 'Wrong Image Format'
        });
      }
      const split = file.originalname.split('.');
      const ext = split[split.length - 1];

      // upload file ke imagekit
      const img = await imageKit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${ext}`
      });
      await EventTani.update(
        {
          namaKegiatan,
          tanggalAcara,
          waktuAcara,
          tempat,
          peserta,
          fotoKegiatan: img.url,
          createdBy,
          isi
        },
        { where: { id: eventId } }
      );

      postActivity({
        user_id: id,
        activity: 'EDIT',
        type: 'EVENT TANI',
        detail_id: eventId
      });

      return res.status(200).json({
        message: 'Event Tani Berhasil Di ubah'
      });
    }
    await EventTani.update(
      {
        namaKegiatan,
        tanggalAcara,
        waktuAcara,
        tempat,
        peserta,
        createdBy,
        isi
      },
      { where: { id: eventId } }
    );
    res.status(200).json({
      message: 'Event Tani Berhasil DI update'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: `gagal menghapus data, ${error.message}`
    });
  }
};

module.exports = {
  infoTani,
  tambahInfoTani,
  eventTani,
  tambahEventTani,
  deleteInfoTani,
  deleteEventTani,
  infoTaniById,
  eventTaniById,
  updateEventTani,
  updateInfoTani
};
