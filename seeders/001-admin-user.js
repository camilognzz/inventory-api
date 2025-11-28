const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await queryInterface.bulkInsert('users', [{
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      first_name: 'Camilo',
      last_name: 'Gonzalez',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'cliente@gmail.com',
      password: await bcrypt.hash('cliente123', 12),
      role: 'CLIENT',
      first_name: 'Andres',
      last_name: 'Salazar',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};