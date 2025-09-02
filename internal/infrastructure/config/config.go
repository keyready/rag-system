package config

import (
	"fmt"
	"github.com/spf13/viper"
	"github.com/subosito/gotenv"
	"rag/internal/infrastructure/embedding"
	"rag/internal/infrastructure/httpserver"
	"rag/internal/infrastructure/s3"
	vector_storage "rag/internal/infrastructure/vector-storage"
	"strings"
)

type Config struct {
	Server        ServerConfig        `mapstructure:"server"`
	VectorStorage VectorStorageConfig `mapstructure:"vector_storage"`
	Embed         EmbedConfig         `mapstructure:"embed"`
	Cloud         CloudConfig         `mapstrcuture:"cloud"`
}

type ServerConfig struct {
	Http httpserver.Config `mapstructure:"http"`
}

type VectorStorageConfig struct {
	Pgv vector_storage.Config `mapstructure:"pgv"`
}

type EmbedConfig struct {
	TextVector embedding.Config `mapstructure:"text_vector"`
}

type CloudConfig struct {
	S3 s3.Config `mapstructure:"s3"`
}

func FromFile(filePath string) (*Config, error) {
	_ = gotenv.Load()

	config := &Config{}

	viperInstance := viper.New()
	viperInstance.SetConfigType("toml")
	viperInstance.SetConfigFile(filePath)

	viperInstance.AutomaticEnv()
	viperInstance.SetEnvPrefix("rag")
	viperInstance.SetEnvKeyReplacer(strings.NewReplacer(".", "__"))

	// Server config
	bindErr := viperInstance.BindEnv("server.http.address", "RAG__SERVER__HTTP__ADDRESS")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("server.http.logger.level", "RAG__SERVER__HTTP__LOGGER__LEVEL")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("server.http.logger.address", "RAG__SERVER__HTTP__LOGGER__ADDRESS")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("server.http.logger.enable_loki", "RAG__SERVER__HTTP__LOGGER__ENABLE_LOKI")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}

	// Vector storage config
	bindErr = viperInstance.BindEnv("vector_storage.pgv.conn_uri", "RAG__VECTOR_STORAGE__CONN_URI")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}

	// Embed config
	bindErr = viperInstance.BindEnv("embed.text_vector.address", "RAG__TEXT_VECTOR__ADDRESS")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("embed.text_vector.model", "RAG__TEXT_VECTOR__MODEL")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}

	// MinIO config
	bindErr = viperInstance.BindEnv("cloud.s3.address", "RAG__CLOUD__S3__ADDRESS")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("cloud.s3.access_id", "RAG__CLOUD__S3__ACCESS_ID")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("cloud.s3.secret_key", "RAG__CLOUD__S3__SECRET_KEY")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("cloud.s3.enable_ssl", "RAG__CLOUD__S3__ENABLE_SSL")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("cloud.s3.token", "RAG__CLOUD__S3__TOKEN")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}
	bindErr = viperInstance.BindEnv("cloud.s3.watches_dirs", "RAG__CLOUD__S3__WATCHES_DIRS")
	if bindErr != nil {
		return nil, fmt.Errorf("failed to bin env variable: %w", bindErr)
	}

	if err := viperInstance.ReadInConfig(); err != nil {
		confErr := fmt.Errorf("failed while read config file %s: %w", filePath, err)
		return nil, confErr
	}

	if err := viperInstance.Unmarshal(config); err != nil {
		confErr := fmt.Errorf("failed while unmarshal config file %s: %w", filePath, err)
		return nil, confErr
	}

	return config, nil
}
