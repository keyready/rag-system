package embedding

type EmbedAllForm struct {
	Prompt string `json:"prompt"`
	Model  string `json:"model"`
}

type ComputeTokens struct {
	Chunks      int
	ChunkedText []string
	Vectors     [][]float64
}
