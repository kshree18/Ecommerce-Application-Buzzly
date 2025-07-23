FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=5000

EXPOSE 5000

# Add wait-for-it script to wait for MongoDB
RUN apk add --no-cache bash

CMD ["npm", "start"]
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Start the application
CMD ["/wait-for-it.sh", "mongodb:27017", "--", "npm", "start"]
