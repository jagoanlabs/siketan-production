'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class riwayatImport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Sesi import dimiliki oleh satu akun user
      this.belongsTo(models.tbl_akun, { foreignKey: 'fk_akunId', as: 'uploader' });
      // Sesi import dikaitkan dengan banyak data tanaman
      this.hasMany(models.dataTanaman, { foreignKey: 'fk_importHistoryId', as: 'tanamanList' });
    }
  }
  riwayatImport.init(
    {
      namaFile: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jumlahData: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      statusRealisasi: {
        type: DataTypes.ENUM('belum', 'sudah'),
        defaultValue: 'belum',
        allowNull: false
      },
      fk_akunId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'riwayatImport',
      tableName: 'riwayatImports'
    }
  );
  return riwayatImport;
};
