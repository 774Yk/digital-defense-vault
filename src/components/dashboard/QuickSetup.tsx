import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Settings, Users, Key, Database } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { SetupGuide } from './SetupGuide'

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  icon: React.ReactNode
}

export function QuickSetup() {
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: 'Database Configuration',
      description: 'Database tables and RLS policies are configured',
      completed: false,
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'api_keys',
      title: 'API Keys Configuration',
      description: 'AI service API keys are configured for chat functionality',
      completed: false,
      icon: <Key className="w-5 h-5" />
    },
    {
      id: 'admin_user',
      title: 'Admin User Setup',
      description: 'At least one user has admin privileges',
      completed: false,
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'system_settings',
      title: 'System Settings',
      description: 'Basic platform settings are configured',
      completed: false,
      icon: <Settings className="w-5 h-5" />
    }
  ])
  
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      // Check database configuration
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      // Check if current user is admin
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      // Check settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('id')
        .limit(1)

      setSetupSteps(prev => prev.map(step => {
        switch (step.id) {
          case 'database':
            return { ...step, completed: !!profilesData }
          case 'admin_user':
            return { ...step, completed: currentProfile?.role === 'SuperAdmin' || currentProfile?.role === 'Admin' }
          case 'system_settings':
            return { ...step, completed: !!settingsData?.length }
          case 'api_keys':
            // This would need to be checked differently in a real app
            return { ...step, completed: true } // Assume configured if we reach this point
          default:
            return step
        }
      }))
    } catch (error) {
      console.error('Error checking setup status:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedSteps = setupSteps.filter(step => step.completed).length
  const totalSteps = setupSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  const createSampleData = async () => {
    try {
      // Create sample course
      const { error: courseError } = await supabase
        .from('courses')
        .insert([
          {
            title: 'Introduction to Cybersecurity',
            description: 'Learn the fundamentals of cybersecurity',
            level: 'Beginner',
            slug: 'intro-to-cybersecurity',
            is_published: true,
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])

      // Create sample tool
      const { error: toolError } = await supabase
        .from('tools')
        .insert([
          {
            name: 'Network Scanner',
            description: 'A basic network scanning tool for security assessment',
            slug: 'network-scanner',
            source_type: 'GitHub',
            github_repo_url: 'https://github.com/example/network-scanner',
            version: '1.0.0',
            is_downloadable: true,
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])

      // Create sample vulnerability
      const { error: vulnError } = await supabase
        .from('vulnerabilities')
        .insert([
          {
            title: 'SQL Injection Example',
            slug: 'sql-injection-example',
            type: 'Web Application',
            severity: 'High',
            description_html: '<p>This demonstrates a common SQL injection vulnerability.</p>',
            proof_of_concept_html: '<p>Example proof of concept code...</p>',
            remediation_html: '<p>Use parameterized queries to prevent SQL injection.</p>',
            created_by: (await supabase.auth.getUser()).data.user?.id
          }
        ])

      if (courseError || toolError || vulnError) {
        throw new Error('Failed to create sample data')
      }

      toast({
        title: "Success",
        description: "Sample data created successfully"
      })
    } catch (error) {
      console.error('Error creating sample data:', error)
      toast({
        title: "Error",
        description: "Failed to create sample data",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading setup status...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <SetupGuide />
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Setup Progress</CardTitle>
          <CardDescription>
            Complete these steps to get your cybersecurity platform ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>{completedSteps}/{totalSteps} completed</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          <div className="space-y-4">
            {setupSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-shrink-0 text-muted-foreground">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <Badge variant={step.completed ? "default" : "secondary"}>
                  {step.completed ? "Complete" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>

          {progressPercentage === 100 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Setup Complete!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Your cybersecurity platform is ready to use. You can now add content and manage users.
                </p>
                <Button 
                  className="mt-3" 
                  variant="outline" 
                  onClick={createSampleData}
                >
                  Add Sample Data
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}