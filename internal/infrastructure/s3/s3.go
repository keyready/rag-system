package s3

import (
	"fmt"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type S3Client struct {
	mc *minio.Client
}

func New(config *Config) (*S3Client, error) {
	creds := credentials.NewStaticV4(config.AccessID, config.SecretKey, config.Token)
	opts := &minio.Options{
		Creds:  creds,
		Secure: config.EnableSSL,
	}

	s3Client, err := minio.New(config.Address, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize S3 client: %w", err)
	}

	client := &S3Client{
		mc: s3Client,
	}

	return client, nil
}
