FROM node:16
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /pages
# Installing dependencies
COPY package*.json ./
RUN npm install
# Copying source files
COPY . .
# Building app
RUN npm run build
EXPOSE 80
# Running the app
CMD [ "npm", "start" ]