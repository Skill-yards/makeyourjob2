# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy frontend package.json and package-lock.json
COPY frontend/package*.json ./frontend/

# Install frontend dependencies
RUN cd frontend && npm install

# Copy the rest of the backend code
COPY backend ./backend/

# Copy the rest of the frontend code
COPY frontend ./frontend/

# Copy .env file (assumed to be in the backend folder)
COPY backend/.env ./backend/

# Build the frontend
RUN cd frontend && npm run build

# Ensure the dist folder exists (for debugging)
RUN ls -la frontend/dist || echo "Frontend dist folder not found"

# Expose the port your backend runs on
EXPOSE 3000

# Set working directory to backend
WORKDIR /app/backend

# Start the backend server
CMD ["node", "index.js"]