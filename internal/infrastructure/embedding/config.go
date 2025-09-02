package embedding

type Config struct {
	Address      string `mapstructure:"address"`
	Model        string `mapstructure:"model"`
	EnableSSL    bool
	ChunkSize    int
	ChunkOverlap int
	ReturnChunks bool
	ChunkBySelf  bool
}
