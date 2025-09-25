import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Download, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface APIUsageLog {
  id: string
  integration_id: string
  endpoint_id: string
  request_url: string
  response_status: number
  response_time_ms: number
  error_message?: string
  created_at: string
  created_by?: string
}

interface APIIntegration {
  id: string
  name: string
  base_url: string
}

interface UsageStats {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  errorRate: number
  requestsToday: number
  requestsThisWeek: number
  topEndpoints: Array<{ endpoint: string, count: number }>
  statusDistribution: Array<{ status: number, count: number }>
  hourlyDistribution: Array<{ hour: number, count: number }>
}

export function APIUsageLogs() {
  const [logs, setLogs] = useState<APIUsageLog[]>([])
  const [integrations, setIntegrations] = useState<APIIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIntegration, setSelectedIntegration] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('24h')
  const [stats, setStats] = useState<UsageStats>({
    totalRequests: 0,
    successRate: 0,
    avgResponseTime: 0,
    errorRate: 0,
    requestsToday: 0,
    requestsThisWeek: 0,
    topEndpoints: [],
    statusDistribution: [],
    hourlyDistribution: []
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchLogs()
    fetchIntegrations()
    fetchStats()
  }, [timeRange, selectedIntegration])

  const getTimeRangeFilter = () => {
    const now = new Date()
    switch (timeRange) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000)
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }
  }

  const fetchLogs = async () => {
    try {
      const timeFilter = getTimeRangeFilter()
      let query = supabase
        .from('api_usage_logs')
        .select('*')
        .gte('created_at', timeFilter.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000)

      if (selectedIntegration !== 'all') {
        query = query.eq('integration_id', selectedIntegration)
      }

      const { data, error } = await query

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch usage logs",
        variant: "destructive"
      })
    }
  }

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('id, name, base_url')
        .eq('is_active', true)

      if (error) throw error
      setIntegrations(data || [])
    } catch (error) {
      console.error('Error fetching integrations:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const timeFilter = getTimeRangeFilter()
      let query = supabase
        .from('api_usage_logs')
        .select('*')
        .gte('created_at', timeFilter.toISOString())

      if (selectedIntegration !== 'all') {
        query = query.eq('integration_id', selectedIntegration)
      }

      const { data: logs, error } = await query

      if (error) throw error

      const totalRequests = logs?.length || 0
      const successfulRequests = logs?.filter(log => log.response_status >= 200 && log.response_status < 300).length || 0
      const errorRequests = logs?.filter(log => log.response_status >= 400).length || 0

      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
      const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0
      const avgResponseTime = logs?.length 
        ? logs.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / logs.length 
        : 0

      // Calculate today's requests
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const requestsToday = logs?.filter(log => new Date(log.created_at) >= today).length || 0

      // Calculate this week's requests  
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const requestsThisWeek = logs?.filter(log => new Date(log.created_at) >= weekAgo).length || 0

      // Top endpoints
      const endpointCounts: Record<string, number> = {}
      logs?.forEach(log => {
        const endpoint = log.request_url
        endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1
      })
      const topEndpoints = Object.entries(endpointCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([endpoint, count]) => ({ endpoint, count }))

      // Status distribution
      const statusCounts: Record<number, number> = {}
      logs?.forEach(log => {
        statusCounts[log.response_status] = (statusCounts[log.response_status] || 0) + 1
      })
      const statusDistribution = Object.entries(statusCounts)
        .map(([status, count]) => ({ status: parseInt(status), count }))
        .sort((a, b) => b.count - a.count)

      // Hourly distribution
      const hourlyCounts: Record<number, number> = {}
      logs?.forEach(log => {
        const hour = new Date(log.created_at).getHours()
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1
      })
      const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: hourlyCounts[hour] || 0
      }))

      setStats({
        totalRequests,
        successRate,
        avgResponseTime,
        errorRate,
        requestsToday,
        requestsThisWeek,
        topEndpoints,
        statusDistribution,
        hourlyDistribution
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-100'
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-100'
    if (status >= 400 && status < 500) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusText = (status: number) => {
    if (status >= 200 && status < 300) return 'Success'
    if (status >= 300 && status < 400) return 'Redirect'
    if (status >= 400 && status < 500) return 'Client Error'
    return 'Server Error'
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Integration', 'URL', 'Status', 'Response Time (ms)', 'Error'].join(','),
      ...logs.map(log => [
        log.created_at,
        integrations.find(i => i.id === log.integration_id)?.name || 'Unknown',
        log.request_url,
        log.response_status,
        log.response_time_ms,
        log.error_message || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-usage-logs-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredLogs = logs.filter(log => {
    const integration = integrations.find(i => i.id === log.integration_id)
    const searchString = `${integration?.name || ''} ${log.request_url} ${log.response_status} ${log.error_message || ''}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading usage analytics...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Integrations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Integrations</SelectItem>
              {integrations.map(integration => (
                <SelectItem key={integration.id} value={integration.id}>
                  {integration.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-semibold">{stats.totalRequests.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  {stats.requestsToday} today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-semibold">{stats.successRate.toFixed(1)}%</p>
                <Progress value={stats.successRate} className="h-1 mt-1" />
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
                <p className="text-2xl font-semibold">{stats.avgResponseTime.toFixed(0)}ms</p>
                <p className="text-xs text-muted-foreground">
                  {stats.avgResponseTime < 1000 ? 'Excellent' : stats.avgResponseTime < 3000 ? 'Good' : 'Slow'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-semibold">{stats.errorRate.toFixed(1)}%</p>
                <Progress value={stats.errorRate} className="h-1 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Request Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Request Logs</CardTitle>
              <CardDescription>
                Detailed log of all API requests in the selected time range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Integration</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No logs found for the selected criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.slice(0, 100).map((log) => {
                        const integration = integrations.find(i => i.id === log.integration_id)
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs">
                              {new Date(log.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{integration?.name || 'Unknown'}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs max-w-xs truncate">
                              {log.request_url}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(log.response_status)} text-xs`}>
                                {log.response_status} {getStatusText(log.response_status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`${log.response_time_ms > 3000 ? 'text-red-600' : log.response_time_ms > 1000 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {log.response_time_ms}ms
                              </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                              {log.error_message || '-'}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredLogs.length > 100 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Showing first 100 of {filteredLogs.length} logs
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Top Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-mono truncate max-w-xs">{endpoint.endpoint}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(endpoint.count / stats.topEndpoints[0]?.count || 1) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{endpoint.count}</span>
                    </div>
                  </div>
                ))}
                {stats.topEndpoints.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.statusDistribution.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(status.status)} text-xs`}>
                        {status.status}
                      </Badge>
                      <span className="text-sm">{getStatusText(status.status)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(status.count / stats.totalRequests) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{status.count}</span>
                    </div>
                  </div>
                ))}
                {stats.statusDistribution.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Response Time Analysis</h4>
                  <p className="text-sm text-blue-800">
                    Average response time is {stats.avgResponseTime.toFixed(0)}ms. 
                    {stats.avgResponseTime < 1000 ? ' Excellent performance!' : 
                     stats.avgResponseTime < 3000 ? ' Good performance, consider optimization.' : 
                     ' Performance needs improvement.'}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Success Rate</h4>
                  <p className="text-sm text-green-800">
                    {stats.successRate.toFixed(1)}% success rate over {timeRange}.
                    {stats.successRate >= 99 ? ' Outstanding reliability!' :
                     stats.successRate >= 95 ? ' Good reliability.' :
                     ' Consider investigating frequent errors.'}
                  </p>
                </div>

                {stats.errorRate > 5 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-900 mb-2">High Error Rate</h4>
                    <p className="text-sm text-red-800">
                      Error rate of {stats.errorRate.toFixed(1)}% is concerning. 
                      Review failed requests and consider implementing retry logic.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Request Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Requests today:</span>
                    <span className="font-medium">{stats.requestsToday}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Requests this week:</span>
                    <span className="font-medium">{stats.requestsThisWeek}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Daily average:</span>
                    <span className="font-medium">{Math.round(stats.requestsThisWeek / 7)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Hourly Distribution</h4>
                  <div className="flex items-end gap-1 h-20">
                    {stats.hourlyDistribution.map((hour) => (
                      <div key={hour.hour} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-primary/20 rounded-t"
                          style={{ 
                            height: `${Math.max((hour.count / Math.max(...stats.hourlyDistribution.map(h => h.count))) * 100, 2)}%` 
                          }}
                        />
                        <span className="text-xs text-muted-foreground mt-1">
                          {hour.hour.toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}