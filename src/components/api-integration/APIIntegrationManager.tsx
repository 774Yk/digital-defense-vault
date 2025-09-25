import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Plus, Settings, Activity, Globe, Search, RefreshCw, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { APIConfigForm } from './APIConfigForm'
import { APIServiceCard } from './APIServiceCard'
import { DynamicServiceRenderer } from './DynamicServiceRenderer'
import { APIUsageLogs } from './APIUsageLogs'

interface APIIntegration {
  id: string
  name: string
  description: string
  base_url: string
  auth_type: string
  auth_config: Record<string, any>
  headers: Record<string, any>
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
  request_params: Record<string, any>
  metadata: Record<string, any>
}

export function APIIntegrationManager() {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([])
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<APIIntegration | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [healthStatus, setHealthStatus] = useState<Record<string, 'healthy' | 'degraded' | 'down'>>({})
  const [usageStats, setUsageStats] = useState({ totalRequests: 0, successRate: 0, avgResponseTime: 0 })
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const handleEditIntegration = (integration: APIIntegration) => {
    const completeIntegration: APIIntegration = {
      ...integration,
      auth_config: integration.auth_config || {},
      headers: integration.headers || {},
      metadata: integration.metadata || {}
    }
    setSelectedIntegration(completeIntegration)
  }

  useEffect(() => {
    fetchIntegrations()
    fetchEndpoints()
    fetchUsageStats()
    checkAPIHealth()
    
    // Set up periodic health checks
    const healthInterval = setInterval(checkAPIHealth, 300000) // 5 minutes
    return () => clearInterval(healthInterval)
  }, [])

  const checkAPIHealth = async () => {
    try {
      const healthResults: Record<string, 'healthy' | 'degraded' | 'down'> = {}
      
      for (const integration of integrations.filter(i => i.is_active)) {
        try {
          const response = await supabase.functions.invoke('fetch-api-data', {
            body: { 
              integration_id: integration.id,
              endpoint_id: endpoints.find(e => e.integration_id === integration.id)?.id,
              health_check: true 
            }
          })
          
          if (response.error) {
            healthResults[integration.id] = 'down'
          } else {
            const responseTime = response.data?.response_time_ms || 0
            healthResults[integration.id] = responseTime > 5000 ? 'degraded' : 'healthy'
          }
        } catch (error) {
          healthResults[integration.id] = 'down'
        }
      }
      
      setHealthStatus(healthResults)
    } catch (error) {
      console.error('Health check failed:', error)
    }
  }

  const fetchUsageStats = async () => {
    try {
      const { data: logs, error } = await supabase
        .from('api_usage_logs')
        .select('response_status, response_time_ms')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (error) throw error

      const totalRequests = logs?.length || 0
      const successfulRequests = logs?.filter(log => log.response_status >= 200 && log.response_status < 300).length || 0
      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
      const avgResponseTime = logs?.length 
        ? logs.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / logs.length 
        : 0

      setUsageStats({ totalRequests, successRate, avgResponseTime })
    } catch (error) {
      console.error('Error fetching usage stats:', error)
    }
  }

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setIntegrations((data || []).map(integration => ({
        ...integration,
        auth_config: integration.auth_config as Record<string, any> || {},
        headers: integration.headers as Record<string, any> || {},
        metadata: integration.metadata as Record<string, any> || {}
      })))
    } catch (error) {
      console.error('Error fetching integrations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch API integrations",
        variant: "destructive"
      })
    }
  }

  const fetchEndpoints = async () => {
    try {
      const { data, error } = await supabase
        .from('api_endpoints')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setEndpoints((data || []).map(endpoint => ({
        ...endpoint,
        request_params: endpoint.request_params as Record<string, any> || {},
        metadata: endpoint.metadata as Record<string, any> || {}
      })))
    } catch (error) {
      console.error('Error fetching endpoints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIntegrationCreated = (integration: any) => {
    const typedIntegration: APIIntegration = {
      ...integration,
      auth_config: integration.auth_config || {},
      headers: integration.headers || {},
      metadata: integration.metadata || {}
    }
    setIntegrations([typedIntegration, ...integrations])
    setShowAddForm(false)
    toast({
      title: "Success",
      description: "API integration created successfully"
    })
  }

  const handleIntegrationToggle = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_integrations')
        .update({ is_active: isActive })
        .eq('id', id)

      if (error) throw error

      setIntegrations(integrations.map(integration =>
        integration.id === id ? { ...integration, is_active: isActive } : integration
      ))

      toast({
        title: "Success", 
        description: `Integration ${isActive ? 'enabled' : 'disabled'}`
      })
    } catch (error) {
      console.error('Error toggling integration:', error)
      toast({
        title: "Error",
        description: "Failed to update integration status",
        variant: "destructive"
      })
    }
  }

  const refreshAllData = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchIntegrations(),
        fetchEndpoints(),
        fetchUsageStats(),
        checkAPIHealth()
      ])
      toast({
        title: "Data Refreshed",
        description: "All API integration data has been updated"
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh some data",
        variant: "destructive"
      })
    } finally {
      setRefreshing(false)
    }
  }

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeIntegrations = filteredIntegrations.filter(integration => integration.is_active)

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'down': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading API integrations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">API Integration Manager</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAllData}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-muted-foreground">
            Connect external APIs and create dynamic services for your platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add API Integration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total APIs</p>
                <p className="text-2xl font-semibold">{integrations.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  {Object.values(healthStatus).map((status, i) => getHealthIcon(status))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active APIs</p>
                <p className="text-2xl font-semibold">{activeIntegrations.length}</p>
                <p className="text-xs text-muted-foreground">
                  {Object.values(healthStatus).filter(s => s === 'healthy').length} healthy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-semibold">{usageStats.successRate.toFixed(1)}%</p>
                <Progress value={usageStats.successRate} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-semibold">{usageStats.avgResponseTime.toFixed(0)}ms</p>
                <p className="text-xs text-muted-foreground">
                  {usageStats.totalRequests} requests (24h)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">API Integrations</TabsTrigger>
          <TabsTrigger value="services">Generated Services</TabsTrigger>
          <TabsTrigger value="logs">Usage Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {showAddForm ? (
            <APIConfigForm
              onSuccess={handleIntegrationCreated}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map((integration) => (
                <APIServiceCard
                  key={integration.id}
                  integration={integration}
                  endpoints={endpoints.filter(e => e.integration_id === integration.id)}
                  onToggle={handleIntegrationToggle}
                  onEdit={handleEditIntegration}
                  healthStatus={healthStatus[integration.id]}
                />
              ))}
              {filteredIntegrations.length === 0 && integrations.length > 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No integrations found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or add a new integration
                    </p>
                    <Button onClick={() => setSearchTerm('')} variant="outline">
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
              {integrations.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No API integrations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first external API integration
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First API
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <DynamicServiceRenderer integrations={activeIntegrations} endpoints={endpoints} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">API Usage Logs & Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Monitor API performance, usage patterns, and troubleshoot issues
            </p>
          </div>
          <APIUsageLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}