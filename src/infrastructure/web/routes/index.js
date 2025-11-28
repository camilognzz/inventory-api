const express = require('express');
const { authenticateToken, authorizeRoles } = require('../../../application/middleware/authMiddleware');

// Repositorios
const UserRepositoryImpl = require('../../repositories/userRepositoryImpl');
const ProductRepositoryImpl = require('../../repositories/productRepositoryImpl');
const OrderRepositoryImpl = require('../../repositories/orderRepositoryImpl');

// Casos de uso
const AuthUseCases = require('../../../application/useCases/authUseCases');
const ProductUseCases = require('../../../application/useCases/productUseCases');
const OrderUseCases = require('../../../application/useCases/orderUseCases');

// Controladores
const AuthController = require('../controllers/authController');
const ProductController = require('../controllers/productController');
const OrderController = require('../controllers/orderController');

const setupRoutes = (app) => {
  const router = express.Router();

  // Inicializar repositorios
  const userRepository = new UserRepositoryImpl();
  const productRepository = new ProductRepositoryImpl();
  const orderRepository = new OrderRepositoryImpl();

  // Inicializar casos de uso
  const authUseCases = new AuthUseCases(userRepository);
  const productUseCases = new ProductUseCases(productRepository);
  const orderUseCases = new OrderUseCases(orderRepository, productRepository, userRepository);

  // Inicializar controladores
  const authController = new AuthController(authUseCases);
  const productController = new ProductController(productUseCases);
  const orderController = new OrderController(orderUseCases);

  // Rutas de autenticación
  router.post('/auth/register', authController.register);
  router.post('/auth/login', authController.login);

  // Rutas de productos (públicas para lectura)
  router.get('/products', productController.getAllProducts);
  router.get('/products/:id', productController.getProduct);

  // Rutas protegidas
  router.use(authenticateToken);

  // Rutas de productos (Admin only)
  router.post('/products', authorizeRoles('ADMIN'), productController.createProduct);
  router.put('/products/:id', authorizeRoles('ADMIN'), productController.updateProduct);
  router.delete('/products/:id', authorizeRoles('ADMIN'), productController.deleteProduct);

  // Rutas de órdenes
  router.post('/orders', orderController.createOrder);
  router.get('/orders/user/mis-ordenes', orderController.getUserOrders);
  router.get('/orders/:id', orderController.getOrder);
  router.get('/orders/:id/factura', orderController.getInvoice);

  // Rutas de admin para órdenes
  router.get('/orders', authorizeRoles('ADMIN'), orderController.getAllOrders);

  // Health check
  router.get('/health', (req, res) => {
    res.json({ 
      success: true, 
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/v1', router);
};

module.exports = setupRoutes;