FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Install Node.js, npm, and any other dependencies
# RUN apt-get update && apt-get install -y \
#     curl \
#     && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get clean

RUN apk update && \
    apk add --no-cache python3

COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
# EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
