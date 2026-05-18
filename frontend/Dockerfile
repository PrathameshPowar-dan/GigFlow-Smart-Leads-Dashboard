# Build the React application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve the app using Nginx
FROM nginx:alpine
# Copy the built assets from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]