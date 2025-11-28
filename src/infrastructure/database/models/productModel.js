const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  batchNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantityAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  entryDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'products',
  underscored: true 
});

module.exports = Product;