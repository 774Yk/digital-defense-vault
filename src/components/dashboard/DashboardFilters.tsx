import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { 
  Filter, 
  Calendar as CalendarIcon, 
  Search, 
  RotateCcw,
  TrendingUp,
  BarChart3,
  Users,
  Download
} from 'lucide-react'
import { format } from 'date-fns'

export interface FilterState {
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'custom'
  category: 'all' | 'courses' | 'tools' | 'vulnerabilities' | 'articles'
  region: 'all' | 'us' | 'eu' | 'asia' | 'global'
  metric: 'users' | 'views' | 'downloads' | 'completion'
  customDateFrom?: Date
  customDateTo?: Date
  search: string
}

interface DashboardFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export const DashboardFilters = ({ filters, onFiltersChange }: DashboardFiltersProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    onFiltersChange({
      dateRange: 'month',
      category: 'all',
      region: 'all', 
      metric: 'users',
      search: ''
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category !== 'all') count++
    if (filters.region !== 'all') count++
    if (filters.dateRange !== 'month') count++
    if (filters.metric !== 'users') count++
    if (filters.search) count++
    return count
  }

  const dateRangeLabels = {
    week: 'Last Week',
    month: 'Last Month', 
    quarter: 'Last Quarter',
    year: 'Last Year',
    custom: 'Custom Range'
  }

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Dashboard Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search dashboard..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => updateFilter('dateRange', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Select 
              value={filters.category} 
              onValueChange={(value) => updateFilter('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="vulnerabilities">Vulnerabilities</SelectItem>
                <SelectItem value="articles">Articles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div>
            <Select 
              value={filters.region} 
              onValueChange={(value) => updateFilter('region', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="asia">Asia Pacific</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Metric */}
          <div>
            <Select 
              value={filters.metric} 
              onValueChange={(value) => updateFilter('metric', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Users
                  </div>
                </SelectItem>
                <SelectItem value="views">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Views
                  </div>
                </SelectItem>
                <SelectItem value="downloads">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Downloads
                  </div>
                </SelectItem>
                <SelectItem value="completion">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Completion
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <div className="mt-4 flex gap-4">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {filters.customDateFrom && filters.customDateTo
                    ? `${format(filters.customDateFrom, 'MMM d')} - ${format(filters.customDateTo, 'MMM d')}`
                    : 'Select dates'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.customDateFrom,
                    to: filters.customDateTo,
                  }}
                  onSelect={(range) => {
                    updateFilter('customDateFrom', range?.from)
                    updateFilter('customDateTo', range?.to)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.category !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Category: {filters.category}
                </Badge>
              )}
              {filters.region !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Region: {filters.region}
                </Badge>
              )}
              {filters.dateRange !== 'month' && (
                <Badge variant="outline" className="gap-1">
                  Period: {dateRangeLabels[filters.dateRange]}
                </Badge>
              )}
              {filters.metric !== 'users' && (
                <Badge variant="outline" className="gap-1">
                  Metric: {filters.metric}
                </Badge>
              )}
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Search: "{filters.search}"
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}