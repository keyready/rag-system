package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"rag/cmd"
	"rag/internal/infrastructure/httpserver"
	"rag/internal/infrastructure/s3"
	"syscall"
)

func main() {
	ctx := context.Background()
	servConfig := cmd.Execute()

	cCtx, cancel := context.WithCancel(ctx)

	_, err := s3.New(&servConfig.Cloud.S3)
	if err != nil {
		log.Fatal("s3 connection failed: %v", err)
	}

	httpServer := httpserver.New(&servConfig.Server.Http)
	go func() {
		if err := httpServer.Start(cCtx); err != nil {
			log.Fatalf("http server start error: %v", err)
		}
	}()

	ch := make(chan os.Signal, 1)
	signal.Notify(ch, syscall.SIGINT, syscall.SIGTERM)
	<-ch
	cancel()
}
