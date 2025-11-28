const ProductRepository = require("../../domain/repositories/productRepository");
const ProductModel = require("../database/models/productModel");
const logger = require("../../utils/logger");

class ProductRepositoryImpl extends ProductRepository {
  async findAll() {
    try {
      const productModels = await ProductModel.findAll({
        order: [["createdAt", "DESC"]],
      });
      return productModels.map((model) => this.toDomain(model));
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.findAll:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const productModel = await ProductModel.findByPk(id);
      return productModel ? this.toDomain(productModel) : null;
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.findById:", error);
      throw error;
    }
  }

  async findByBatchNumber(batchNumber) {
    try {
      const productModel = await ProductModel.findOne({
        where: { batchNumber },
      });
      return productModel ? this.toDomain(productModel) : null;
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.findByBatchNumber:", error);
      throw error;
    }
  }

  async save(product) {
    try {
      const productModel = await ProductModel.create(
        this.toPersistence(product)
      );
      return this.toDomain(productModel);
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.save:", error);
      throw error;
    }
  }

  async update(id, product) {
    try {
      const productModel = await ProductModel.findByPk(id);
      if (!productModel) return null;

      const dataToUpdate = this.toPersistence(product);

      await productModel.update(dataToUpdate);
      await productModel.reload();

      return this.toDomain(productModel);
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.update:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const productModel = await ProductModel.findByPk(id);
      if (!productModel) return false;

      await productModel.destroy();
      return true;
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.delete:", error);
      throw error;
    }
  }

  async updateStock(productId, quantity) {
    try {
      const productModel = await ProductModel.findByPk(productId);
      if (!productModel) {
        throw new Error("Producto no encontrado");
      }

      await productModel.increment("quantityAvailable", { by: quantity });
      const updated = await ProductModel.findByPk(productId);

      return this.toDomain(updated);
    } catch (error) {
      logger.error("Error en ProductRepositoryImpl.updateStock:", error);
      throw error;
    }
  }

  toDomain(productModel) {
    const Product = require("../../domain/entities/product");

    return new Product({
      id: productModel.id,
      batchNumber: productModel.batchNumber,
      name: productModel.name,
      price: parseFloat(productModel.price),
      quantityAvailable: productModel.quantityAvailable,
      entryDate: productModel.entryDate,
      createdAt: productModel.createdAt,
      updatedAt: productModel.updatedAt,
    });
  }

  toPersistence(product) {
    return {
      batchNumber: product.batchNumber,
      name: product.name,
      price: product.price,
      quantityAvailable: product.quantityAvailable,
      entryDate: product.entryDate,
    };
  }
}

module.exports = ProductRepositoryImpl;
