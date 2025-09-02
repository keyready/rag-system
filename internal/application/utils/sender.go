package utils

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func POST(ctx context.Context, body *bytes.Buffer, url, mime string, timeout time.Duration) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", mime)
	httpClient := &http.Client{Timeout: timeout}
	return SendRequest(httpClient, req)
}

func SendRequest(httpClient *http.Client, req *http.Request) ([]byte, error) {
	resp, err := httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	respData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode > 200 {
		return nil, fmt.Errorf("non success response: %w", err)
	}

	return respData, nil
}

func BuildTargetURL(enableSSL bool, host, path string) string {
	schema := GetHttpSchema(enableSSL)
	targetURL := fmt.Sprintf("%s://%s%s", schema, host, path)
	return targetURL
}

func GetHttpSchema(enableSSL bool) string {
	if enableSSL {
		return "https"
	}
	return "http"
}
