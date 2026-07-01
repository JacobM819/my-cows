FROM node:18-alpine AS frontend-builder
WORKDIR /build-app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app

# 1. Install the C++ build tools Alpine needs to compile SQLite natively
RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./

# Force npm to ignore downloaded binaries and compile from scratch because weird dependency issues
RUN npm install --build-from-source

# 3. Copy the rest of the backend code
COPY backend/ ./

COPY --from=frontend-builder /build-app/frontend/build ./public

EXPOSE 5000

CMD ["npm", "start"]
