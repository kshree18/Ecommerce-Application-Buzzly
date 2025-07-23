#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Ecommerce Backend...\n');

// Check if config.env exists
const configPath = path.join(__dirname, 'config.env');
if (!fs.existsSync(configPath)) {
  console.log('❌ config.env file not found!');
  console.log('Please create config.env file with the following content:\n');
  console.log(`PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880`);
  process.exit(1);
}

console.log('✅ config.env file found');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install');
  console.log('Then run: node utils/seeder.js to seed the database');
} else {
  console.log('✅ Dependencies installed');
}

console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Run: npm install (if not done)');
console.log('3. Run: node utils/seeder.js (to seed database)');
console.log('4. Run: npm run dev (to start server)');
console.log('\n🌐 Server will be available at: http://localhost:5000');
console.log('📊 Health check: http://localhost:5000/api/health');
console.log('\n🔑 Default admin credentials:');
console.log('Email: admin@ecommerce.com');
console.log('Password: admin123'); 