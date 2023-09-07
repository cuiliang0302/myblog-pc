FROM node:14.19.1 AS build
COPY . /opt/myblog_pc
WORKDIR /opt/myblog_pc
RUN npm install --registry https://mirrors.huaweicloud.com/repository/npm/ && npm run build

FROM nginx:1.20.1
COPY --from=build /opt/myblog_pc/dist /opt/myblog_pc/dist
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g","daemon off;"]
