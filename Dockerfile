FROM node:22.12.0 AS build
COPY . /opt/vue
WORKDIR /opt/vue
RUN npm install && npm run build
FROM nginx:1.27
COPY --from=build /opt/vue/dist /opt/vue/dist
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
CMD ["nginx", "-g","daemon off;"]
