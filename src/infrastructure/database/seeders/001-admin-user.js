const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await queryInterface.bulkInsert('users', [{
      email: 'admin@inventory.com',
      password: hashedPassword,
      role: 'ADMIN',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'cliente@example.com',
      password: await bcrypt.hash('cliente123', 12),
      role: 'CLIENT',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};