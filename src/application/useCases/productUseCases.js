const logger = require("../../utils/logger");

const PRODUCT_FIELDS = [
  "batchNumber",
  "name",
  "price",
  "quantityAvailable",
  "entryDate"
];

/**
 * Casos de uso para gestión de productos
 */
class ProductUseCases {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Crea un nuevo producto
   */
  async createProduct(productData) {
    try {
      const Product = require("../../domain/entities/product");

      const product = new Product(productData);
      product.validate();

      const existingProduct = await this.productRepository.findByBatchNumber(
        product.batchNumber
      );

      if (existingProduct) {
        throw new Error("Ya existe un producto con este número de lote");
      }

      return await this.productRepository.save(product);
    } catch (error) {
      logger.error("Error en ProductUseCases.createProduct:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los productos
   */
  async getAllProducts() {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      logger.error("Error en ProductUseCases.getAllProducts:", error);
      throw error;
    }
  }

  /**
   * Obtiene un producto por ID
   */
  async getProductById(id) {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      logger.error("Error en ProductUseCases.getProductById:", error);
      throw error;
    }
  }

  /**
   * Actualiza un producto
   */
  async updateProduct(id, productData) {
    try {
      const existing = await this.productRepository.findById(id);
      if (!existing) throw new Error("Producto no encontrado");

      const merged = { ...existing };

      for (const field of PRODUCT_FIELDS) {
        if (productData[field] !== undefined) {
          merged[field] = productData[field];
        }
      }

      const Product = require("../../domain/entities/product");
      const product = new Product(merged);
      
      product.validate();

      return await this.productRepository.update(id, product);
    } catch (error) {
      logger.error("Error en ProductUseCases.updateProduct:", error);
      throw error;
    }
  }

  /**
   * Elimina un producto
   */
  async deleteProduct(id) {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      await this.productRepository.delete(id);
      return { message: "Producto eliminado correctamente" };
    } catch (error) {
      logger.error("Error en ProductUseCases.deleteProduct:", error);
      throw error;
    }
  }
}

module.exports = ProductUseCases;