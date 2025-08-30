# API Contract Documentation

## Backend-Web API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (company only)
- `PUT /api/products/:id` - Update product (company only)
- `DELETE /api/products/:id` - Delete product (company only)

### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `POST /api/companies` - Register new company
- `PUT /api/companies/:id` - Update company details

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

## Backend-AI API Endpoints

### Chatbot (RAG)
- `POST /chatbot`
  - Request: `{"message": "string", "context": "string"}`
  - Response: `{"response": "string", "confidence": "number"}`

### Recommendations
- `POST /recommend`
  - Request: `{"user_id": "string", "product_id": "string", "limit": "number"}`
  - Response: `{"recommendations": [{"product_id": "string", "score": "number"}]}`

### Virtual Try-On
- `POST /tryon`
  - Request: `{"person_image": "base64", "garment_image": "base64"}`
  - Response: `{"result_image": "base64", "processing_time": "number"}`
