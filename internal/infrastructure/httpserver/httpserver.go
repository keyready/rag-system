package httpserver

import (
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Server struct {
	server *http.Server
	config *Config
}

func New(config *Config) *Server {
	return &Server{
		server: &http.Server{},
		config: config,
	}
}

func (s *Server) setupServer() {
	engine := gin.New()

	engine.Use(gin.Recovery())

	s.server.Handler = engine
}

func (s *Server) Start(_ context.Context) error {
	s.setupServer()

	s.server.Addr = s.config.Address
	if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
