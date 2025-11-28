const bcrypt = require('bcrypt');
const UserRepository = require('../../domain/repositories/userRepository');
const UserModel = require('../database/models/userModel');
const logger = require('../../utils/logger');

class UserRepositoryImpl extends UserRepository {

async findByEmail(email) {
try {
const user = await UserModel.findOne({ where: { email } });
return user ? this.toDomain(user) : null;
} catch (error) {
logger.error('Error en UserRepository.findByEmail:', error);
throw error;
}
}

async findById(id) {
try {
const user = await UserModel.findByPk(id);
return user ? this.toDomain(user) : null;
} catch (error) {
logger.error('Error en UserRepository.findById:', error);
throw error;
}
}

async save(userEntity) {
try {
const created = await UserModel.create(this.toPersistence(userEntity));
return this.toDomain(created);
} catch (error) {
logger.error('Error en UserRepository.save:', error);
throw error;
}
}

async validatePassword(rawPassword, hashedPassword) {
try {
return await bcrypt.compare(rawPassword, hashedPassword);
} catch (error) {
logger.error('Error en UserRepository.validatePassword:', error);
throw error;
}
}

toDomain(userModel) {
const User = require('../../domain/entities/User');
return new User({
id: userModel.id,
email: userModel.email,
password: userModel.password,
role: userModel.role,
firstName: userModel.first_name,
lastName: userModel.last_name,
createdAt: userModel.createdAt,
updatedAt: userModel.updatedAt
});
}

toPersistence(userEntity) {
return {
email: userEntity.email,
password: userEntity.password,
role: userEntity.role,
first_name: userEntity.firstName,
last_name: userEntity.lastName
};
}
}

module.exports = UserRepositoryImpl;