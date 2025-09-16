import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { 
  LayoutDashboard, 
  BookOpen, 
  Wrench, 
  Shield, 
  Zap, 
  Users, 
  Settings, 
  FileText,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Target,
  Activity
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import APIKeyManager from '@/components/APIKeyManager'
import { KPICardsGrid } from '@/components/dashboard/KPICards'
import { ActivityTrendChart, CategoryDistributionChart, SecurityTrendsChart } from '@/components/dashboard/DashboardCharts'
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary'
import { DashboardFilters, FilterState } from '@/components/dashboard/DashboardFilters'
import { InteractiveActions } from '@/components/dashboard/InteractiveActions'
import { UserManagement } from '@/components/dashboard/UserManagement'
import { QuickSetup } from '@/components/dashboard/QuickSetup'

interface UserProfile {
  id: string
  name: string
  role: string
  is_active: boolean
}

const Dashboard = () => {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState({
    courses: 0,
    tools: 0,
    vulnerabilities: 0,
    dosArticles: 0
  })
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'month',
    category: 'all',
    region: 'all',
    metric: 'users',
    search: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchStats()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const [coursesRes, toolsRes, vulnRes, dosRes] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('tools').select('id', { count: 'exact' }),
        supabase.from('vulnerabilities').select('id', { count: 'exact' }),
        supabase.from('dos_articles').select('id', { count: 'exact' })
      ])

      setStats({
        courses: coursesRes.count || 0,
        tools: toolsRes.count || 0,
        vulnerabilities: vulnRes.count || 0,
        dosArticles: dosRes.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Only allow users with appropriate roles to access dashboard
  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <h2 className="text-2xl font-bold text-destructive mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">
            Your user profile could not be loaded. Please contact an administrator.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const isAdmin = profile?.role === 'SuperAdmin' || profile?.role === 'Admin'
  const canEdit = isAdmin || profile?.role === 'Editor'

  const statCards = [
    { title: 'Courses', value: stats.courses, icon: BookOpen, color: 'text-blue-400' },
    { title: 'Tools', value: stats.tools, icon: Wrench, color: 'text-green-400' },
    { title: 'Vulnerabilities', value: stats.vulnerabilities, icon: Shield, color: 'text-orange-400' },
    { title: 'DOS Articles', value: stats.dosArticles, icon: Zap, color: 'text-red-400' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-cyber font-bold">
                  <span className="bg-gradient-cyber bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {profile?.name || user.email}
                </p>
              </div>
              <Badge variant={profile?.is_active ? "default" : "secondary"}>
                {profile?.role || 'User'}
              </Badge>
            </div>
          </div>

          {/* Executive Summary */}
          <ExecutiveSummary stats={stats} />

          {/* Dashboard Filters */}
          <DashboardFilters filters={filters} onFiltersChange={setFilters} />

          {/* Enhanced KPIs */}
          <KPICardsGrid stats={stats} />

          {/* Main Content */}
          <Tabs defaultValue="setup" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-9">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              {canEdit && <TabsTrigger value="courses">Courses</TabsTrigger>}
              {canEdit && <TabsTrigger value="tools">Tools</TabsTrigger>}
              {canEdit && <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>}
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
            </TabsList>

            <TabsContent value="setup" className="space-y-6">
              <QuickSetup />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="space-y-6">
                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ActivityTrendChart />
                  <CategoryDistributionChart />
                </div>
                
                <SecurityTrendsChart />
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <InteractiveActions />
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Published Courses</span>
                      <Badge variant="outline">{stats.courses}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Available Tools</span>
                      <Badge variant="outline">{stats.tools}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Vulnerability Entries</span>
                      <Badge variant="outline">{stats.vulnerabilities}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Educational Articles</span>
                      <Badge variant="outline">{stats.dosArticles}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Role</span>
                      <Badge>{profile?.role || 'User'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Status</span>
                      <Badge variant={profile?.is_active ? "default" : "secondary"}>
                        {profile?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Email</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {!canEdit && (
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>Welcome to the Dashboard</CardTitle>
                    <CardDescription>
                      You currently have read-only access to the platform. To contribute content or manage resources, 
                      you'll need Editor or Admin privileges.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Contact the administrator if you need additional permissions to contribute to the platform.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {canEdit && (
              <>
                <TabsContent value="courses" className="space-y-6">
                  <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Manage Courses
                        </CardTitle>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Course
                        </Button>
                      </div>
                      <CardDescription>
                        Create and manage cybersecurity courses with lessons, videos, and downloadable content.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        Course management interface will be implemented here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tools" className="space-y-6">
                  <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="w-5 h-5 text-primary" />
                          Manage Tools
                        </CardTitle>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Tool
                        </Button>
                      </div>
                      <CardDescription>
                        Upload security tools, link GitHub repositories, and manage download permissions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        Tool management interface will be implemented here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vulnerabilities" className="space-y-6">
                  <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Manage Vulnerabilities
                        </CardTitle>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Vulnerability
                        </Button>
                      </div>
                      <CardDescription>
                        Document vulnerabilities with proof-of-concept examples and remediation strategies.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        Vulnerability management interface will be implemented here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}

            <TabsContent value="api-keys" className="space-y-6">
              <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure AI service API keys for enhanced functionality.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <APIKeyManager />
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="settings" className="space-y-6">
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      System Settings
                    </CardTitle>
                    <CardDescription>
                      Configure platform settings, manage users, and view audit logs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserManagement />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default Dashboard