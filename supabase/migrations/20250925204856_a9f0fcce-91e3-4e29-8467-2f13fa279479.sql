-- Create API Integration Module tables

-- Table for storing API integrations
CREATE TABLE IF NOT EXISTS api_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  base_url varchar(500) NOT NULL,
  auth_type varchar(50) DEFAULT 'none', -- none, api_key, bearer_token, basic_auth
  auth_config jsonb DEFAULT '{}',
  headers jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Table for API endpoints
CREATE TABLE IF NOT EXISTS api_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES api_integrations(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  endpoint_path varchar(500) NOT NULL,
  http_method varchar(10) DEFAULT 'GET',
  request_params jsonb DEFAULT '{}',
  response_format varchar(50) DEFAULT 'json',
  cache_duration integer DEFAULT 300, -- seconds
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Table for caching API responses
CREATE TABLE IF NOT EXISTS api_data_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id uuid REFERENCES api_endpoints(id) ON DELETE CASCADE,
  cache_key varchar(255) NOT NULL,
  response_data jsonb NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(endpoint_id, cache_key)
);

-- Table for API usage logs
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES api_integrations(id) ON DELETE CASCADE,
  endpoint_id uuid REFERENCES api_endpoints(id) ON DELETE CASCADE,
  request_url text,
  response_status integer,
  response_time_ms integer,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on all tables
ALTER TABLE api_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_integrations
CREATE POLICY "Users can view their own API integrations" ON api_integrations
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create their own API integrations" ON api_integrations
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own API integrations" ON api_integrations
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own API integrations" ON api_integrations
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for api_endpoints
CREATE POLICY "Users can view endpoints of their integrations" ON api_endpoints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api_integrations 
      WHERE api_integrations.id = api_endpoints.integration_id 
      AND api_integrations.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create endpoints for their integrations" ON api_endpoints
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM api_integrations 
      WHERE api_integrations.id = api_endpoints.integration_id 
      AND api_integrations.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update endpoints of their integrations" ON api_endpoints
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM api_integrations 
      WHERE api_integrations.id = api_endpoints.integration_id 
      AND api_integrations.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete endpoints of their integrations" ON api_endpoints
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api_integrations 
      WHERE api_integrations.id = api_endpoints.integration_id 
      AND api_integrations.created_by = auth.uid()
    )
  );

-- RLS Policies for api_data_cache
CREATE POLICY "Users can view cache for their endpoints" ON api_data_cache
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM api_endpoints ae
      JOIN api_integrations ai ON ae.integration_id = ai.id
      WHERE ae.id = api_data_cache.endpoint_id 
      AND ai.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create cache for their endpoints" ON api_data_cache
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM api_endpoints ae
      JOIN api_integrations ai ON ae.integration_id = ai.id
      WHERE ae.id = api_data_cache.endpoint_id 
      AND ai.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update cache for their endpoints" ON api_data_cache
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM api_endpoints ae
      JOIN api_integrations ai ON ae.integration_id = ai.id
      WHERE ae.id = api_data_cache.endpoint_id 
      AND ai.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete cache for their endpoints" ON api_data_cache
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM api_endpoints ae
      JOIN api_integrations ai ON ae.integration_id = ai.id
      WHERE ae.id = api_data_cache.endpoint_id 
      AND ai.created_by = auth.uid()
    )
  );

-- RLS Policies for api_usage_logs
CREATE POLICY "Users can view logs for their integrations" ON api_usage_logs
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create their own usage logs" ON api_usage_logs
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_api_integrations_created_by ON api_integrations(created_by);
CREATE INDEX idx_api_endpoints_integration_id ON api_endpoints(integration_id);
CREATE INDEX idx_api_data_cache_endpoint_id_key ON api_data_cache(endpoint_id, cache_key);
CREATE INDEX idx_api_data_cache_expires_at ON api_data_cache(expires_at);
CREATE INDEX idx_api_usage_logs_created_at ON api_usage_logs(created_at);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_integrations_updated_at BEFORE UPDATE ON api_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON api_endpoints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();