import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Wrench, ExternalLink, Download, Search, Github } from 'lucide-react'
import toolsData from '@/data/tools.json'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: string
  source_type: string
  website_url: string
  download_url: string
  github_url: string
  tags: string[]
  is_downloadable: boolean
  version: string
  created_at: string
}

const ToolsSection = () => {
  const [tools, setTools] = useState<Tool[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTools = () => {
      setTools(toolsData as Tool[])
      setLoading(false)
    }
    loadTools()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTools(tools.slice(0, 8)) // Show first 8 tools on main page
    } else {
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredTools(filtered.slice(0, 8))
    }
  }, [tools, searchTerm])

  const handleOpenTool = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="bg-gradient-cyber bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Wrench className="w-8 h-8 text-primary" />
              Security Tools
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and download essential cybersecurity tools for penetration testing, analysis, and protection
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-primary/20"
            />
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse border-primary/20 bg-card/60 backdrop-blur-md">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 bg-muted rounded flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 border-primary/20 bg-card/60 backdrop-blur-md hover:bg-card/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <div>{tool.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {tool.version}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                      
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleOpenTool(tool.website_url)}
                          className="flex-1 gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </Button>
                        {tool.is_downloadable && (
                          <Button 
                            size="sm" 
                            onClick={() => handleOpenTool(tool.download_url)}
                            className="flex-1 gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                        )}
                      </div>

                      {tool.github_url && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleOpenTool(tool.github_url)}
                          className="w-full gap-1 text-xs"
                        >
                          <Github className="w-3 h-3" />
                          View on GitHub
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show More Button */}
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/tools'}
                className="gap-2"
              >
                <Wrench className="w-4 h-4" />
                View All Tools ({tools.length}+)
              </Button>
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && filteredTools.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No tools found matching "{searchTerm}"
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ToolsSection