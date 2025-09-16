import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Users, 
  Key, 
  Database, 
  Settings,
  BookOpen,
  ExternalLink
} from 'lucide-react'

export function SetupGuide() {
  const setupSteps = [
    {
      title: "1. Authentication Ready",
      description: "User registration and login system is fully configured",
      status: "complete",
      icon: <Shield className="w-5 h-5" />,
      details: [
        "Email/password authentication enabled",
        "Social login options configured",
        "Session management and security"
      ]
    },
    {
      title: "2. Database Configured", 
      description: "All tables, policies, and security measures are in place",
      status: "complete",
      icon: <Database className="w-5 h-5" />,
      details: [
        "Row-level security (RLS) enabled on all tables",
        "User roles and permissions system",
        "Audit logging and data integrity"
      ]
    },
    {
      title: "3. Role Management",
      description: "SuperAdmin account configured with full platform access",
      status: "complete", 
      icon: <Users className="w-5 h-5" />,
      details: [
        "Owner account has SuperAdmin privileges",
        "Role promotion system ready",
        "Permission-based access control"
      ]
    },
    {
      title: "4. AI Integration",
      description: "Multi-provider AI chat system with fallback support",
      status: "complete",
      icon: <Key className="w-5 h-5" />,
      details: [
        "Gemini API configured and ready",
        "OpenAI and Claude fallback support",
        "Secure API key storage"
      ]
    }
  ]

  const nextActions = [
    {
      title: "Add Sample Content",
      description: "Create example courses, tools, and vulnerabilities",
      action: "Go to Setup Tab → Add Sample Data",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      title: "Invite Team Members", 
      description: "Share registration link with colleagues",
      action: "Share /auth page with team members",
      icon: <Users className="w-4 h-4" />
    },
    {
      title: "Configure Additional APIs",
      description: "Set up OpenAI or Claude for enhanced AI features",
      action: "Go to API Keys tab",
      icon: <Key className="w-4 h-4" />
    },
    {
      title: "Review Security Settings",
      description: "Check security status and enable additional protections",
      action: "Go to Settings tab → Security Status",
      icon: <Shield className="w-4 h-4" />
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <CardTitle className="text-green-800">Platform Setup Complete!</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            Your cybersecurity platform is fully configured and ready for use
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
          <CardDescription>
            All core systems have been set up and tested
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {setupSteps.map((step, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <h3 className="font-medium">{step.title}</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Complete
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-7">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < setupSteps.length - 1 && <Separator className="ml-11" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>
            Complete these actions to get the most out of your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextActions.map((action, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                <p className="text-xs text-primary mt-1">{action.action}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Platform Access</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <strong>Dashboard:</strong> Full access to all features and management tools
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <strong>AI Chat:</strong> Intelligent cybersecurity assistant ready to help
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <strong>Content Management:</strong> Create courses, tools, and documentation
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <strong>User Management:</strong> Invite team members and manage permissions
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}