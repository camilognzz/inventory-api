class Product {
  constructor({
    id,
    batchNumber,
    name,
    price,
    quantityAvailable,
    entryDate,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.batchNumber = batchNumber;
    this.name = name;
    this.price = price;
    this.quantityAvailable = quantityAvailable;
    this.entryDate = entryDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    if (!this.batchNumber || !this.name || !this.price || !this.quantityAvailable || !this.entryDate) {
      throw new Error('Todos los campos son requeridos');
    }
    if (this.price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    if (this.quantityAvailable < 0) {
      throw new Error('La cantidad disponible no puede ser negativa');
    }
  }

  updateStock(quantity) {
    if (this.quantityAvailable + quantity < 0) {
      throw new Error('Stock insuficiente');
    }
    this.quantityAvailable += quantity;
  }
}

module.exports = Product;