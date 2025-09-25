import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Plus, Eye, EyeOff, RefreshCw, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'

// Enhanced validation schema with security checks
const integrationSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Name contains invalid characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  base_url: z.string()
    .url("Valid URL is required")
    .refine((url) => {
      try {
        const parsed = new URL(url)
        return ['https:', 'http:'].includes(parsed.protocol)
      } catch {
        return false
      }
    }, "URL must use HTTP or HTTPS protocol")
    .refine((url) => {
      const parsed = new URL(url) 
      return !['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)
    }, "Localhost URLs are not allowed for security"),
  auth_type: z.enum(['none', 'api_key', 'bearer_token', 'basic_auth']),
  auth_config: z.record(z.string().max(500)).optional(),
  headers: z.record(z.string().max(1000)).optional()
})

const endpointSchema = z.object({
  name: z.string()
    .min(1, "Endpoint name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Invalid characters in name"),
  path: z.string()
    .min(1, "Path is required")
    .regex(/^\/[a-zA-Z0-9\-_\/\{\}]*$/, "Invalid API path format"),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  params: z.record(z.any()).optional()
})

interface APIEndpointConfig {
  name: string
  path: string
  method: string
  params: Record<string, string>
}

interface Props {
  onSuccess: (integration: any) => void
  onCancel: () => void
}

export function APIConfigForm({ onSuccess, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_url: '',
    auth_type: 'none' as 'none' | 'api_key' | 'bearer_token' | 'basic_auth',
    auth_config: {} as Record<string, string>,
    headers: {} as Record<string, string>
  })
  
  const [endpoints, setEndpoints] = useState<APIEndpointConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [testResponse, setTestResponse] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const { toast } = useToast()

  const addAuthField = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      auth_config: { ...prev.auth_config, [key]: value }
    }))
  }

  const removeAuthField = (key: string) => {
    const { [key]: removed, ...rest } = formData.auth_config
    setFormData(prev => ({ ...prev, auth_config: rest }))
  }

  const addHeader = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      headers: { ...prev.headers, [key]: value }
    }))
  }

  const removeHeader = (key: string) => {
    const { [key]: removed, ...rest } = formData.headers
    setFormData(prev => ({ ...prev, headers: rest }))
  }

  const addEndpoint = () => {
    setEndpoints(prev => [...prev, {
      name: '',
      path: '',
      method: 'GET',
      params: {}
    }])
  }

  const updateEndpoint = (index: number, field: string, value: any) => {
    setEndpoints(prev => prev.map((endpoint, i) =>
      i === index ? { ...endpoint, [field]: value } : endpoint
    ))
  }

  const removeEndpoint = (index: number) => {
    setEndpoints(prev => prev.filter((_, i) => i !== index))
  }

  const validateFormData = () => {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate integration data
    try {
      integrationSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => e.message))
      }
    }

    // Validate endpoints
    endpoints.forEach((endpoint, index) => {
      try {
        endpointSchema.parse(endpoint)
      } catch (error) {
        if (error instanceof z.ZodError) {
          errors.push(...error.errors.map(e => `Endpoint ${index + 1}: ${e.message}`))
        }
      }
    })

    // Security warnings
    if (formData.base_url.startsWith('http://')) {
      warnings.push('Using HTTP instead of HTTPS may expose sensitive data')
    }

    if (formData.auth_type === 'none' && formData.base_url.includes('api')) {
      warnings.push('No authentication configured for API endpoint')
    }

    if (Object.keys(formData.headers).some(key => key.toLowerCase().includes('authorization'))) {
      warnings.push('Authorization headers should be configured in auth section')
    }

    setValidationErrors(errors)
    setSecurityWarnings(warnings)
    return errors.length === 0
  }

  const testConnection = async () => {
    if (!validateFormData()) {
      toast({
        title: "Validation Failed",
        description: "Please fix validation errors before testing",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      setIsValidating(true)
      
      const response = await supabase.functions.invoke('test-api-connection', {
        body: {
          base_url: formData.base_url,
          auth_type: formData.auth_type,
          auth_config: formData.auth_config,
          headers: formData.headers,
          timeout: 10000 // 10 second timeout
        }
      })

      if (response.error) {
        throw new Error(response.error.message)
      }
      
      setTestResponse({ 
        success: true, 
        data: response.data,
        timestamp: new Date().toISOString(),
        response_time: response.data?.response_time || 0
      })
      
      toast({
        title: "Connection Successful",
        description: `API responded in ${response.data?.response_time || 0}ms`
      })
    } catch (error) {
      console.error('Test connection error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Connection test failed'
      setTestResponse({ 
        success: false, 
        error: errorMsg,
        timestamp: new Date().toISOString()
      })
      toast({
        title: "Test Failed",
        description: errorMsg,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      // Validate form data
      const validatedData = integrationSchema.parse(formData)

      // Create integration
      const { data: integration, error: integrationError } = await supabase
        .from('api_integrations')
        .insert({
          name: validatedData.name,
          description: validatedData.description || '',
          base_url: validatedData.base_url,
          auth_type: validatedData.auth_type,
          auth_config: validatedData.auth_config || {},
          headers: validatedData.headers || {},
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (integrationError) throw integrationError

      // Create endpoints
      if (endpoints.length > 0) {
        const endpointInserts = endpoints
          .filter(ep => ep.name && ep.path)
          .map(ep => ({
            integration_id: integration.id,
            name: ep.name,
            endpoint_path: ep.path,
            http_method: ep.method,
            request_params: ep.params
          }))

        if (endpointInserts.length > 0) {
          const { error: endpointsError } = await supabase
            .from('api_endpoints')
            .insert(endpointInserts)

          if (endpointsError) throw endpointsError
        }
      }

      onSuccess(integration)
    } catch (error) {
      console.error('Error creating integration:', error)
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to create API integration",
          variant: "destructive"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Add API Integration</CardTitle>
            <CardDescription>
              Configure a new external API with authentication and endpoints
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="auth">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="test">Test & Save</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">API Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weather API"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="base_url">Base URL *</Label>
                  <Input
                    id="base_url"
                    type="url"
                    value={formData.base_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, base_url: e.target.value }))}
                    placeholder="https://api.example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this API integration"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <div>
                <Label>Authentication Type</Label>
                <Select 
                  value={formData.auth_type} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, auth_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Authentication</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="bearer_token">Bearer Token</SelectItem>
                    <SelectItem value="basic_auth">Basic Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.auth_type !== 'none' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Authentication Configuration</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {Object.entries(formData.auth_config).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <Input value={key} readOnly className="flex-1" />
                      <Input
                        type={showSecrets ? 'text' : 'password'}
                        value={value}
                        onChange={(e) => addAuthField(key, e.target.value)}
                        className="flex-2"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAuthField(key)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <AuthFieldBuilder
                    authType={formData.auth_type}
                    onAdd={addAuthField}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label>Custom Headers (Optional)</Label>
                {Object.entries(formData.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <Input value={key} readOnly className="flex-1" />
                    <Input
                      value={value}
                      onChange={(e) => addHeader(key, e.target.value)}
                      className="flex-2"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeader(key)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <HeaderBuilder onAdd={addHeader} />
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>API Endpoints</Label>
                <Button type="button" variant="outline" onClick={addEndpoint}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Endpoint
                </Button>
              </div>
              
              {endpoints.map((endpoint, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Endpoint name"
                      value={endpoint.name}
                      onChange={(e) => updateEndpoint(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="/api/endpoint"
                      value={endpoint.path}
                      onChange={(e) => updateEndpoint(index, 'path', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Select 
                        value={endpoint.method}
                        onValueChange={(value) => updateEndpoint(index, 'method', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEndpoint(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-red-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Validation Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                          <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Security Warnings */}
              {securityWarnings.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-yellow-800 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Security Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {securityWarnings.map((warning, index) => (
                        <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                          <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Test Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your API configuration before saving
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  disabled={loading || !formData.base_url || validationErrors.length > 0}
                >
                  {isValidating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>

              {testResponse && (
                <Card className={`p-4 ${testResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={testResponse.success ? 'default' : 'destructive'}>
                      {testResponse.success ? 'Success' : 'Failed'}
                    </Badge>
                    {testResponse.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(testResponse.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                    {testResponse.data?.response_time && (
                      <Badge variant="outline" className="text-xs">
                        {testResponse.data.response_time}ms
                      </Badge>
                    )}
                  </div>
                  
                  {testResponse.success && testResponse.data && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">{testResponse.data.status} {testResponse.data.statusText}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time:</span>
                        <span className="font-medium">{testResponse.data.response_time}ms</span>
                      </div>
                      {testResponse.data.redirected && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Final URL:</span>
                          <span className="font-mono text-xs">{testResponse.data.url}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!testResponse.success && (
                    <div className="text-sm text-red-700">
                      <strong>Error:</strong> {testResponse.error}
                    </div>
                  )}
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || validationErrors.length > 0}
                  className="relative"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Integration'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  )
}

// Helper components
function AuthFieldBuilder({ authType, onAdd }: { authType: string, onAdd: (key: string, value: string) => void }) {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const getDefaultFields = () => {
    switch (authType) {
      case 'api_key':
        return [{ key: 'api_key', placeholder: 'Your API key' }]
      case 'bearer_token':
        return [{ key: 'token', placeholder: 'Your bearer token' }]
      case 'basic_auth':
        return [
          { key: 'username', placeholder: 'Username' },
          { key: 'password', placeholder: 'Password' }
        ]
      default:
        return []
    }
  }

  const handleAdd = () => {
    if (key && value) {
      onAdd(key, value)
      setKey('')
      setValue('')
    }
  }

  return (
    <div className="space-y-2">
      {getDefaultFields().map((field) => (
        <Button
          key={field.key}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setKey(field.key)
            setValue('')
          }}
        >
          Add {field.key}
        </Button>
      ))}
      
      <div className="flex gap-2">
        <Input
          placeholder="Field name"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Input
          placeholder="Field value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="button" onClick={handleAdd} disabled={!key || !value}>
          Add
        </Button>
      </div>
    </div>
  )
}

function HeaderBuilder({ onAdd }: { onAdd: (key: string, value: string) => void }) {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const commonHeaders = [
    'Content-Type',
    'Accept',
    'User-Agent',
    'Authorization'
  ]

  const handleAdd = () => {
    if (key && value) {
      onAdd(key, value)
      setKey('')
      setValue('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap">
        {commonHeaders.map((header) => (
          <Button
            key={header}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setKey(header)}
          >
            {header}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Header name"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Input
          placeholder="Header value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="button" onClick={handleAdd} disabled={!key || !value}>
          Add
        </Button>
      </div>
    </div>
  )
}