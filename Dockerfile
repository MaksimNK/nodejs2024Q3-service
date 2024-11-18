FROM node:23
EXPOSE 4000
WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --legacy-peer-deps

COPY --chown=node:node . .

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
