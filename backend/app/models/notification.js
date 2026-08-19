'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.tbl_akun, { foreignKey: 'user_id', as: 'user' });
    }
  }
  notification.init(
    {
      user_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      message: DataTypes.TEXT,
      type: {
        type: DataTypes.STRING,
        defaultValue: 'INFO'
      },
      category: DataTypes.STRING,
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      read_at: DataTypes.DATE,
      action_url: DataTypes.STRING,
      metadata: DataTypes.JSON
    },
    {
      sequelize,
      modelName: 'notification',
      tableName: 'notifications'
    }
  );
  return notification;
};
