import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  Target
} from 'lucide-react'

interface Insight {
  type: 'success' | 'warning' | 'info' | 'critical'
  title: string
  description: string
  value?: string
  trend?: 'up' | 'down' | 'stable'
}

export const ExecutiveSummary = ({ stats }: { stats: any }) => {
  const insights: Insight[] = [
    {
      type: 'success',
      title: 'Platform Growth',
      description: 'User engagement increased by 23% this month with strong adoption of new courses',
      value: '+23%',
      trend: 'up'
    },
    {
      type: 'warning', 
      title: 'Security Alert',
      description: '3 new critical vulnerabilities discovered and documented this week',
      value: '3 Critical',
      trend: 'up'
    },
    {
      type: 'info',
      title: 'Content Expansion',
      description: 'Tool library reached 80% of quarterly target with 15 new additions',
      value: '80% Target',
      trend: 'up'
    },
    {
      type: 'success',
      title: 'Learning Progress',
      description: 'Course completion rates improved to 87%, exceeding industry average',
      value: '87%',
      trend: 'up'
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-accent" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-terminal-yellow" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />
      default: return <Info className="h-4 w-4 text-primary" />
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-accent" />
      case 'down': return <TrendingDown className="h-3 w-3 text-destructive" />
      default: return null
    }
  }

  const quickStats = [
    { label: 'This Week', value: '2,847', subtitle: 'Active Users', change: '+12%' },
    { label: 'This Month', value: '15,230', subtitle: 'Page Views', change: '+8%' },
    { label: 'Completion Rate', value: '87%', subtitle: 'Course Avg', change: '+5%' },
    { label: 'Downloads', value: '1,234', subtitle: 'Tools & Resources', change: '+23%' }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border-primary/20 bg-card/60 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <Badge variant="outline" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Summary */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <Alert key={index} className={`border-l-4 ${
                insight.type === 'success' ? 'border-l-accent' :
                insight.type === 'warning' ? 'border-l-terminal-yellow' :
                insight.type === 'critical' ? 'border-l-destructive' :
                'border-l-primary'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <AlertDescription className="text-sm">
                        {insight.description}
                      </AlertDescription>
                    </div>
                  </div>
                  {insight.value && (
                    <Badge 
                      variant={insight.type === 'success' ? 'default' : 
                              insight.type === 'warning' ? 'secondary' : 'destructive'}
                      className="ml-2"
                    >
                      {insight.value}
                    </Badge>
                  )}
                </div>
              </Alert>
            ))}
          </div>

          {/* Key Metrics Summary */}
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Key Performance Highlights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Content:</span>
                <span className="font-medium">{stats.courses + stats.tools + stats.vulnerabilities + stats.dosArticles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Growth:</span>
                <span className="font-medium text-accent">+15.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Sessions:</span>
                <span className="font-medium">2,847</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}