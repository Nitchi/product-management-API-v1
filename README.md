# Product & Inventory Management API

A RESTful API for an e-commerce platform built with Node.js, Express.js, PostgreSQL, and Sequelize.

The API provides authentication, product and category management, inventory tracking, order processing, and product reviews.

## Technologies

* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* JWT
* bcrypt
* express-validator
* Cloudinary
* dotenv

## Installation

```bash
git clone <repository-url>
cd Product-Management-Api
npm install
```

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Run seeders:

```bash
npx sequelize-cli db:seed:all
```

Start development server:

```bash
npm run dev
```

Start application:

```bash
npm start
```

Base URL:

```text
http://localhost:3000
```

---

# Authentication

## Register Customer

**POST** `/api/auth/register`

### Input

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Result

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

---

## Login

**POST** `/api/auth/login`

### Input

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Result

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "<JWT_TOKEN>"
  }
}
```

Use the returned token for protected endpoints:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Register Admin

**POST** `/api/auth/admin`

### Authentication

Admin authorization required.

### Input

```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

### Result

```json
{
  "success": true,
  "message": "Admin registered successfully.",
  "data": {
    "id": 2,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

---

# Categories

## Create Category

**POST** `/api/categories`

### Authentication

Admin required.

### Input

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

### Result

```json
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }
}
```

---

## Get Categories

**GET** `/api/categories`

### Result

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories"
    }
  ]
}
```

---

## Get Category

**GET** `/api/categories/:id`

### Example

```text
GET /api/categories/1
```

### Result

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }
}
```

---

## Update Category

**PATCH** `/api/categories/:id`

### Authentication

Admin required.

### Input

```json
{
  "name": "Home Electronics",
  "description": "Electronic products for home use"
}
```

### Result

```json
{
  "success": true,
  "message": "Category updated successfully.",
  "data": {
    "id": 1,
    "name": "Home Electronics",
    "description": "Electronic products for home use"
  }
}
```

---

## Delete Category

**DELETE** `/api/categories/:id`

### Authentication

Admin required.

### Result

```json
{
  "success": true,
  "message": "Category deleted successfully."
}
```

Category deletion uses soft delete.

---

# Products

## Create Product

**POST** `/api/products`

### Authentication

Admin required.

### Input

```json
{
  "name": "Wireless Headphones",
  "description": "Bluetooth wireless headphones",
  "category_id": 1,
  "price": 75000,
  "quantity_in_stock": 20,
  "discount_percentage": 10,
  "image_url": "https://example.com/headphones.jpg",
  "image_public_id": "headphones_001"
}
```

### Result

```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Bluetooth wireless headphones",
    "category_id": 1,
    "price": "75000.00",
    "quantity_in_stock": 20,
    "discount_percentage": "10.00",
    "image_url": "https://example.com/headphones.jpg",
    "image_public_id": "headphones_001"
  }
}
```

---

## Get Products

**GET** `/api/products`

### Query Parameters

```text
?page=1&limit=10
```

Optional parameters:

* `page` – page number
* `limit` – number of products per page

### Example

```text
GET /api/products?page=1&limit=10
```

### Result

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "price": "75000.00",
      "quantity_in_stock": 20,
      "discount_percentage": "10.00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

## Get Product

**GET** `/api/products/:id`

### Example

```text
GET /api/products/1
```

### Result

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Bluetooth wireless headphones",
    "price": "75000.00",
    "quantity_in_stock": 20,
    "discount_percentage": "10.00",
    "discounted_price": 67500,
    "availability": "IN_STOCK",
    "category": {
      "id": 1,
      "name": "Electronics"
    }
  }
}
```

---

## Update Product

**PATCH** `/api/products/:id`

### Authentication

Admin required.

### Input

Any product fields that need to be changed.

```json
{
  "name": "Premium Wireless Headphones",
  "price": 85000,
  "quantity_in_stock": 15,
  "discount_percentage": 5
}
```

### Result

```json
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": 1,
    "name": "Premium Wireless Headphones",
    "price": "85000.00",
    "quantity_in_stock": 15,
    "discount_percentage": "5.00"
  }
}
```

---

## Delete Product

**DELETE** `/api/products/:id`

### Authentication

Admin required.

### Result

```json
{
  "success": true,
  "message": "Product deleted successfully."
}
```

Products use soft delete.

---

# Orders

## Create Order

**POST** `/api/orders`

### Authentication

Customer required.

### Input

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

The server calculates:

* Unit price
* Discount
* Subtotal
* Total amount

### Result

```json
{
  "success": true,
  "message": "Order created successfully.",
  "data": {
    "id": 1,
    "order_number": "ORD-20260812-0001",
    "status": "Pending",
    "total_amount": "205000.00",
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "unit_price": "75000.00",
        "discount_percentage": "10.00",
        "subtotal": "135000.00"
      }
    ]
  }
}
```

---

## Get Orders

**GET** `/api/orders`

### Authentication

Required.

### Query Parameters

```text
?page=1&limit=10
```

### Result

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260812-0001",
      "status": "Pending",
      "total_amount": "205000.00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

## Get Order

**GET** `/api/orders/:id`

### Authentication

Required.

### Example

```text
GET /api/orders/1
```

### Result

```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-20260812-0001",
    "status": "Pending",
    "total_amount": "205000.00",
    "items": []
  }
}
```

---

## Update Order Status

**PATCH** `/api/orders/:id/status`

### Authentication

Admin required.

### Input

```json
{
  "status": "Processing"
}
```

Supported statuses:

```text
Pending
Processing
Delivered
Cancelled
```

Only valid status transitions are allowed.

### Result

```json
{
  "success": true,
  "message": "Order status updated successfully.",
  "data": {
    "id": 1,
    "order_number": "ORD-20260812-0001",
    "status": "Processing"
  }
}
```

---

# Reviews

## Create Review

**POST** `/api/reviews`

### Authentication

Customer required.

### Input

```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Excellent product. The sound quality is very good."
}
```

A customer can only submit one review for the same product.

### Result

```json
{
  "success": true,
  "message": "Review created successfully.",
  "data": {
    "id": 1,
    "product_id": 1,
    "user_id": 5,
    "rating": 5,
    "comment": "Excellent product. The sound quality is very good."
  }
}
```

---

## Get Product Reviews

**GET** `/api/product/:productId/reviews`

### Example

```text
GET /api/product/1/reviews
```

### Result

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent product. The sound quality is very good.",
      "customer": {
        "id": 5,
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ]
}
```

---

## Get Review

**GET** `/api/reviews/:id`

### Example

```text
GET /api/reviews/1
```

### Result

```json
{
  "success": true,
  "data": {
    "id": 1,
    "rating": 5,
    "comment": "Excellent product. The sound quality is very good."
  }
}
```

---

## Update Review

**PATCH** `/api/reviews/:id`

### Authentication

Review owner required.

### Input

```json
{
  "rating": 4,
  "comment": "Good product, although the battery could be better."
}
```

### Result

```json
{
  "success": true,
  "message": "Review updated successfully.",
  "data": {
    "id": 1,
    "rating": 4,
    "comment": "Good product, although the battery could be better."
  }
}
```

---

## Delete Review

**DELETE** `/api/reviews/:id`

### Authentication

Review owner or authorized admin.

### Result

```json
{
  "success": true,
  "message": "Review deleted successfully."
}
```

Reviews use soft delete.

---



# HTTP Status Codes

| Status | Meaning                        |
| ------ | ------------------------------ |
| `200`  | Request successful             |
| `201`  | Resource created               |
| `400`  | Bad request / validation error |
| `401`  | Authentication required        |
| `403`  | Access denied                  |
| `404`  | Resource not found             |
| `409`  | Conflict                       |
| `500`  | Internal server error          |

## Error Response

```json
{
  "success": false,
  "message": "Product not found."
}
```

## Author

**Favour Anitche**

Product & Inventory Management API
