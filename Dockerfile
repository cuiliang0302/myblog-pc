FROM node:14.16.0 AS build
COPY . /opt/myblog_pc
WORKDIR /opt/myblog_pc
RUN npm install && npm run build

FROM nginx:1.18.0
COPY --from=build /opt/myblog_pc/dist /opt/myblog_pc/dist
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g","daemon off;"]
