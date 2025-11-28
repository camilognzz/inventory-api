const logger = require('../../../utils/logger');

class ProductController {
  constructor(productUseCases) {
    this.productUseCases = productUseCases;
  }

  createProduct = async (req, res) => {
    try {
      /**
       * @api {post} /api/products Crear producto
       * @apiName CreateProduct
       * @apiGroup Products
       * 
       * @apiHeader {String} Authorization Token JWT (Admin)
       * 
       * @apiParam {String} batchNumber Número de lote
       * @apiParam {String} name Nombre del producto
       * @apiParam {Number} price Precio del producto
       * @apiParam {Number} quantityAvailable Cantidad disponible
       * @apiParam {Date} entryDate Fecha de ingreso
       */
      const product = await this.productUseCases.createProduct(req.body);
      
      logger.info(`Producto creado: ${product.name} (ID: ${product.id})`);
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error en ProductController.createProduct:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getAllProducts = async (req, res) => {
    try {
      /**
       * @api {get} /api/products Obtener todos los productos
       * @apiName GetAllProducts
       * @apiGroup Products
       * 
       * @apiSuccess {Array} products Lista de productos
       */
      const products = await this.productUseCases.getAllProducts();
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error en ProductController.getAllProducts:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  getProduct = async (req, res) => {
    try {
      /**
       * @api {get} /api/products/:id Obtener producto específico
       * @apiName GetProduct
       * @apiGroup Products
       * 
       * @apiParam {Number} id ID del producto
       * 
       * @apiSuccess {Object} product Datos del producto
       */
      const { id } = req.params;
      const product = await this.productUseCases.getProductById(parseInt(id));
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error en ProductController.getProduct:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  updateProduct = async (req, res) => {
    try {
      /**
       * @api {put} /api/products/:id Actualizar producto
       * @apiName UpdateProduct
       * @apiGroup Products
       * 
       * @apiHeader {String} Authorization Token JWT (Admin)
       * 
       * @apiParam {Number} id ID del producto
       * @apiParam {String} [batchNumber] Número de lote
       * @apiParam {String} [name] Nombre del producto
       * @apiParam {Number} [price] Precio del producto
       * @apiParam {Number} [quantityAvailable] Cantidad disponible
       * @apiParam {Date} [entryDate] Fecha de ingreso
       */
      const { id } = req.params;
      const product = await this.productUseCases.updateProduct(parseInt(id), req.body);
      
      logger.info(`Producto actualizado: ${product.name} (ID: ${product.id})`);
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error en ProductController.updateProduct:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  deleteProduct = async (req, res) => {
    try {
      /**
       * @api {delete} /api/products/:id Eliminar producto
       * @apiName DeleteProduct
       * @apiGroup Products
       * 
       * @apiHeader {String} Authorization Token JWT (Admin)
       * 
       * @apiParam {Number} id ID del producto
       */
      const { id } = req.params;
      const result = await this.productUseCases.deleteProduct(parseInt(id));
      
      logger.info(`Producto eliminado: ID ${id}`);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error en ProductController.deleteProduct:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ProductController;