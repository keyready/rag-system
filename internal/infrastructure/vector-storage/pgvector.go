package vector_storage

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/pgvector/pgvector-go"
)

type PGVector struct {
	conn *pgxpool.Pool
}

func New(ctx context.Context, config *Config) (*PGVector, error) {
	pool, err := pgxpool.Connect(ctx, config.ConnUri)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to pgvector: %w", err)
	}

	return &PGVector{conn: pool}, nil
}

func (pgv *PGVector) Close() {
	pgv.conn.Close()
}

func (pgv *PGVector) QueryRelevantDocuments(ctx context.Context, embedding []float32) ([]map[interface{}]interface{}, error) {
	vector := pgvector.NewVector(embedding)

	query := `
		SELECT doc_id,metadata
		FROM embeddings
		ORDER BY embedding <-> $1
		LIMIT 5
	`

	rows, err := pgv.conn.Query(ctx, query, vector)
	defer rows.Close()

	if err != nil {
		return nil, fmt.Errorf("failed to query relevant docs: %w", err)
	}

	var docs []map[interface{}]interface{}
	for rows.Next() {
		var doc map[interface{}]interface{}
		if err = rows.Scan(doc["doc_id"], doc["metadata"]); err != nil {
			return nil, fmt.Errorf("failed to query relevat docs: %w", err)
		}
		docs = append(docs, doc)
	}

	return docs, nil
}

func (pgv *PGVector) SaveEmbeddings(ctx context.Context, docID string, embedding []float32, metadata map[string]interface{}) error {
	vector := pgvector.NewVector(embedding)

	var query string
	switch len(embedding) {
	case 1024:
		query = `INSERT INTO embeddings (doc_id,embedding,metada) VALUES ($1,$2,$3)`
	default:
		return fmt.Errorf("unsupported embeddings length: %d", len(embedding))
	}

	_, err := pgv.conn.Exec(ctx, query, docID, vector, metadata)
	if err != nil {
		return fmt.Errorf("failed to insert document: %w", err)
	}

	return nil
}

func (pgv *PGVector) InsertDocument(ctx context.Context, content string, embedding []float32) error {
	docID := fmt.Sprintf("doc-%s", uuid.New().String())

	metadata := map[string]interface{}{
		"content": content,
	}

	err := pgv.SaveEmbeddings(ctx, docID, embedding, metadata)
	if err != nil {
		return fmt.Errorf("error saving embedding: %v", err)
	}

	return nil
}
