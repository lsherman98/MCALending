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
	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)

	var response UploadResponse
	err := c.do(ctx, "PUT", "files/upload_from_url", params, data, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *LlamaClient) RunJob(ctx context.Context, data JobRequest) (*JobResponse, error) {
	var response JobResponse
	err := c.do(ctx, "POST", "extraction/jobs", nil, data, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *LlamaClient) GetJob(ctx context.Context, jobID string) (*JobResponse, error) {
	var response JobResponse
	err := c.do(ctx, "GET", path.Join("extraction/jobs", jobID), nil, nil, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *LlamaClient) GetJobResult(ctx context.Context, jobID string) (*JobResultResponse, error) {
	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)

	var response JobResultResponse
	err := c.do(ctx, "GET", path.Join("extraction/jobs", jobID, "result"), params, nil, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *LlamaClient) DeleteExtractionRun(ctx context.Context, runID string) error {
	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)

	return c.do(ctx, "DELETE", path.Join("extraction/runs", runID), params, nil, nil)
}

func (c *LlamaClient) GetRunByJobID(ctx context.Context, jobID string) (*RunResponse, error) {
	params := url.Values{}
	params.Add("project_id", c.ProjectID)
	params.Add("organization_id", c.OrganizationID)

	var response RunResponse
	err := c.do(ctx, "GET", path.Join("extraction/runs/by-job", jobID), params, nil, &response)
	if err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *LlamaClient) do(ctx context.Context, method, endpointPath string, queryParams url.Values, reqBody, resBody interface{}) error {
	endpoint, err := c.BaseURL.Parse(path.Join(c.BaseURL.Path, endpointPath))
	if err != nil {
		return fmt.Errorf("failed to parse endpoint URL: %w", err)
	}

	if queryParams != nil {
		endpoint.RawQuery = queryParams.Encode()
	}

	var payload io.Reader
	if reqBody != nil {
		bodyBytes, err := json.Marshal(reqBody)
		if err != nil {
			return fmt.Errorf("failed to marshal request payload: %w", err)
		}
		payload = bytes.NewBuffer(bodyBytes)
	}

	req, err := http.NewRequestWithContext(ctx, method, endpoint.String(), payload)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+c.APIKey)
	if reqBody != nil {
		req.Header.Add("Content-Type", "application/json")
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API request failed with status: %s, body: %s", resp.Status, string(bodyBytes))
	}

	if resBody != nil && resp.StatusCode != http.StatusNoContent {
		if err := json.NewDecoder(resp.Body).Decode(resBody); err != nil {
			return fmt.Errorf("failed to decode response body: %w", err)
		}
	}

	return nil
}
