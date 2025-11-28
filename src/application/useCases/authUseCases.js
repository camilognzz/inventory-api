const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');

/**
 * Casos de uso para autenticación
 */
class AuthUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData) {
    try {
      const User = require('../../domain/entities/user');
      const user = new User(userData);
      user.validate();

      const existingUser = await this.userRepository.findByEmail(user.email);
      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      const savedUser = await this.userRepository.save(user);
      const userResponse = { ...savedUser };
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      logger.error('Error en AuthUseCases.register:', error);
      throw error;
    }
  }

  /**
   * Login de usuario - retorna token JWT
   */
  async login(email, password) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const UserModel = require('../../infrastructure/models/userModel');
      const userModel = UserModel.build({ password: user.password });
      
      const isValidPassword = await userModel.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '24h' }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      logger.error('Error en AuthUseCases.login:', error);
      throw error;
    }
  }
}

module.exports = AuthUseCases;