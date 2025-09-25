import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/integrations/supabase/client'
import { Shield, Search, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface Vulnerability {
  id: string
  title: string
  slug: string
  type: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  description_html: string
  tags: string[]
  created_at: string
}

const Vulnerabilities = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVulnerabilities()
  }, [])

  const fetchVulnerabilities = async () => {
    try {
      // Show demo vulnerabilities since we don't have vulnerabilities table yet
      setVulnerabilities([
        {
          id: '1',
          title: 'SQL Injection Example',
          slug: 'sql-injection-example',
          type: 'Web Application',
          severity: 'High',
          description_html: '<p>Learn about SQL injection vulnerabilities</p>',
          tags: ['web', 'database', 'injection'],
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVulnerabilities = vulnerabilities.filter(vuln =>
    vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vuln.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/50'
      default: return 'bg-primary/20 text-primary border-primary/50'
    }
  }

  const getTypeIcon = (type: string) => {
    return <AlertTriangle className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-b border-primary/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-glow rounded-full">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cyber font-bold">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  Vulnerability Database
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Learn about common security vulnerabilities, their exploitation techniques, and how to defend against them
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-destructive-foreground">
                  ⚠️ <strong>Legal Notice:</strong> This information is provided for educational and defensive purposes only. 
                  Unauthorized testing of vulnerabilities against systems you don't own is illegal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-background/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vulnerabilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredVulnerabilities.length} vulnerabilit{filteredVulnerabilities.length !== 1 ? 'ies' : 'y'} found
              </div>
            </div>
          </div>
        </section>

        {/* Vulnerabilities Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-primary/20 bg-card/60 backdrop-blur-md animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                      <div className="h-3 bg-muted/20 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted/20 rounded"></div>
                        <div className="h-3 bg-muted/20 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredVulnerabilities.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No vulnerabilities found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Vulnerability information will appear here once published'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVulnerabilities.map((vuln) => (
                  <Card key={vuln.id} className="group border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                          {getTypeIcon(vuln.type)}
                          {vuln.title}
                        </CardTitle>
                        <Badge className={`${getSeverityColor(vuln.severity)} text-xs`}>
                          {vuln.severity}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        <Badge variant="outline" className="text-xs mr-2">
                          {vuln.type}
                        </Badge>
                        <span dangerouslySetInnerHTML={{ 
                          __html: vuln.description_html?.substring(0, 100) + '...' || 'No description available' 
                        }} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {vuln.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {vuln.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{vuln.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Educational Resource
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/vulnerabilities/${vuln.slug}`}>
                              Learn More
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Vulnerabilities;