const logger = require('../../utils/logger');

/**
 * Casos de uso para gestión de órdenes
 */
class OrderUseCases {
  constructor(orderRepository, productRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  /**
   * Crea una nueva orden de compra
   */
  async createOrder(userId, orderItems) {
    try {
      const { Order, OrderItem } = require('../../domain/entities/order');
      
      // Validar usuario
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Validar productos y stock
      const orderItemsWithDetails = [];
      let totalAmount = 0;

      for (const item of orderItems) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        if (product.quantityAvailable < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsWithDetails.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          total: itemTotal
        });
      }

      // Crear orden
      const order = new Order({
        userId,
        items: orderItemsWithDetails,
        totalAmount,
        status: 'COMPLETED'
      });

      order.validate();

      // Actualizar stock de productos
      for (const item of orderItems) {
        await this.productRepository.updateStock(item.productId, -item.quantity);
      }

      const savedOrder = await this.orderRepository.save(order);
      logger.info(`Orden creada exitosamente: ${savedOrder.id} para usuario: ${userId}`);
      
      return savedOrder;
    } catch (error) {
      logger.error('Error en OrderUseCases.createOrder:', error);
      throw error;
    }
  }

  /**
   * Obtiene una orden por ID
   */
  async getOrderById(orderId, userId = null) {
    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new Error('Orden no encontrada');
      }

      // Si es cliente, solo puede ver sus propias órdenes
      if (userId && order.userId !== userId) {
        throw new Error('No tienes permisos para ver esta orden');
      }

      return order;
    } catch (error) {
      logger.error('Error en OrderUseCases.getOrderById:', error);
      throw error;
    }
  }

  /**
   * Obtiene órdenes de un usuario
   */
  async getUserOrders(userId) {
    try {
      return await this.orderRepository.findByUserId(userId);
    } catch (error) {
      logger.error('Error en OrderUseCases.getUserOrders:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de productos comprados por el usuario autenticado
   */
  async getUserPurchaseHistory(userId) {
    try {
      const orders = await this.getUserOrders(userId);

      const map = new Map();

      for (const order of orders) {
        const orderDate = order.createdAt ? new Date(order.createdAt) : null;
        for (const item of order.items) {
          const key = item.productId;
          if (!map.has(key)) {
            map.set(key, {
              productId: item.productId,
              name: item.productName,
              totalQuantity: 0,
              totalSpent: 0,
              lastPurchaseDate: orderDate
            });
          }

          const entry = map.get(key);
          entry.totalQuantity += item.quantity;
          entry.totalSpent += item.total;
          if (!entry.lastPurchaseDate || (orderDate && orderDate > new Date(entry.lastPurchaseDate))) {
            entry.lastPurchaseDate = orderDate;
          }
        }
      }

      const result = Array.from(map.values()).map((e) => ({
        productId: e.productId,
        name: e.name,
        totalQuantity: e.totalQuantity,
        totalSpent: parseFloat(Number(e.totalSpent).toFixed(2)),
        lastPurchaseDate: e.lastPurchaseDate ? new Date(e.lastPurchaseDate).toISOString() : null
      }));

      return result;
    } catch (error) {
      logger.error('Error en OrderUseCases.getUserPurchaseHistory:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las órdenes (admin)
   */
  async getAllOrders() {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      logger.error('Error en OrderUseCases.getAllOrders:', error);
      throw error;
    }
  }

  /**
   * Genera factura de una orden
   */
  async getOrderInvoice(orderId, userId = null) {
    try {
      const order = await this.getOrderById(orderId, userId);
      
      const items = order.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        unitPrice: parseFloat(Number(i.unitPrice).toFixed(2)),
        total: parseFloat(Number(i.total).toFixed(2))
      }));

      const subtotal = items.reduce((sum, it) => sum + it.total, 0);

      const invoice = {
        orderId: order.id,
        invoiceDate: new Date().toISOString(),
        customer: {
          userId: order.user.id,
          email: order.user.email
        },
        items,
        subtotal: parseFloat(Number(subtotal).toFixed(2)),
        total: parseFloat(Number(subtotal).toFixed(2)),
        status: order.status,
        orderDate: order.createdAt
      };

      logger.info(`Factura generada para orden: ${orderId}`);
      return invoice;
    } catch (error) {
      logger.error('Error en OrderUseCases.getOrderInvoice:', error);
      throw error;
    }
  }
}

module.exports = OrderUseCases;