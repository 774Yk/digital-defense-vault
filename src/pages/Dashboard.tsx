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
  Trash2
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

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
        .single()

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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.title} className="border-primary/20 bg-card/60 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {canEdit && <TabsTrigger value="courses">Courses</TabsTrigger>}
              {canEdit && <TabsTrigger value="tools">Tools</TabsTrigger>}
              {canEdit && <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>}
              {canEdit && <TabsTrigger value="dos-articles">DOS Articles</TabsTrigger>}
              {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
            </TabsList>

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

                <TabsContent value="dos-articles" className="space-y-6">
                  <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Manage DOS Articles
                        </CardTitle>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Article
                        </Button>
                      </div>
                      <CardDescription>
                        Create educational content about DOS attacks and defense mechanisms.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center py-8">
                        DOS article management interface will be implemented here.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}

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
                    <p className="text-muted-foreground text-center py-8">
                      System settings interface will be implemented here.
                    </p>
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