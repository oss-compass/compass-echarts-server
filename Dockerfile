FROM node:16-alpine AS base
# # If your server node is in a special area, you can replace the apk source to speed up deployment. For example as follow:
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
# RUN apk update
RUN apk add --no-cache build-base tzdata  cairo-dev jpeg-dev pango-dev freetype-dev giflib-dev&& \
    cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN npm install -g pm2

FROM base AS final
WORKDIR /root/
COPY ./ /root
RUN npm install --unsafe-perm --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas/
EXPOSE 8081
CMD ["pm2-docker", "start", "server.js"]
