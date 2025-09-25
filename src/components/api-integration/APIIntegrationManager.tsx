import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Settings, Activity, Globe } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { APIConfigForm } from './APIConfigForm'
import { APIServiceCard } from './APIServiceCard'
import { DynamicServiceRenderer } from './DynamicServiceRenderer'

interface APIIntegration {
  id: string
  name: string
  description: string
  base_url: string
  auth_type: string
  is_active: boolean
  created_at: string
  auth_config: Record<string, any>
  headers: Record<string, any>
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
  const { toast } = useToast()

  useEffect(() => {
    fetchIntegrations()
    fetchEndpoints()
  }, [])

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

  const activeIntegrations = integrations.filter(integration => integration.is_active)

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">API Integration Manager</h2>
          <p className="text-muted-foreground">
            Connect external APIs and create dynamic services for your platform
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add API Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total APIs</p>
                <p className="text-2xl font-semibold">{integrations.length}</p>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endpoints</p>
                <p className="text-2xl font-semibold">{endpoints.length}</p>
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
              {integrations.map((integration) => (
                <APIServiceCard
                  key={integration.id}
                  integration={integration}
                  endpoints={endpoints.filter(e => e.integration_id === integration.id)}
                  onToggle={handleIntegrationToggle}
                  onEdit={setSelectedIntegration}
                />
              ))}
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
          <Card>
            <CardHeader>
              <CardTitle>API Usage Analytics</CardTitle>
              <CardDescription>
                Monitor your API integrations performance and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Usage logs and analytics will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}