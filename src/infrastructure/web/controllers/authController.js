const logger = require('../../../utils/logger');

class AuthController {
  constructor(authUseCases) {
    this.authUseCases = authUseCases;
  }

  register = async (req, res) => {
    try {
      /**
       * @api {post} /api/auth/register Registrar usuario
       * @apiName RegisterUser
       * @apiGroup Auth
       * 
       * @apiParam {String} firstName Nombre del usuario
       * @apiParam {String} lastName Apellido del usuario
       * @apiParam {String} email Email del usuario
       * @apiParam {String} password Contraseña (mínimo 6 caracteres)
       * @apiParam {String} [role=CLIENT] Rol (ADMIN/CLIENT)
       * 
       * @apiSuccess {Object} user Usuario creado sin contraseña
       */
      const user = await this.authUseCases.register(req.body);
      
      logger.info(`Usuario registrado: ${user.email}`);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Error en AuthController.register:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  login = async (req, res) => {
    try {
      /**
       * @api {post} /api/auth/login Login de usuario
       * @apiName LoginUser  
       * @apiGroup Auth
       * 
       * @apiParam {String} email Email del usuario
       * @apiParam {String} password Contraseña
       * 
       * @apiSuccess {String} token Token JWT
       * @apiSuccess {Object} user Datos del usuario (id, email, role, firstName, lastName)
       */
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y password son requeridos'
        });
      }

      const result = await this.authUseCases.login(email, password);
      
      logger.info(`Login exitoso: ${email}`);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error('Error en AuthController.login:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
