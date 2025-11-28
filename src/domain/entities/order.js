class OrderItem {
  constructor({ productId, productName, quantity, unitPrice, total }) {
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.total = total;
  }
}

class Order {
  constructor({
    id,
    userId,
    user,
    items = [],
    totalAmount,
    status,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.user = user;
    this.items = items.map(item => new OrderItem(item));
    this.totalAmount = totalAmount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce((total, item) => total + item.total, 0);
    return this.totalAmount;
  }

  validate() {
    if (!this.userId || !this.items || this.items.length === 0) {
      throw new Error('Usuario e items son requeridos');
    }
    this.calculateTotal();
  }
}

module.exports = { Order, OrderItem };