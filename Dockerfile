FROM node:16.15.0 AS build
COPY . /opt/myblog_pc
WORKDIR /opt/myblog_pc
RUN npm install --registry https://registry.npm.taobao.org
RUN npm run build

FROM nginx:1.25
COPY --from=build /opt/myblog_pc/dist /opt/myblog_pc/dist
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g","daemon off;"]
