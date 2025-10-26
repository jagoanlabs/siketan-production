'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dataPetani extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // connect with tbl_akun
      dataPetani.belongsTo(models.tbl_akun, {
        foreignKey: 'accountID',
        targetKey: 'accountID'
        // as: "akun",
      });
      this.belongsTo(models.dataPenyuluh, {
        foreignKey: 'fk_penyuluhId'
      });
      this.belongsTo(models.kelompok, { foreignKey: 'fk_kelompokId' });
      this.hasMany(models.tanamanPetani, { foreignKey: 'fk_petaniId' });
      this.belongsTo(models.kecamatan, {
        foreignKey: 'kecamatanId',
        as: 'kecamatanData'
      });
      this.belongsTo(models.desa, {
        foreignKey: 'desaId',
        as: 'desaData'
      });
    }
  }
  dataPetani.init(
    {
      nik: DataTypes.NUMBER,
      nkk: DataTypes.NUMBER,
      foto: DataTypes.TEXT,
      nama: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      desa: DataTypes.STRING,
      kecamatan: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      noTelp: DataTypes.NUMBER,
      accountID: DataTypes.UUID // connect with tbl_akun
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'dataPetani'
    }
  );
  return dataPetani;
};
