const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
    field: 'total_amount'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'COMPLETED'
  }
}, {
  tableName: 'orders'
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'order_id',
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id'
    }
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'product_name'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10),
    allowNull: false,
    field: 'unit_price'
  },
  total: {
    type: DataTypes.DECIMAL(10),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  underscored: true
});

Order.belongsTo(sequelize.models.User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(sequelize.models.Product, { foreignKey: 'productId', as: 'product' });

module.exports = { Order, OrderItem };