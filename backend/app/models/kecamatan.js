'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kecamatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.desa, {
        foreignKey: 'kecamatanId'
      });
    }
  }
  kecamatan.init(
    {
      nama: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'kecamatan'
    }
  );
  return kecamatan;
};
/**
 * Kecamatan → Desa
       * Relasi: Satu kecamatan memiliki banyak desa.
       * Penjelasan: Model kecamatan memiliki relasi hasMany ke model desa. Ini berarti setiap data kecamatan bisa terhubung dengan banyak
         data desa. Sebaliknya, setiap desa pasti memiliki satu kecamatan (belongsTo).
*/
