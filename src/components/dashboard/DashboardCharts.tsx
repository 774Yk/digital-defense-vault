import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react'

const activityData = [
  { month: 'Jan', users: 186, courses: 15, tools: 8, vulnerabilities: 42 },
  { month: 'Feb', users: 305, courses: 18, tools: 12, vulnerabilities: 39 },
  { month: 'Mar', users: 237, courses: 22, tools: 15, vulnerabilities: 45 },
  { month: 'Apr', users: 173, courses: 25, tools: 18, vulnerabilities: 52 },
  { month: 'May', users: 209, courses: 28, tools: 20, vulnerabilities: 48 },
  { month: 'Jun', users: 314, courses: 32, tools: 23, vulnerabilities: 55 }
]

const categoryData = [
  { name: 'Courses', value: 32, fill: 'hsl(var(--primary))' },
  { name: 'Tools', value: 23, fill: 'hsl(var(--accent))' },
  { name: 'Vulnerabilities', value: 55, fill: 'hsl(var(--secondary))' },
  { name: 'Articles', value: 18, fill: 'hsl(var(--terminal-blue))' }
]

const securityTrendsData = [
  { date: '2024-01', critical: 5, high: 12, medium: 18, low: 25 },
  { date: '2024-02', critical: 3, high: 15, medium: 22, low: 28 },
  { date: '2024-03', critical: 7, high: 10, medium: 20, low: 30 },
  { date: '2024-04', critical: 4, high: 13, medium: 25, low: 32 },
  { date: '2024-05', critical: 2, high: 16, medium: 27, low: 35 },
  { date: '2024-06', critical: 6, high: 14, medium: 24, low: 29 }
]

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--primary))",
    icon: TrendingUp,
  },
  courses: {
    label: "Courses",
    color: "hsl(var(--accent))",
  },
  tools: {
    label: "Tools", 
    color: "hsl(var(--secondary))",
  },
  vulnerabilities: {
    label: "Vulnerabilities",
    color: "hsl(var(--terminal-red))",
  },
  critical: {
    label: "Critical",
    color: "hsl(var(--terminal-red))",
  },
  high: {
    label: "High",
    color: "hsl(var(--terminal-yellow))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--terminal-blue))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--terminal-green))",
  }
}

export const ActivityTrendChart = () => {
  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Platform Activity Trends
        </CardTitle>
        <CardDescription>
          Monthly activity across different content categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="var(--color-users)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="courses" 
              stroke="var(--color-courses)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="tools" 
              stroke="var(--color-tools)" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const CategoryDistributionChart = () => {
  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-primary" />
          Content Distribution
        </CardTitle>
        <CardDescription>
          Distribution of content across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const SecurityTrendsChart = () => {
  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Security Vulnerability Trends
        </CardTitle>
        <CardDescription>
          Vulnerability severity distribution over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={securityTrendsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="critical"
              stackId="1"
              stroke="var(--color-critical)"
              fill="var(--color-critical)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="high"
              stackId="1"
              stroke="var(--color-high)"
              fill="var(--color-high)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="medium"
              stackId="1"
              stroke="var(--color-medium)"
              fill="var(--color-medium)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="low"
              stackId="1"
              stroke="var(--color-low)"
              fill="var(--color-low)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}