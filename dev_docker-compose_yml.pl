version: "3"
services:
  postgres:
    image: postgres:10
    environment:
      POSTGRES_USER: amagi
      POSTGRES_DB: amagi
    volumes:
      - ${PWD}/backend/create.sql:/docker-entrypoint-initdb.d/create.sql
    restart: always
  middleware:
    build:
      context: $PWD/middleware
      dockerfile: $PWD/middleware/dev.Dockerfile
    environment:
      MIDDLEWARE_URI: middleware_uri
      BACKEND_NAME: backend
      BACKEND_PORT: 9001
    restart:
      always
    volumes:
      - "${PWD}/middleware:/app"
    ports:
      - 9001:9001
    command: "yarn start:dev"
  backend:
    build:
      context: $PWD/backend
      dockerfile: $PWD/backend/Dockerfile
    environment:
      POSTGRES_URI: uri
      BACKEND_URI: backend_uri
      BACKEND_PORT: 9000
      DEBUG: swagger2-koa:*
    restart:
      always
    volumes:
      - "${PWD}/backend:/app"
    ports:
      - 9000:9000
    command: "yarn start"