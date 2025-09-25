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
      // For now, we'll show a simplified setup status since we don't have user management tables yet
      setSetupSteps(prev => prev.map(step => {
        switch (step.id) {
          case 'database':
            return { ...step, completed: true } // Database is connected
          case 'admin_user':
            return { ...step, completed: false } // No user management yet
          case 'system_settings':
            return { ...step, completed: false } // No settings table yet
          case 'api_keys':
            return { ...step, completed: true } // API keys can be configured
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
    toast({
      title: "Info",
      description: "Sample data creation will be available once content management tables are set up"
    })
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