import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BookOpen, 
  Wrench, 
  Shield, 
  Zap,
  Users,
  Download,
  Eye,
  AlertTriangle 
} from 'lucide-react'

interface KPICardProps {
  title: string
  value: number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  target?: number
  icon: React.ElementType
  color: string
  description?: string
}

export const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  target,
  icon: Icon, 
  color,
  description 
}: KPICardProps) => {
  const progress = target ? (value / target) * 100 : 0
  const isOnTarget = progress >= 90
  const needsAttention = progress < 50

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/40 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          {needsAttention && <AlertTriangle className="h-3 w-3 text-destructive" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          {change !== undefined && (
            <Badge 
              variant={changeType === 'increase' ? 'default' : changeType === 'decrease' ? 'destructive' : 'secondary'}
              className="gap-1"
            >
              {changeType === 'increase' && <TrendingUp className="h-3 w-3" />}
              {changeType === 'decrease' && <TrendingDown className="h-3 w-3" />}
              {changeType === 'neutral' && <Minus className="h-3 w-3" />}
              {Math.abs(change)}%
            </Badge>
          )}
        </div>
        
        {target && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to target</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className={`h-2 ${isOnTarget ? 'bg-accent/20' : needsAttention ? 'bg-destructive/20' : 'bg-muted'}`}
            />
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export const KPICardsGrid = ({ stats }: { stats: any }) => {
  const kpiData = [
    {
      title: 'Active Courses',
      value: stats.courses,
      change: 12,
      changeType: 'increase' as const,
      target: 50,
      icon: BookOpen,
      color: 'text-primary',
      description: 'Published and available courses'
    },
    {
      title: 'Security Tools',
      value: stats.tools,
      change: 8,
      changeType: 'increase' as const,
      target: 100,
      icon: Wrench,
      color: 'text-accent',
      description: 'Available security tools and utilities'
    },
    {
      title: 'Vulnerabilities',
      value: stats.vulnerabilities,
      change: -3,
      changeType: 'decrease' as const,
      target: 200,
      icon: Shield,
      color: 'text-secondary',
      description: 'Documented security vulnerabilities'
    },
    {
      title: 'DOS Articles',
      value: stats.dosArticles,
      change: 15,
      changeType: 'increase' as const,
      target: 30,
      icon: Zap,
      color: 'text-terminal-red',
      description: 'Educational DOS attack articles'
    },
    {
      title: 'Monthly Views',
      value: 2847,
      change: 23,
      changeType: 'increase' as const,
      target: 5000,
      icon: Eye,
      color: 'text-terminal-blue',
      description: 'Total page views this month'
    },
    {
      title: 'Downloads',
      value: 1234,
      change: 7,
      changeType: 'increase' as const,
      target: 2000,
      icon: Download,
      color: 'text-terminal-green',
      description: 'Tool and resource downloads'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((kpi) => (
        <KPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}