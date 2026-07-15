'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DataTanaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  static associate(models) {
    // define association here
    this.belongsTo(models.kelompok, { foreignKey: 'fk_kelompokId' });
    this.belongsTo(models.tbl_akun, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  }
  }
  DataTanaman.init(
    // data tanaman petani, data laporan tanaman by kelompok id
    {
      kategori: DataTypes.STRING,
      komoditas: DataTypes.STRING,
      periodeTanam: DataTypes.STRING,
      luasLahan: DataTypes.INTEGER,
      prakiraanLuasPanen: DataTypes.INTEGER,
      prakiraanHasilPanen: DataTypes.INTEGER,
      prakiraanBulanPanen: DataTypes.STRING,
      realisasiLuasPanen: DataTypes.INTEGER,
      realisasiHasilPanen: DataTypes.INTEGER,
      realisasiBulanPanen: DataTypes.STRING,
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      // paranoid: true,
      modelName: 'dataTanaman'
    }
  );
  return DataTanaman;
};
