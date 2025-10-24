# Product Management API

An Express-based REST API providing CRUD operations for products with fields: id, name, price, quantity.

- API Docs (Swagger UI): GET /docs
- Health: GET /
- Base path for products: /products

Server
- Port: 3001 (configurable via PORT env var)
- Host: 0.0.0.0 (configurable via HOST env var)

Getting Started
1. Install dependencies
   - cd product_api_backend
   - npm install
2. Start the server
   - Development (hot reload): npm run dev
   - Production: npm start
3. Visit Swagger Docs
   - http://localhost:3001/docs

Endpoints
- GET /products
- POST /products
- GET /products/total-balance
- GET /products/:id
- PUT /products/:id
- DELETE /products/:id

Request/Response Examples
- Create
  POST /products
  Body:
  {
    "name": "Sample",
    "price": 12.5,
    "quantity": 3
  }
  201 Created:
  { "data": { "id": 1, "name": "Sample", "price": 12.5, "quantity": 3 } }

- List
  GET /products
  200 OK:
  { "data": [ { "id": 1, "name": "Sample", "price": 12.5, "quantity": 3 } ] }

- Get by id
  GET /products/1
  200 OK:
  { "data": { "id": 1, "name": "Sample", "price": 12.5, "quantity": 3 } }

- Update
  PUT /products/1
  Body:
  {
    "name": "Updated",
    "price": 15,
    "quantity": 5
  }
  200 OK:
  { "data": { "id": 1, "name": "Updated", "price": 15, "quantity": 5 } }

- Delete
  DELETE /products/1
  204 No Content

- Total Balance
  GET /products/total-balance
  Example:
  curl -s http://localhost:3001/products/total-balance
  200 OK:
  { "totalBalance": 199.95 }

Validation
- name: string, required, non-empty
- price: number >= 0
- quantity: integer >= 0

Storage
- Uses an in-memory array with best-effort persistence to product_api_backend/data/products.json.
