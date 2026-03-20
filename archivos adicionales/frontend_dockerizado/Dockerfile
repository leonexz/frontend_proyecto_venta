FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend_proyecto_venta-main/package*.json ./
RUN npm ci

COPY frontend_proyecto_venta-main/ ./
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
