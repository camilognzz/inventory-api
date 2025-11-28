require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const { testConnection } = require('../infrastructure/database/config');
const setupRoutes = require('../infrastructure/web/routes');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
    this.app.use(limiter);

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging de requests
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
      next();
    });
  }

  setupRoutes() {
    setupRoutes(this.app);
  }

  setupErrorHandling() {
    // 404 Handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
      });
    });

    // Global Error Handler
    this.app.use((error, req, res, next) => {
      logger.error('Error no manejado:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    });
  }

  async start() {
    try {
      await testConnection();
      
      const PORT = process.env.PORT || 3000;
      this.app.listen(PORT, () => {
        logger.info(`Servidor ejecutándose en puerto ${PORT}`);
      });
    } catch (error) {
      logger.error('Error al iniciar la aplicación:', error);
      process.exit(1);
    }
  }
}

const app = new App();
app.start();

module.exports = app.app;