const OrderRepository = require('../../domain/repositories/orderRepository');
const { Order: OrderModel, OrderItem: OrderItemModel } = require('../database/models/orderModel');
const UserModel = require('../database/models/userModel');
const logger = require('../../utils/logger');

class OrderRepositoryImpl extends OrderRepository {
  async save(order) {
    try {
      const transaction = await OrderModel.sequelize.transaction();
      
      try {
        // Crear la orden
        const orderModel = await OrderModel.create(this.toPersistence(order), { transaction });
        
        // Crear items de la orden
        const orderItemsData = order.items.map(item => ({
          ...this.itemToPersistence(item),
          orderId: orderModel.id
        }));
        
        await OrderItemModel.bulkCreate(orderItemsData, { transaction });
        
        await transaction.commit();
        
        // Obtener la orden completa con relaciones
        const completeOrder = await OrderModel.findByPk(orderModel.id, {
          include: [
            { model: UserModel, as: 'user' },
            { 
              model: OrderItemModel, 
              as: 'items',
              include: ['product']
            }
          ]
        });
        
        return this.toDomain(completeOrder);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      logger.error('Error en OrderRepositoryImpl.save:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const orderModel = await OrderModel.findByPk(id, {
        include: [
          { model: UserModel, as: 'user', attributes: ['id', 'email', 'role', 'firstName', 'lastName'] },
          { 
            model: OrderItemModel, 
            as: 'items',
            include: ['product']
          }
        ]
      });
      
      return orderModel ? this.toDomain(orderModel) : null;
    } catch (error) {
      logger.error('Error en OrderRepositoryImpl.findById:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const orderModels = await OrderModel.findAll({
        where: { userId },
        include: [
          { model: UserModel, as: 'user', attributes: ['id', 'email', 'role', 'firstName', 'lastName'] },
          { 
            model: OrderItemModel, 
            as: 'items',
            include: ['product']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return orderModels.map(model => this.toDomain(model));
    } catch (error) {
      logger.error('Error en OrderRepositoryImpl.findByUserId:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const orderModels = await OrderModel.findAll({
        include: [
          { model: UserModel, as: 'user', attributes: ['id', 'email', 'role', 'firstName', 'lastName'] },
          { 
            model: OrderItemModel, 
            as: 'items',
            include: ['product']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      return orderModels.map(model => this.toDomain(model));
    } catch (error) {
      logger.error('Error en OrderRepositoryImpl.findAll:', error);
      throw error;
    }
  }

  toDomain(orderModel) {
    const { Order } = require('../../domain/entities/order');
    
    return new Order({
      id: orderModel.id,
      userId: orderModel.userId,
      user: orderModel.user ? {
        id: orderModel.user.id,
        email: orderModel.user.email,
        role: orderModel.user.role
      } : null,
      items: orderModel.items ? orderModel.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        total: parseFloat(item.total)
      })) : [],
      totalAmount: parseFloat(orderModel.totalAmount),
      status: orderModel.status,
      createdAt: orderModel.createdAt,
      updatedAt: orderModel.updatedAt
    });
  }

  toPersistence(order) {
    return {
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status
    };
  }

  itemToPersistence(orderItem) {
    return {
      productId: orderItem.productId,
      productName: orderItem.productName,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      total: orderItem.total
    };
  }
}

module.exports = OrderRepositoryImpl;