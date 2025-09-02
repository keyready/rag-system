package embedding

import "rag/internal/infrastructure/embedding"

type ITokenizer interface {
	Tokenize(content, docName string) (*embedding.ComputeTokens, error)
}
