FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built assets to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# We will mount default.conf from volume like before or just copy it
# Since docker-compose mounts nginx/default.conf to /etc/nginx/conf.d/default.conf, we can just rely on that.

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
