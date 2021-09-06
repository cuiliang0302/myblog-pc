FROM node:14.17.6 AS build
COPY . /opt/myblog_pc
RUN rm -rf /opt/myblog_pc/node_modules
WORKDIR /opt/myblog_pc
RUN npm install --registry https://registry.npm.taobao.org && RUN npm run build

FROM nginx:1.20.1
COPY --from=build /opt/myblog_pc/dist /opt/myblog_pc/dist
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g","daemon off;"]
