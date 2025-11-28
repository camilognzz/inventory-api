
const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y adjunta el usuario al request
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, user) => {
    if (err) {
      logger.warn('Token inválido:', err.message);
      return res.status(403).json({
        success: false,
        error: 'Token inválido'
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Middleware de autorización por roles
 * Roles permitidos ('ADMIN', 'CLIENT')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Acceso denegado para rol: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para realizar esta acción'
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };