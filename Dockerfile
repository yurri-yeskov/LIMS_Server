# Pull Docker Hub base image
FROM node:12.18.3-alpine3.12
# Set working directory
WORKDIR /usr/app
# Install app dependencies
COPY package*.json ./
RUN npm install -qyg nodemon@2.0.7
RUN npm install -qy
# Copy app to container
COPY . .
# Run the "dev" script in package.json
CMD ["npm", "run", "dev"]