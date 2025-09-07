package llama_client

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"

	"github.com/pocketbase/pocketbase"
)

const (
	defaultBaseURL = "https://api.cloud.llamaindex.ai/api/v1/"
)

type LlamaClient struct {
	client         *http.Client
	BaseURL        *url.URL
	ProjectID      string
	OrganizationID string
	APIKey         string
	App            *pocketbase.PocketBase
}

func New(app *pocketbase.PocketBase) (*LlamaClient, error) {
	baseURL, err := url.Parse(defaultBaseURL)
	if err != nil {
		return nil, err
	}

	apiKey := os.Getenv("LLAMA_INDEX_API_KEY")
	if apiKey == "" {
		return nil, errors.New("LLAMA_INDEX_API_KEY environment variable is required")
	}

	projectID := os.Getenv("LLAMA_INDEX_PROJECT_ID")
	if projectID == "" {
		return nil, errors.New("LLAMA_INDEX_PROJECT_ID environment variable is required")
	}

	organizationId := os.Getenv("LLAMA_INDEX_ORGANIZATION_ID")

	return &LlamaClient{
		client:         http.DefaultClient,
		BaseURL:        baseURL,
		APIKey:         apiKey,
		ProjectID:      projectID,
		OrganizationID: organizationId,
		App:            app,
	}, nil
}

func (c *LlamaClient) Upload(ctx context.Context, data UploadRequest) (*UploadResponse, error) {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, "files/upload_from_url"))
	if err != nil {
		return nil, fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)
	endpoint.RawQuery = params.Encode()

	payload, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "PUT", endpoint.String(), bytes.NewBuffer(payload))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	var apiResponse UploadResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %w", err)
	}

	return &apiResponse, nil
}

func (c *LlamaClient) RunJob(ctx context.Context, data JobRequest) (*JobResponse, error) {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, "extraction/jobs"))
	if err != nil {
		return nil, fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	payload, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", endpoint.String(), bytes.NewBuffer(payload))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	var apiResponse JobResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %w", err)
	}

	return &apiResponse, nil
}

func (c *LlamaClient) GetJob(ctx context.Context, jobID string) (*JobResponse, error) {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, "extraction/jobs", jobID))
	if err != nil {
		return nil, fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	var apiResponse JobResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %w", err)
	}

	return &apiResponse, nil
}

func (c *LlamaClient) GetJobResult(ctx context.Context, jobID string) (*JobResultResponse, error) {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, "extraction/jobs", jobID, "result"))
	if err != nil {
		return nil, fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)
	endpoint.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	var apiResponse JobResultResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %w", err)
	}

	return &apiResponse, nil
}

func (c *LlamaClient) DeleteExtractionRun(ctx context.Context, runID string) error {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, "extraction/runs", runID))
	if err != nil {
		return fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)
	endpoint.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, "DELETE", endpoint.String(), nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	return nil
}

func (c *LlamaClient) GetRunByJobID(ctx context.Context, jobID string) (*RunResponse, error) {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, "extraction/runs/by-job", jobID))
	if err != nil {
		return nil, fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)
	endpoint.RawQuery = params.Encode()

	req, err := http.NewRequestWithContext(ctx, "GET", endpoint.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	var apiResponse RunResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %w", err)
	}

	return &apiResponse, nil
}
