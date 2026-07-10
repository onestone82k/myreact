FROM node:24-alpine AS build-storage

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#2단계: Nginx에 빌드된 파일과 설정 파일 올리기
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "deamon off;"]