# Production Dockerfile for Next.js app with npm
FROM node:20-slim AS base

WORKDIR /app

# Copy only package files first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm build

# Expose the port Next.js will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
