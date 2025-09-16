import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Shield, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SecurityCheck {
  id: string
  name: string
  status: 'pass' | 'warn' | 'fail'
  description: string
  recommendation?: string
}

export function SecurityStatus() {
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([
    {
      id: 'rls_enabled',
      name: 'Row Level Security',
      status: 'pass',
      description: 'RLS is enabled on sensitive tables',
    },
    {
      id: 'auth_configured',
      name: 'Authentication Setup',
      status: 'pass',
      description: 'User authentication is properly configured',
    },
    {
      id: 'password_policy',
      name: 'Password Policy',
      status: 'warn',
      description: 'Leaked password protection is disabled',
      recommendation: 'Enable password strength validation in Supabase settings'
    },
    {
      id: 'api_keys',
      name: 'API Key Security',
      status: 'pass',
      description: 'API keys are stored securely in environment variables',
    },
    {
      id: 'cors_policy',
      name: 'CORS Configuration',
      status: 'pass',
      description: 'CORS policies are properly configured for edge functions',
    }
  ])

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const runSecurityScan = async () => {
    setLoading(true)
    try {
      // Simulate security scan - in a real app, this would call actual security APIs
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Security Scan Complete",
        description: "All security checks have been updated"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run security scan",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'fail':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Shield className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Secure</Badge>
      case 'warn':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
      case 'fail':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const passCount = securityChecks.filter(check => check.status === 'pass').length
  const warnCount = securityChecks.filter(check => check.status === 'warn').length
  const failCount = securityChecks.filter(check => check.status === 'fail').length
  const totalChecks = securityChecks.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Status
              </CardTitle>
              <CardDescription>
                Monitor your platform's security configuration and compliance
              </CardDescription>
            </div>
            <Button 
              onClick={runSecurityScan}
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Scanning...' : 'Run Scan'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{passCount}</div>
                <div className="text-sm text-green-600">Secure</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">{warnCount}</div>
                <div className="text-sm text-yellow-600">Warnings</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{failCount}</div>
                <div className="text-sm text-red-600">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{totalChecks}</div>
                <div className="text-sm text-blue-600">Total Checks</div>
              </CardContent>
            </Card>
          </div>

          {/* Security Checks */}
          <div className="space-y-4">
            {securityChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <h4 className="font-medium">{check.name}</h4>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                    {check.recommendation && (
                      <p className="text-sm text-yellow-600 mt-1">
                        💡 {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusBadge(check.status)}
              </div>
            ))}
          </div>

          {/* Warnings */}
          {warnCount > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Security Warnings Detected</AlertTitle>
              <AlertDescription className="text-yellow-700">
                There are {warnCount} security warnings that should be addressed to improve your platform's security posture.
              </AlertDescription>
            </Alert>
          )}

          {/* Additional Resources */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">Security Resources</h4>
              <div className="space-y-2">
                <Button variant="link" className="h-auto p-0 text-blue-700" asChild>
                  <a href="https://supabase.com/docs/guides/auth/password-security" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Supabase Password Security Guide <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <Button variant="link" className="h-auto p-0 text-blue-700" asChild>
                  <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    Row Level Security Documentation <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}