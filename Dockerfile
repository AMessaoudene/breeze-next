# Use an official Node.js runtime as a parent image
FROM node:21.4

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Disable windows-specific binaries for SWC in Next.js
RUN echo "@next/swc-win32-x64-msvc: optional" > .npmrc

# Set environment variable to avoid using Windows-specific SWC
ENV NEXT_IGNORE_MSWC=1

# Clean npm cache to prevent conflicts
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
