import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface APIIntegration {
  id: string;
  base_url: string;
  auth_type: string;
  auth_config: Record<string, string>;
  headers: Record<string, string>;
}

interface APIEndpoint {
  id: string;
  integration_id: string;
  endpoint_path: string;
  http_method: string;
  request_params: Record<string, any>;
  cache_duration: number;
}

serve(async (req) => {
  console.log('API fetch function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { integration_id, endpoint_id } = requestBody;

    if (!integration_id || !endpoint_id) {
      throw new Error('Missing required parameters: integration_id and endpoint_id');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get integration configuration
    const { data: integration, error: integrationError } = await supabase
      .from('api_integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found or inactive');
    }

    // Get endpoint configuration
    const { data: endpoint, error: endpointError } = await supabase
      .from('api_endpoints')
      .select('*')
      .eq('id', endpoint_id)
      .eq('integration_id', integration_id)
      .eq('is_active', true)
      .single();

    if (endpointError || !endpoint) {
      throw new Error('Endpoint not found or inactive');
    }

    // Check cache first
    const cacheKey = `${endpoint_id}_${JSON.stringify(endpoint.request_params)}`;
    const { data: cachedData } = await supabase
      .from('api_data_cache')
      .select('*')
      .eq('endpoint_id', endpoint_id)
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedData) {
      console.log('Returning cached data');
      return new Response(JSON.stringify({ 
        data: cachedData.response_data,
        cached: true,
        timestamp: cachedData.created_at
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build the full API URL
    const baseUrl = integration.base_url.replace(/\/$/, '');
    const endpointPath = endpoint.endpoint_path.startsWith('/') 
      ? endpoint.endpoint_path 
      : `/${endpoint.endpoint_path}`;
    const fullUrl = `${baseUrl}${endpointPath}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Lovable-API-Integration/1.0',
      ...integration.headers
    };

    // Add authentication
    const authConfig = integration.auth_config as Record<string, string>;
    switch (integration.auth_type) {
      case 'api_key':
        if (authConfig.api_key) {
          requestHeaders['X-API-Key'] = authConfig.api_key;
        }
        break;
      case 'bearer_token':
        if (authConfig.token) {
          requestHeaders['Authorization'] = `Bearer ${authConfig.token}`;
        }
        break;
      case 'basic_auth':
        if (authConfig.username && authConfig.password) {
          const credentials = btoa(`${authConfig.username}:${authConfig.password}`);
          requestHeaders['Authorization'] = `Basic ${credentials}`;
        }
        break;
    }

    console.log('Making API request to:', fullUrl);
    const startTime = Date.now();

    // Make the API request
    const apiResponse = await fetch(fullUrl, {
      method: endpoint.http_method,
      headers: requestHeaders,
      // Add body for POST/PUT requests if needed
      ...(endpoint.request_params && ['POST', 'PUT'].includes(endpoint.http_method) && {
        body: JSON.stringify(endpoint.request_params)
      })
    });

    const responseTime = Date.now() - startTime;
    
    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
    }

    const responseData = await apiResponse.json();

    // Cache the response
    if (endpoint.cache_duration > 0) {
      const expiresAt = new Date(Date.now() + endpoint.cache_duration * 1000);
      
      await supabase
        .from('api_data_cache')
        .upsert({
          endpoint_id: endpoint_id,
          cache_key: cacheKey,
          response_data: responseData,
          expires_at: expiresAt.toISOString()
        });
    }

    // Log the API usage
    await supabase
      .from('api_usage_logs')
      .insert({
        integration_id: integration_id,
        endpoint_id: endpoint_id,
        request_url: fullUrl,
        response_status: apiResponse.status,
        response_time_ms: responseTime,
        created_by: req.headers.get('x-user-id') // Pass user ID from client if available
      });

    console.log('API request successful, response time:', responseTime, 'ms');

    return new Response(JSON.stringify({ 
      data: responseData,
      cached: false,
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-api-data function:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch API data';
    
    return new Response(JSON.stringify({ 
      error: errorMsg,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});