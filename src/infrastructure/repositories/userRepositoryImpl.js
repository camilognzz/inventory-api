const UserRepository = require('../../domain/repositories/userRepository');
const User = require('../models/userModel');
const logger = require('../../utils/logger');

class UserRepositoryImpl extends UserRepository {
  async findByEmail(email) {
    try {
      const userModel = await User.findOne({ where: { email } });
      return userModel ? this.toDomain(userModel) : null;
    } catch (error) {
      logger.error('Error en UserRepository.findByEmail:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const userModel = await User.findByPk(id);
      return userModel ? this.toDomain(userModel) : null;
    } catch (error) {
      logger.error('Error en UserRepository.findById:', error);
      throw error;
    }
  }

  async save(user) {
    try {
      const userModel = await User.create(this.toPersistence(user));
      return this.toDomain(userModel);
    } catch (error) {
      logger.error('Error en UserRepository.save:', error);
      throw error;
    }
  }

  toDomain(userModel) {
    return new (require('../../domain/entities/user'))({
      id: userModel.id,
      email: userModel.email,
      password: userModel.password,
      role: userModel.role,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    });
  }

  toPersistence(user) {
    return {
      email: user.email,
      password: user.password,
      role: user.role
    };
  }
}

module.exports = UserRepositoryImpl;