# Environment Setup

This project requires certain environment variables to be set up before running. Follow these steps:

1. Copy `.env.example` to create new environment files:
   ```bash
   # For backend
   cp .env.example backend/config.env
   
   # For frontend (if needed)
   cp .env.example .env
   ```

2. Update the environment variables in these files with your actual values:
   - `JWT_SECRET`: Your secret key for JWT token generation
   - `MONGODB_URI`: Your MongoDB connection string
   - Other variables as needed

3. Never commit the actual `.env` or `config.env` files to the repository.

## Docker Environment

When running with Docker, the environment variables are set in the `docker-compose.yml` file. Make sure to update them there as well if you're using Docker.
