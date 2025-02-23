ARG NODE_IMAGE=node:18-alpine3.21

FROM ${NODE_IMAGE}
ENV NODE_ENV=production
EXPOSE 8000
RUN mkdir /app
RUN chown node:node /app
WORKDIR /app
COPY --chown=node:node ["package.json", "package-lock.json*", "tsconfig*.json", "./"]
COPY --chown=node:node ["src", "./src"]
COPY ./docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# Delete prepare script to avoid errors from husky
RUN npm pkg delete scripts.prepare \
    && npm ci --omit=dev
VOLUME [ "/data" ]
ENV DATA_DIR=/data

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
CMD [ "npm", "run", "start" ]
