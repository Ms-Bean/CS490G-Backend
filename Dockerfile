# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages
RUN npm install

# Make port available to the world outside this container
EXPOSE 3500

# Use environment variables for database connection, with default values
ENV DB_HOST=localhost
ENV DB_USER=root
ENV DB_PASS=password
ENV DB_NAME=mydatabase

# Run app.js when the container launches
CMD ["node", "app.js"]
