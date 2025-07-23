# Ecommerce Backend API

A comprehensive Node.js/Express backend for the ecommerce website with user authentication, product management, and order processing.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **User Management**: Profile management, password changes, admin user management
- **Product Management**: CRUD operations for products with categories and search
- **Order Processing**: Complete checkout flow with order tracking
- **Security**: Password hashing, input validation, rate limiting, CORS protection
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: RESTful API with comprehensive endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `config.env` and modify the values:
   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/ecommerce_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud)

5. **Seed the database**
   ```bash
   # Import sample data
   node utils/seeder.js
   
   # To destroy data (optional)
   node utils/seeder.js -d
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search` - Search products

### Orders
- `POST /api/orders` - Create new order (Checkout)
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Mark order as paid
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Models

### User Model
- firstName, lastName, email, password
- role (user/admin)
- address, phone, isActive, emailVerified
- lastLogin timestamp

### Product Model
- title, description, price, category
- image, rating, stock
- isActive, featured, discount
- tags, specifications

### Order Model
- user (reference), orderItems (array)
- shippingAddress, paymentMethod
- itemsPrice, taxPrice, shippingPrice, totalPrice
- status, isPaid, isDelivered
- trackingNumber, notes

## 🛒 Checkout Process

When a user clicks checkout, the following happens:

1. **Validation**: Check product availability and stock
2. **Price Calculation**: Calculate final prices with discounts
3. **Stock Update**: Reduce product stock
4. **Order Creation**: Create order with all details
5. **Payment Processing**: Handle payment method
6. **Order Tracking**: Generate order ID for tracking

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time
- `NODE_ENV`: Environment (development/production)

### Security Features
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting to prevent abuse
- CORS protection
- Helmet for security headers
- Compression for better performance

## 🚀 Deployment

1. **Set production environment variables**
2. **Use a process manager like PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js --name ecommerce-api
   ```

3. **Set up MongoDB Atlas** (recommended for production)

4. **Configure reverse proxy** (nginx/Apache)

## 📝 Sample API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Order (Checkout)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "orderItems": [
      {
        "product": "product_id_here",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phone": "+1234567890"
    },
    "paymentMethod": "credit_card"
  }'
```

## 🧪 Testing

The API includes comprehensive error handling and validation. Test endpoints using tools like:
- Postman
- Insomnia
- curl commands
- Frontend integration

## 📞 Support

For issues or questions:
1. Check the error logs
2. Verify MongoDB connection
3. Ensure all environment variables are set
4. Check API documentation

## 🔄 Updates

- Regular security updates
- Performance optimizations
- New features based on requirements
- Database schema improvements

---

**Note**: This backend is designed to work seamlessly with the React frontend. Make sure to update the frontend API calls to use these endpoints instead of the Fake Store API. 