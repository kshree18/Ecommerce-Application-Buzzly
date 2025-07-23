# Admin Dashboard Guide

## Overview
The ecommerce website now includes a comprehensive admin dashboard that allows administrators to manage products, view statistics, and control the store.

## Admin Login
To access the admin dashboard, you need to log in with admin credentials:

**Email:** admin@ecommerce.com  
**Password:** admin123

## Features

### 1. Dashboard Overview
- View total number of products
- See count of featured products
- Display number of product categories
- Quick statistics at a glance

### 2. Product Management
- **View all products** in a table format with details
- **Add new products** with complete information
- **Edit existing products** (title, description, price, category, image, stock, featured status)
- **Delete products** (soft delete - sets product as inactive)
- **View product details** by clicking the eye icon

### 3. Product Fields
When adding or editing products, you can set:
- **Title**: Product name (required)
- **Description**: Product description (required)
- **Price**: Product price in USD (required)
- **Category**: Choose from men's clothing, women's clothing, jewelery, electronics
- **Image URL**: Link to product image (required)
- **Stock**: Available quantity (required)
- **Featured**: Toggle to mark as featured product

## How to Use

### Starting the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. **Start the Frontend:**
   ```bash
   npm install
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. **Seed the Database (First time only):**
   ```bash
   cd backend
   node utils/seeder.js
   ```
   This creates the admin user and sample products.

### Accessing Admin Dashboard

1. Go to http://localhost:5173
2. Click "Login" in the navigation
3. Enter admin credentials:
   - Email: admin@ecommerce.com
   - Password: admin123
4. After login, you'll see "Admin Dashboard" link in the navigation
5. Click "Admin Dashboard" to access the admin panel

### Managing Products

#### Adding a New Product
1. In the admin dashboard, click "Products" tab
2. Click "Add Product" button
3. Fill in all required fields
4. Click "Add Product" to save

#### Editing a Product
1. In the products table, click the pencil icon next to the product
2. Modify the fields as needed
3. Click "Update Product" to save changes

#### Deleting a Product
1. In the products table, click the trash icon next to the product
2. Confirm the deletion
3. The product will be soft-deleted (set as inactive)

#### Viewing Product Details
1. Click the eye icon next to any product
2. This will take you to the public product details page

## Security Features

- **Role-based Access**: Only users with 'admin' role can access the dashboard
- **Authentication Required**: Must be logged in to access admin features
- **JWT Token**: All admin operations require valid authentication token
- **Input Validation**: All form inputs are validated on both frontend and backend
- **Soft Delete**: Products are marked as inactive rather than permanently deleted

## API Endpoints Used

The admin dashboard uses these backend endpoints:
- `GET /api/auth/me` - Get current user info
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Troubleshooting

### Common Issues

1. **Can't access admin dashboard**
   - Make sure you're logged in with admin credentials
   - Check that the backend server is running
   - Verify the user has 'admin' role

2. **Products not loading**
   - Check if the backend server is running on port 5000
   - Verify MongoDB is running
   - Check browser console for errors

3. **Can't add/edit products**
   - Ensure you're logged in as admin
   - Check that all required fields are filled
   - Verify the image URL is valid

4. **Database connection issues**
   - Make sure MongoDB is installed and running
   - Check the MONGODB_URI in backend/config.env
   - Run the seeder script to initialize the database

### Database Setup

If you need to reset the database:
```bash
cd backend
node utils/seeder.js -d  # This will destroy existing data
node utils/seeder.js      # This will recreate admin user and sample products
```

## Technical Details

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Node.js with Express, MongoDB with Mongoose
- **Authentication**: JWT tokens
- **State Management**: React Context API
- **Routing**: React Router DOM
- **UI Components**: Custom components with Tailwind CSS

The admin dashboard is fully responsive and works on both desktop and mobile devices. 