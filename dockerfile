# syntax=docker/dockerfile:1

FROM debian
WORKDIR /app
COPY . .
RUN ./bootstrap
CMD ["start"]
EXPOSE 3000
