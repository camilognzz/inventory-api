const { Sequelize } = require('sequelize');
const logger = require('../../utils/logger');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inventory_db',
  process.env.DB_USER || 'root', 
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a MySQL establecida correctamente');
  } catch (error) {
    logger.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

module.exports = { sequelize, testConnection };