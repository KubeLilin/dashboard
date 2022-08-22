FROM node:14.20-alpine
## 开发镜像(dev image) ,docker run -p 8000:8000 kubelilin/dashboard:node-dev

WORKDIR /code

ADD ./src /code/

RUN npm install --force

EXPOSE 8000

CMD npm run start:pre