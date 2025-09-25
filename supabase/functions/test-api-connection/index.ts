import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestConnectionRequest {
  base_url: string;
  auth_type: string;
  auth_config: Record<string, string>;
  headers: Record<string, string>;
  timeout?: number;
}

serve(async (req) => {
  console.log('Test API connection function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody: TestConnectionRequest = await req.json();
    const { base_url, auth_type, auth_config, headers, timeout = 10000 } = requestBody;

    if (!base_url) {
      throw new Error('Base URL is required');
    }

    // Validate URL format
    let testUrl: URL;
    try {
      testUrl = new URL(base_url);
    } catch (error) {
      throw new Error('Invalid URL format');
    }

    // Security checks
    if (!['https:', 'http:'].includes(testUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS protocols are allowed');
    }

    // Block localhost and private IPs for security
    const hostname = testUrl.hostname.toLowerCase();
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || 
        hostname.startsWith('192.168.') || 
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')) {
      throw new Error('Private/localhost URLs are not allowed for security reasons');
    }

    console.log('Testing connection to:', base_url);
    const startTime = Date.now();

    // Prepare test request headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Lovable-API-Integration-Test/1.0',
      'Accept': 'application/json, text/plain, */*',
      ...headers
    };

    // Add authentication based on type
    switch (auth_type) {
      case 'api_key':
        if (auth_config.api_key) {
          // Try common API key header patterns
          if (auth_config.header_name) {
            requestHeaders[auth_config.header_name] = auth_config.api_key;
          } else {
            requestHeaders['X-API-Key'] = auth_config.api_key;
          }
        }
        break;
      case 'bearer_token':
        if (auth_config.token) {
          requestHeaders['Authorization'] = `Bearer ${auth_config.token}`;
        }
        break;
      case 'basic_auth':
        if (auth_config.username && auth_config.password) {
          const credentials = btoa(`${auth_config.username}:${auth_config.password}`);
          requestHeaders['Authorization'] = `Basic ${credentials}`;
        }
        break;
    }

    // Create abort controller for timeout
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    try {
      // Test connection with HEAD request first (less intrusive)
      const testResponse = await fetch(base_url, {
        method: 'HEAD',
        headers: requestHeaders,
        signal: abortController.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      // If HEAD fails, try GET as fallback
      let finalResponse = testResponse;
      if (!testResponse.ok && testResponse.status === 405) {
        console.log('HEAD method not allowed, trying GET');
        const getResponse = await fetch(base_url, {
          method: 'GET',
          headers: requestHeaders,
          signal: abortController.signal
        });
        finalResponse = getResponse;
      }

      // Collect response info
      const responseInfo = {
        status: finalResponse.status,
        statusText: finalResponse.statusText,
        headers: Object.fromEntries(finalResponse.headers.entries()),
        response_time: responseTime,
        url: finalResponse.url,
        redirected: finalResponse.redirected
      };

      console.log('Connection test completed:', {
        status: finalResponse.status,
        responseTime: `${responseTime}ms`
      });

      // Determine success based on status code
      const isSuccess = finalResponse.status < 400;
      
      return new Response(JSON.stringify({ 
        success: isSuccess,
        data: responseInfo,
        message: isSuccess 
          ? `Connection successful (${responseTime}ms)` 
          : `Connection failed with status ${finalResponse.status}`,
        timestamp: new Date().toISOString(),
        test_method: testResponse.status === 405 ? 'GET' : 'HEAD'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isSuccess ? 200 : 400
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error(`Connection timeout after ${timeout}ms`);
      }
      
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown network error';
      throw new Error(`Network error: ${errorMessage}`);
    }

  } catch (error) {
    console.error('Error in test-api-connection function:', error);
    const errorMsg = error instanceof Error ? error.message : 'Connection test failed';
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMsg,
      timestamp: new Date().toISOString()
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});