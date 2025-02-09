# syntax=docker/dockerfile:1

FROM debian
WORKDIR /app
COPY . .
RUN ./bootstrap
CMD ["/app/start"]
EXPOSE 443
