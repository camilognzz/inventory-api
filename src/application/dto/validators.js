const Joi = require("joi");

/**
 * Esquemas de validación para los DTOs de la API
 */

// User DTOs
const userRegisterSchema = Joi.object({
  firstName: Joi.string().min(2).required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es requerido",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "any.required": "El apellido es requerido",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email debe tener un formato válido",
    "any.required": "El email es requerido",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es requerida",
  }),
  role: Joi.string().valid("ADMIN", "CLIENT").default("CLIENT"),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El email debe tener un formato válido",
    "any.required": "El email es requerido",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es requerida",
  }),
});

// Product DTOs
const productSchema = Joi.object({
  batchNumber: Joi.string().required(),
  name: Joi.string().min(1).max(255).required(),
  price: Joi.number().positive().required(),
  quantityAvailable: Joi.number().integer().min(0).required(),
  entryDate: Joi.date().required(),
});

// Order DTOs
const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
      })
    )
    .min(1)
    .required(),
});

/**
 * Middleware de validación para esquemas Joi
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        error: "Error de validación",
        details: errors,
      });
    }

    next();
  };
};

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  productSchema,
  orderSchema,
  validate,
};
