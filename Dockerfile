## 开发镜像(dev image) ,uri: localhost:8092
FROM node:14.20-alpine

ENV NODE_ENV development

WORKDIR /code

ADD ./src /code/

RUN npm install

EXPOSE 8000

CMD npm run start