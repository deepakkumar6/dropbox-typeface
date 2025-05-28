# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the app
RUN npm run build

# Install serve to serve static build
RUN npm install -g serve

# Expose and run app
EXPOSE 3000
CMD ["serve", "-s", "build"]
