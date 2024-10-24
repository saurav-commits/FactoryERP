'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InventoryTransaction.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  InventoryTransaction.init({

    product_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:  {
        model: 'Product',
        key: 'id'
      }
    },
    transaction_type: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['in', 'out']],
          msg: 'Transaction type must be either in or out.'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_type: {
      type: DataTypes.ENUM(
        'kg', 'tonne', 'quintal', 'l', 'ml', 'm', 'cm', 'pcs', 'metric_cube'
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate :{
        len: {
         args: [10, 500],
         msg: 'Description must be between 10 to 50 characters long.'
        }
       }
    },
    description_type: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['text', 'audio']],
          msg: 'Description type must be either text or audio.'
        }
      }
    },
    audio_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'InventoryTransaction',
    timestamps: true
  });
  return InventoryTransaction;
};