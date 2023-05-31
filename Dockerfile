FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 5003

CMD ["npm", "run", "devbabel"]