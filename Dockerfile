FROM node:20
 
WORKDIR /app
 
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json
RUN npm install --legacy-peer-deps --no-audit --no-fund
 
COPY . .
 
EXPOSE 3000
 
CMD ["npm", "start"]
