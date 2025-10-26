'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dataOperator extends Model {
    static associate(models) {
      // define association here
      //   this.belongsTo(models.tbl_akun, {foreignKey: "fk_accountID"});
      // this.belongsTo(models.kelompok, { foreignKey: "fk_kelompokID" });
      dataOperator.belongsTo(models.tbl_akun, {
        foreignKey: 'accountID',
        targetKey: 'accountID',
        as: 'akun'
      });
    }
  }
  dataOperator.init(
    {
      nik: DataTypes.STRING,
      nkk: DataTypes.STRING,
      nama: DataTypes.STRING,
      email: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      foto: DataTypes.TEXT,
      alamat: DataTypes.TEXT,
      accountID: DataTypes.UUID, // connect with tbl_akun
      password: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'dataOperator',
      tableName: 'dataOperators'
    }
  );
  return dataOperator;
};
