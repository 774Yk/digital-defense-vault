import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/integrations/supabase/client'
import { Wrench, Search, Github, Download, ExternalLink } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  source_type: 'github' | 'local'
  github_repo_url?: string
  version?: string
  is_downloadable: boolean
  tags: string[]
  created_at: string
}

const Tools = () => {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      // Show demo tools since we don't have tools table yet
      setTools([
        {
          id: '1',
          name: 'Network Scanner',
          slug: 'network-scanner',
          description: 'Advanced network scanning tool',
          version: '2.1.0',
          source_type: 'local',
          tags: ['network', 'scanning', 'security'],
          is_downloadable: true,
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
                  <Wrench className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cyber font-bold">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  Security Tools
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover and download cybersecurity tools for education and defensive purposes
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-destructive-foreground">
                  ⚠️ <strong>Educational Use Only:</strong> These tools are provided for educational and defensive cybersecurity purposes. 
                  Unauthorized use against systems you don't own is illegal and unethical.
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
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
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
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Tools will appear here once they are published'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="group border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {tool.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {tool.source_type === 'github' && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Github className="w-3 h-3" />
                              GitHub
                            </Badge>
                          )}
                          {tool.version && (
                            <Badge variant="secondary" className="text-xs">
                              v{tool.version}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {tool.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {tool.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tool.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Educational Use Only
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/tools/${tool.slug}`}>
                                View Details
                              </Link>
                            </Button>
                            {tool.source_type === 'github' && tool.github_repo_url ? (
                              <Button size="sm" className="gap-1" asChild>
                                <a href={tool.github_repo_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3" />
                                  GitHub
                                </a>
                              </Button>
                            ) : (
                              <Button size="sm" className="gap-1">
                                <Download className="w-3 h-3" />
                                Download
                              </Button>
                            )}
                          </div>
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
  )
}

export default Tools