'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });

      // Each Product can have many Purchases
      Product.hasMany(models.Purchases, {
        foreignKey: 'product_id',
        as: 'purchases',
      });

      // Each Product can be part of many InvoiceItems
      Product.hasMany(models.Invoice_Item, {
        foreignKey: 'product_id',
        as: 'invoiceItems',
      });

      // Each Product can be part of many InventoryTransactions
      Product.hasMany(models.InventoryTransaction, {
        foreignKey: 'product_id',
        as: 'transactions'
      });
    }
  }
  Product.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: {
          args: [3,30],
          msg: 'Name must be between 3 and 30 characters long.'
        }
      }
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
      allowNull: false,
      validate: {
        isIn: {
          args: [['text', 'audio']],
          msg: 'Description type must be either text or audio.'
        }
      }
    },
    audio_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Category',
        key: 'id'
      }
    },
    quantity_type: {
      type: DataTypes.ENUM(
        'kg', 'tonne', 'quintal', 'l', 'ml', 'm', 'cm', 'pcs', 'metric_cube'
      ),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_cost: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    product_image: {
      type: DataTypes.BLOB,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
  });
  return Product;
};