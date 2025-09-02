package cmd

import (
	"github.com/spf13/cobra"
	"log"
	"os"
	"rag/internal/infrastructure/config"
)

var serviceConfig *config.Config

var rootCmd = &cobra.Command{
	Use:   "./rag",
	Short: "RAG system",
	Long:  "RAG system",
	Run: func(cmd *cobra.Command, _ []string) {
		var parseErr error
		filePath, _ := cmd.Flags().GetString("config")
		serviceConfig, parseErr = config.FromFile(filePath)
		if parseErr != nil {
			log.Fatal(parseErr)
		}
	},
}

func Execute() *config.Config {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
	return serviceConfig
}

func init() {
	flags := rootCmd.Flags()
	flags.StringP("config", "c", "./configs/development.toml", "Parse options from config file")
}
