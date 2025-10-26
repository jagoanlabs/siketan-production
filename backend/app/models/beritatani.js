'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class beritaTani extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  beritaTani.init(
    {
      judul: DataTypes.STRING,
      tanggal: DataTypes.DATE,
      status: DataTypes.STRING,
      kategori: DataTypes.STRING,
      fotoBerita: DataTypes.TEXT,
      createdBy: DataTypes.STRING,
      isi: DataTypes.TEXT
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'beritaTani'
    }
  );
  return beritaTani;
};
