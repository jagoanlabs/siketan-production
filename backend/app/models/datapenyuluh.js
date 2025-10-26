'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dataPenyuluh extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // connect with tbl_akun
      dataPenyuluh.belongsTo(models.tbl_akun, {
        foreignKey: 'accountID',
        targetKey: 'accountID'
        // as: "akun",
      });
      this.hasMany(models.dataPetani, { foreignKey: 'fk_penyuluhId' });
      this.hasMany(models.kelompok, { foreignKey: 'penyuluh', as: 'kelompoks' });
      this.belongsTo(models.kecamatan, {
        foreignKey: 'kecamatanId',
        as: 'kecamatanData'
      });
      this.belongsTo(models.desa, {
        foreignKey: 'desaId',
        as: 'desaData'
      });
      this.hasMany(models.kecamatanBinaan, { foreignKey: 'penyuluhId', as: 'kecamatanBinaanData' });
      this.hasMany(models.desaBinaan, { foreignKey: 'penyuluhId', as: 'desaBinaanData' });
    }
  }
  dataPenyuluh.init(
    {
      nik: DataTypes.NUMBER,
      nama: DataTypes.STRING,
      foto: DataTypes.TEXT,
      alamat: DataTypes.TEXT,
      email: DataTypes.STRING,
      noTelp: DataTypes.NUMBER,
      password: DataTypes.STRING,
      namaProduct: DataTypes.STRING,
      kecamatan: DataTypes.STRING,
      desa: DataTypes.STRING,
      desaBinaan: DataTypes.STRING,
      kecamatanBinaan: DataTypes.STRING,
      accountID: DataTypes.UUID, // connect with tbl_akun
      // TAMBAHKAN FIELD INI:
      kecamatanId: {
        type: DataTypes.INTEGER,
        allowNull: true, // karena data lama ada yang null
        references: {
          model: 'kecamatans',
          key: 'id'
        }
      },
      desaId: {
        type: DataTypes.INTEGER,
        allowNull: true, // karena data lama ada yang null
        references: {
          model: 'desas',
          key: 'id'
        }
      },
      tipe: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'reguler'
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'dataPenyuluh'
    }
  );
  return dataPenyuluh;
};
