package embedding

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"rag/internal/application/utils"
	"strings"
	"time"
)

const EmbeddingAssistantURL = "/api/embeddings"

type Service struct {
	config *Config
}

func New(cfg *Config) *Service {
	return &Service{
		config: cfg,
	}
}

func (s *Service) Tokenize(content, docName string) (*ComputeTokens, error) {
	computedTokens := &ComputeTokens{
		Chunks:      0,
		ChunkedText: []string{},
		Vectors:     [][]float64{},
	}

	contentData := strings.ReplaceAll(content, "\n", " ")
	chunkedText := s.splitContent(contentData, s.config.ChunkSize)
	for _, textData := range chunkedText {
		tokens, err := s.loadTextDataTokens(textData)
		if err != nil {
			log.Printf("failed to load embedding for %s: %s", docName, err)
			continue
		}
		computedTokens.Chunks++
		computedTokens.ChunkedText = append(computedTokens.ChunkedText, textData)
		computedTokens.Vectors = append(computedTokens.Vectors, tokens)
	}

	return computedTokens, nil
}

func (s *Service) loadTextDataTokens(content string) ([]float64, error) {
	textVectors := &EmbedAllForm{
		Prompt: content,
		Model:  s.config.Model,
	}

	jsonData, err := json.Marshal(textVectors)
	if err != nil {
		return []float64{}, fmt.Errorf("failed to marshal tokens: %w", err)
	}

	reqBody := bytes.NewBuffer(jsonData)
	mimeType := "application/json"
	timeout := time.Duration(300) + time.Second
	targetURL := utils.BuildTargetURL(false, s.config.Address, EmbeddingAssistantURL)
	respData, err := utils.POST(context.TODO(), reqBody, targetURL, mimeType, timeout)
	if err != nil {
		return []float64{}, fmt.Errorf("failed to load embeddings: %w", err)
	}

	tokens := make([][]float64, 0)
	_ = json.Unmarshal(respData, &tokens)

	if len(tokens) < 1 {
		return make([]float64, 0), fmt.Errorf("failed to load embeddings: no tokens found")
	}

	return tokens[0], nil
}

func (s *Service) splitContent(content string, chunkSize int) []string {
	strLength := len(content)
	splitLength := int(math.Ceil(float64(strLength) / float64(chunkSize)))
	splitString := make([]string, splitLength)
	var start, stop int
	for i := 0; i < splitLength; i++ {
		start = i * chunkSize
		stop = start + chunkSize
		if stop > strLength {
			stop = strLength
		}

		splitString[i] = content[start:stop]
	}

	return splitString
}
