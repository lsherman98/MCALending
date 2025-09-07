FROM --platform=linux/amd64 golang:1.25 AS builder

WORKDIR /app

RUN apt-get update && apt-get install build-essential -y

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN GOOS=linux GOARCH=amd64 go build -o server .

FROM --platform=linux/amd64 gcr.io/distroless/base-debian12

COPY --from=builder /app/server /

CMD ["/server"]