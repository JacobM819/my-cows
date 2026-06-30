# Using a Multi-Stage docker file so we can 
# Build the React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /build-app/frontend

# Install dependencies and build the React app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Setup Backend & Serve Everything
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies and code
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy the compiled React files from Stage 1 into a public folder inside the backend
COPY --from=frontend-builder /build-app/frontend/build ./public

EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]
