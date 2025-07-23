# Docker Guide for Buzzly E-commerce

## Project Overview
Buzzly E-commerce is a full-stack e-commerce application built with:
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB

## Docker Setup

The application is containerized using Docker with three main services:
- Frontend (React application)
- Backend (Node.js API)
- MongoDB (Database)

### Prerequisites
- Docker
- Docker Compose

### Docker Services Configuration

```yaml
services:
  frontend:
    # React application container
    ports: 5173
    depends_on: backend
    environment: VITE_API_URL

  backend:
    # Node.js API container
    ports: 5000
    depends_on: mongodb
    environment: 
      - MongoDB connection
      - JWT settings

  mongodb:
    # Database container
    ports: 27017
    volumes: mongodb_data
```

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up
   ```

2. **Start specific service:**
   ```bash
   docker-compose up backend  # Start only backend
   docker-compose up frontend # Start only frontend
   ```

3. **Rebuild and start:**
   ```bash
   docker-compose up --build
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Environment Variables
Copy `.env.example` to create your environment files:
```bash
cp .env.example backend/config.env  # For backend
cp .env.example .env               # For frontend
```

## Data Persistence
MongoDB data is persisted using Docker volumes:
- Volume: `mongodb_data`
- Path: `/data/db`

## Troubleshooting

1. **Container fails to start:**
   - Check logs: `docker-compose logs [service_name]`
   - Ensure ports are not in use
   - Verify environment variables

2. **Database connection issues:**
   - Ensure MongoDB container is running
   - Check MongoDB connection string
   - Wait for MongoDB to be fully initialized

3. **Frontend can't reach backend:**
   - Verify backend container is running
   - Check VITE_API_URL in frontend environment
   - Ensure Docker network is properly configured
