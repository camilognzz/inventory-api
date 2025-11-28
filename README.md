# Inventory API

API REST para la gestión de inventario, desarrollada con Node.js, Express, Sequelize y MySQL. Utiliza arquitectura hexagonal, autenticación con JWT y un sistema de roles para controlar permisos.

## Características

* Autenticación con JWT y roles de usuario (ADMIN y CLIENT).
* Arquitectura hexagonal.
* CRUD de productos y órdenes.
* Validación de datos con Joi.
* Logs con Winston.
* Documentación generada con APIDOC.
* Seguridad con Helmet, CORS y rate limiting.

## Tecnologías

Node.js + Express, Sequelize ORM + MySQL, JSON Web Tokens, Joi, Winston, Helmet y CORS.

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/camilognzz/inventory-api.git
cd inventory-api

# Instalar dependencias
npm install
```

### Variables de entorno

Crear archivo `.env` con:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inventory_db
DB_USER=root
DB_PASS=
JWT_SECRET=clave-secreta
PORT=3000
```

### Base de datos

```sql
-- Crear base de datos manualmente en mysql
CREATE DATABASE inventory_db;
```

### Migraciones y seeders

```bash
# Ejecutar migraciones
npx sequelize-cli db:migrate

# Ejecutar seeders (datos de prueba)
npx sequelize-cli db:seed:all
```

### Ejecutar la aplicación

```bash
npm run dev
```

## Endpoints principales

### Autenticación

**Registro**

```http
POST /api/v1/auth/register

{
  "email":"juan@gmail.com",
  "password":"@@_Juan123",
  "role":"ADMIN",
  "firstName":"Juan",
  "lastName":"Lopez"
}
```

**Login**

```http
POST /api/v1/auth/login

{
  "email":"juan@gmail.com",
  "password":"@@_Juan123"
}
```

### Productos

**Listado público**

```http
GET /api/v1/products
```

**Obtener por ID**

```http
GET /api/v1/products/{id}
```

**Crear producto (Admin)**

```http
POST /api/v1/products
Authorization: Bearer <token>

{
  "batchNumber":"LOTE-001",
  "name":"Laptop Lenovo",
  "price":1500000,
  "quantityAvailable":10,
  "entryDate":"2024-01-15"
}
```

**Actualizar producto (Admin)**

```http
PUT /api/v1/products/{id}
Authorization: Bearer <token>

{
  "batchNumber": "LOTE-001",
  "name": "Laptop Lenovo ThinkPad",
  "price": 1550000,
  "quantityAvailable": 12,
  "entryDate": "2024-01-15"
}
```

**Eliminar producto (Admin)**

```http
DELETE /api/v1/products/{id}
Authorization: Bearer <token>
```

### Órdenes

**Crear orden (Cliente)**

```http
POST /api/v1/orders
Authorization: Bearer <token>

{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 5 }
  ]
}
```

**Órdenes de un cliente**

```http
GET /api/v1/orders/user/my-orders
Authorization: Bearer <token>
```

**Orden por ID**

```http
GET /api/v1/orders/{id}
Authorization: Bearer <token>
```

**Factura por ID**

```http
GET /api/v1/orders/{id}/invoice
Authorization: Bearer <token>
```

**Historial de compras**

```http
GET /api/v1/orders/user/history
Authorization: Bearer <token>
```

**Visualización de todas las compras (Admin)**

```http
GET /api/v1/orders
Authorization: Bearer <token>
```

## Roles y permisos

* **ADMIN:** CRUD de productos, ver todas las compras.
* **CLIENT:** Ver productos, crear órdenes, consultar sus órdenes y facturas.
