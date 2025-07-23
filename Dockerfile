FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Set environment variables
ENV VITE_API_URL=http://localhost:5000
ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
