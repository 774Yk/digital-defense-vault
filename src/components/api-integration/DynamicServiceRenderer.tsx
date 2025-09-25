import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw, ExternalLink, Database, AlertCircle, BarChart3, Table2, Grid3X3 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface APIIntegration {
  id: string
  name: string
  description: string
  base_url: string
  auth_type: string
  is_active: boolean
  created_at: string
  metadata: Record<string, any>
}

interface APIEndpoint {
  id: string
  integration_id: string
  name: string
  endpoint_path: string
  http_method: string
  is_active: boolean
  metadata: Record<string, any>
}

interface ServiceData {
  integration_id: string
  endpoint_id: string
  data: any
  loading: boolean
  error: string | null
  last_updated: Date
}

interface Props {
  integrations: APIIntegration[]
  endpoints: APIEndpoint[]
}

export function DynamicServiceRenderer({ integrations, endpoints }: Props) {
  const [servicesData, setServicesData] = useState<Record<string, ServiceData>>({})
  const [viewMode, setViewMode] = useState<'auto' | 'json' | 'table' | 'cards'>('auto')
  const { toast } = useToast()

  const activeEndpoints = endpoints.filter(endpoint => 
    endpoint.is_active && 
    integrations.some(integration => 
      integration.id === endpoint.integration_id && integration.is_active
    )
  )

  useEffect(() => {
    // Initialize services data
    activeEndpoints.forEach(endpoint => {
      if (!servicesData[endpoint.id]) {
        setServicesData(prev => ({
          ...prev,
          [endpoint.id]: {
            integration_id: endpoint.integration_id,
            endpoint_id: endpoint.id,
            data: null,
            loading: false,
            error: null,
            last_updated: new Date()
          }
        }))
      }
    })
  }, [activeEndpoints])

  const fetchEndpointData = async (endpoint: APIEndpoint, integration: APIIntegration) => {
    const serviceKey = endpoint.id
    
    setServicesData(prev => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        loading: true,
        error: null
      }
    }))

    try {
      // Call our edge function to fetch API data securely
      const response = await supabase.functions.invoke('fetch-api-data', {
        body: {
          integration_id: integration.id,
          endpoint_id: endpoint.id
        }
      })

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch data')
      }

      const result = response.data
      
      setServicesData(prev => ({
        ...prev,
        [serviceKey]: {
          ...prev[serviceKey],
          data: result.data,
          loading: false,
          last_updated: new Date()
        }
      }))

      toast({
        title: "Data Updated",
        description: `${integration.name} - ${endpoint.name} data refreshed`
      })
    } catch (error) {
      console.error('Error fetching endpoint data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data'
      
      setServicesData(prev => ({
        ...prev,
        [serviceKey]: {
          ...prev[serviceKey],
          loading: false,
          error: errorMessage
        }
      }))

      toast({
        title: "Fetch Failed",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const renderDataVisualization = (data: any, format: 'json' | 'table' | 'cards' = 'json') => {
    if (!data) return null

    switch (format) {
      case 'table':
        if (Array.isArray(data)) {
          const columns = data.length > 0 ? Object.keys(data[0]) : []
          return (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {columns.map(col => (
                      <th key={col} className="border border-gray-200 px-3 py-2 text-left font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {columns.map(col => (
                        <td key={col} className="border border-gray-200 px-3 py-2">
                          {typeof row[col] === 'object' 
                            ? JSON.stringify(row[col]) 
                            : String(row[col])
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 10 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Showing 10 of {data.length} items
                </p>
              )}
            </div>
          )
        }
        break

      case 'cards':
        if (Array.isArray(data)) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.slice(0, 6).map((item: any, index: number) => (
                <Card key={index} className="p-3">
                  <CardContent className="p-0">
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground truncate ml-2">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
              {data.length > 6 && (
                <p className="text-xs text-muted-foreground col-span-full">
                  +{data.length - 6} more items
                </p>
              )}
            </div>
          )
        }
        break

      default:
        return (
          <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-64">
            {JSON.stringify(data, null, 2)}
          </pre>
        )
    }

    return (
      <pre className="bg-gray-50 p-3 rounded-md text-xs overflow-auto max-h-64">
        {JSON.stringify(data, null, 2)}
      </pre>
    )
  }

  const getVisualizationFormat = (data: any): 'json' | 'table' | 'cards' => {
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0]
      if (typeof firstItem === 'object' && firstItem !== null) {
        const keys = Object.keys(firstItem)
        return keys.length <= 3 ? 'cards' : 'table'
      }
    }
    return 'json'
  }

  if (activeEndpoints.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Active Services</h3>
          <p className="text-muted-foreground">
            Create API integrations with endpoints to see generated services here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-medium mb-2">Dynamic API Services</h3>
          <p className="text-muted-foreground">
            Real-time data from your integrated APIs rendered automatically
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Auto
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  JSON
                </div>
              </SelectItem>
              <SelectItem value="table">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4" />
                  Table
                </div>
              </SelectItem>
              <SelectItem value="cards">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Cards
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeEndpoints.map((endpoint) => {
          const integration = integrations.find(i => i.id === endpoint.integration_id)!
          const serviceData = servicesData[endpoint.id]
          
          return (
            <Card key={endpoint.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {integration.name}
                      <Badge variant="outline" className="text-xs">
                        {endpoint.http_method}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {endpoint.name} • {endpoint.endpoint_path}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchEndpointData(endpoint, integration)}
                    disabled={serviceData?.loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${serviceData?.loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                {serviceData?.loading && (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                )}

                {serviceData?.error && (
                  <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Failed to fetch data</p>
                      <p className="text-sm">{serviceData.error}</p>
                    </div>
                  </div>
                )}

                 {serviceData?.data && !serviceData.loading && !serviceData.error && (
                  <div className="space-y-3">
                    {renderDataVisualization(
                      serviceData.data, 
                      viewMode === 'auto' ? getVisualizationFormat(serviceData.data) : viewMode
                    )}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>
                        Last updated: {serviceData.last_updated.toLocaleTimeString()}
                      </span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {Array.isArray(serviceData.data) ? `${serviceData.data.length} items` : 'Object'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!serviceData?.data && !serviceData?.loading && !serviceData?.error && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="w-8 h-8 mx-auto mb-2" />
                    <p>No data loaded yet</p>
                    <p className="text-xs">Click refresh to fetch data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}