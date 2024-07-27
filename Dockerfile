# Use an official Node.js runtime as a parent image
FROM node:21.4

# Set working directory
WORKDIR /usr/src/app

# Install dos2unix
RUN apt-get update && apt-get install -y dos2unix

# Use npm registry mirror
RUN npm config set registry https://registry.npmjs.org/

# Install app dependencies
COPY package*.json ./

# Retry npm install up to 5 times
RUN npm install || npm install || npm install || npm install || npm install

# Copy app source code
COPY . .

# Convert line endings
RUN find /usr/src/app -type f -print0 | xargs -0 dos2unix

# Fetch Google Fonts
RUN mkdir -p /usr/src/app/public/fonts
RUN curl -o /usr/src/app/public/fonts/nunito.css 'https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&display=swap'

# Modify your Next.js configuration to use the local fonts
RUN sed -i 's|https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&display=swap|/fonts/nunito.css|' src/app/layout.js

# Build the app
RUN npm run build

# Expose port 3000 and start the app
EXPOSE 3000
CMD ["npm", "start"]
