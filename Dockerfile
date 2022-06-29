FROM node:16-alpine
WORKDIR /app
COPY package.json ./ 
RUN yarn install
COPY . .
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "yarn build && yarn start"]
