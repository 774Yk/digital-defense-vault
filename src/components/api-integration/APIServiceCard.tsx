import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Globe, Settings, MoreVertical, ExternalLink, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

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

interface Props {
  integration: APIIntegration
  endpoints: APIEndpoint[]
  onToggle: (id: string, isActive: boolean) => void
  onEdit: (integration: APIIntegration) => void
  healthStatus?: 'healthy' | 'degraded' | 'down'
}

export function APIServiceCard({ integration, endpoints, onToggle, onEdit, healthStatus }: Props) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle(integration.id, !integration.is_active)
    } finally {
      setIsToggling(false)
    }
  }

  const getAuthTypeColor = (authType: string) => {
    switch (authType) {
      case 'none':
        return 'bg-gray-100 text-gray-700'
      case 'api_key':
        return 'bg-blue-100 text-blue-700'
      case 'bearer_token':
        return 'bg-green-100 text-green-700'
      case 'basic_auth':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatAuthType = (authType: string) => {
    return authType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getHealthIcon = () => {
    switch (healthStatus) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'down': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className={`transition-all ${integration.is_active ? 'border-green-200' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${integration.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Globe className={`w-5 h-5 ${integration.is_active ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                {getHealthIcon()}
              </div>
              <CardDescription className="text-sm">
                {new URL(integration.base_url).hostname}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={integration.is_active}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(integration)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Configuration
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="w-4 h-4 mr-2" />
                  View Logs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {integration.description || 'No description provided'}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={getAuthTypeColor(integration.auth_type)}>
            {formatAuthType(integration.auth_type)}
          </Badge>
          <Badge variant={integration.is_active ? 'default' : 'secondary'}>
            {integration.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {endpoints.length > 0 && (
            <Badge variant="outline">
              {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {endpoints.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Endpoints:</h4>
            <div className="space-y-1">
              {endpoints.slice(0, 3).map((endpoint) => (
                <div key={endpoint.id} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {endpoint.http_method}
                  </Badge>
                  <span className="text-muted-foreground font-mono">
                    {endpoint.endpoint_path}
                  </span>
                </div>
              ))}
              {endpoints.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{endpoints.length - 3} more endpoints
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            Created {new Date(integration.created_at).toLocaleDateString()}
          </span>
          {integration.is_active && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}