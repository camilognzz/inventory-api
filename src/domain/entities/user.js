class User {
  constructor({ id, email, password, role, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  isClient() {
    return this.role === 'CLIENT';
  }

  validate() {
    if (!this.email || !this.password) {
      throw new Error('Email y password son requeridos');
    }
    if (!['ADMIN', 'CLIENT'].includes(this.role)) {
      throw new Error('Rol inválido');
    }
  }
}

module.exports = User;