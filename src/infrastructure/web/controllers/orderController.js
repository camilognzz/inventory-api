const logger = require('../../../utils/logger');

class OrderController {
  constructor(orderUseCases) {
    this.orderUseCases = orderUseCases;
  }

  createOrder = async (req, res) => {
    try {
      /**
       * @api {post} /api/orders Crear orden de compra
       * @apiName CreateOrder
       * @apiGroup Orders
       * 
       * @apiHeader {String} Authorization Token JWT
       * 
       * @apiParam {Array} items Items de la orden
       * @apiParam {Number} items.productId ID del producto
       * @apiParam {Number} items.quantity Cantidad del producto
       * 
       * @apiSuccess {Object} order Orden creada
       */
      const { items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere al menos un item para la orden'
        });
      }

      const order = await this.orderUseCases.createOrder(req.user.userId, items);
      
      logger.info(`Orden creada exitosamente: ${order.id}`);
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('Error en OrderController.createOrder:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getOrder = async (req, res) => {
    try {
      /**
       * @api {get} /api/orders/:id Obtener orden específica
       * @apiName GetOrder
       * @apiGroup Orders
       * 
       * @apiHeader {String} Authorization Token JWT
       * 
       * @apiParam {Number} id ID de la orden
       * 
       * @apiSuccess {Object} order Datos de la orden
       */
      const { id } = req.params;
      const order = await this.orderUseCases.getOrderById(
        parseInt(id), 
        req.user.role === 'CLIENT' ? req.user.userId : null
      );

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('Error en OrderController.getOrder:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  getUserOrders = async (req, res) => {
    try {
      /**
       * @api {get} /api/orders/user/my-orders Obtener órdenes del usuario
       * @apiName GetUserOrders
       * @apiGroup Orders
       * 
       * @apiHeader {String} Authorization Token JWT
       * 
       * @apiSuccess {Array} orders Lista de órdenes del usuario
       */
      const orders = await this.orderUseCases.getUserOrders(req.user.userId);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      logger.error('Error en OrderController.getUserOrders:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getPurchaseHistory = async (req, res) => {
    try {
      /**
       * @api {get} /api/orders/user/history Historial de productos comprados (por cliente autenticado)
       * @apiName GetUserPurchaseHistory
       * @apiGroup Orders
       *
       * @apiHeader {String} Authorization Token JWT
       *
       * @apiSuccess {Array} history Lista agregada por producto
       */
      const history = await this.orderUseCases.getUserPurchaseHistory(req.user.userId);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      logger.error('Error en OrderController.getPurchaseHistory:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getAllOrders = async (req, res) => {
    try {
      /**
       * @api {get} /api/orders Obtener todas las órdenes (Admin)
       * @apiName GetAllOrders
       * @apiGroup Orders
       * 
       * @apiHeader {String} Authorization Token JWT (Admin)
       * 
       * @apiSuccess {Array} orders Lista de todas las órdenes
       */
      const orders = await this.orderUseCases.getAllOrders();

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      logger.error('Error en OrderController.getAllOrders:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getInvoice = async (req, res) => {
    try {
      /**
       * @api {get} /api/orders/:id/invoice Obtener factura de la orden
       * @apiName GetOrderInvoice
       * @apiGroup Orders
       * 
       * @apiHeader {String} Authorization Token JWT
       * 
       * @apiParam {Number} id ID de la orden
       * 
       * @apiSuccess {Object} invoice Factura de la orden
       */
      const { id } = req.params;
      const invoice = await this.orderUseCases.getOrderInvoice(
        parseInt(id),
        req.user.role === 'CLIENT' ? req.user.userId : null
      );

      res.json({
        success: true,
        data: invoice
      });
    } catch (error) {
      logger.error('Error en OrderController.getInvoice:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = OrderController;