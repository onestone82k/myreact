# 1단계: Node 환경에서 React(Vite) 소스코드 빌드
FROM node:24-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: Nginx에 빌드된 파일과 설정 파일 올리기
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 80 포트(HTTP)와 443 포트(HTTPS) 모두 개발
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]