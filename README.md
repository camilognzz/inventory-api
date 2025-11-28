# Inventory API
API REST para la gestión de inventario desarrollada con Node.js, Express, Sequelize y MySQL. El proyecto utiliza arquitectura hexagonal, autenticación con JWT y un sistema de roles para controlar permisos.

## Características
Autenticación con JWT y roles de usuario (Admin y Cliente), arquitectura hexagonal (puertos y adaptadores), CRUD de productos y órdenes, validación de datos con Joi, logs con Winston, documentación generada con APIDOC y seguridad con Helmet, CORS y rate limiting.

## Tecnologías
Node.js + Express, Sequelize ORM + MySQL, JSON Web Tokens, Joi para validaciones, Winston para logs, Helmet y CORS.

## Instalación
Clonar el repositorio: git clone https://github.com/camilognzz/inventory-api.git 
&& cd inventory-api

## Instalar dependencias:
npm install

Crear archivo .env con: 
DB_HOST=localhost,
DB_PORT=3306,
DB_NAME=inventory_db,
DB_USER=root,
DB_PASS=, 
JWT_SECRET=clave-secreta, 
PORT=3000

## Crear base de datos(manualmente en mysql): 
CREATE DATABASE inventory_db; 

## Ejecutar migraciones: 
npx sequelize-cli db:migrate

## Ejecutar seeders(para datos de prueba): 
npx sequelize-cli db:seed:all

## Ejecución
npm run dev

## Endpoints principales

### Autenticación
Registro: 
POST http://localhost:3000/api/v1/auth/register
{
"email":"juan@gmail.com",
"password":"@@_Juan123",
"role":"ADMIN",
"firstName":"Juan",
"lastName":"Lopez"
}

### Login: 
POST http://localhost:3000/api/v1/auth/login 
{
"email":"juan@gmail.com",
"password":"@@_Juan123"
}

### Productos
Listado público: 
GET http://localhost:3000/api/v1/products

Obtener por id:
GET http://localhost:3000/api/v1/products/{id}

### Crear producto (Admin):
POST http://localhost:3000/api/v1/products
con token Bearer
{
"batchNumber":"LOTE-001",
"name":"Laptop Lenovo",
"price":1500000,
"quantityAvailable":10,
"entryDate":"2024-01-15"
}

### Actualizar producto (Admin)
PUT http://localhost:3000/api/v1/products/{id}

{
  "batchNumber": "LOTE-001",
  "name": "Laptop Lenovo ThinkPad",
  "price": 1550000,
  "quantityAvailable": 12,
  "entryDate": "2024-01-15"
}

## Actualizar producto (Admin)
DELETE http://localhost:3000/api/v1/products/{id}


### Órdenes
Crear orden (Cliente): POST /api/v1/orders con token Bearer y body {"items":[{"productId":1,"quantity":2}]}. Obtener factura: GET /api/v1/orders/:id/factura con token Bearer.

## Roles y permisos
ADMIN: CRUD de productos, ver todas las órdenes, acceso a estadísticas. CLIENT: ver productos, crear órdenes, consultar sus órdenes y facturas.
