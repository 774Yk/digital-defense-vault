import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Trash2, Github, ExternalLink } from 'lucide-react'
import { ToolCard } from './ToolCard'
import toolsData from '@/data/tools.json'
import { useToast } from '@/components/ui/use-toast'

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

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  clone_url: string
  topics: string[]
  stargazers_count: number
  language: string
}

interface ToolManagementProps {
  tools: Tool[]
  setTools: (tools: Tool[]) => void
}

export const ToolManagement = ({ tools, setTools }: ToolManagementProps) => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [githubResults, setGithubResults] = useState<GitHubRepo[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedToolId, setSelectedToolId] = useState<string>('')
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [isSearchingGitHub, setIsSearchingGitHub] = useState(false)
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: '',
    description: '',
    category: '',
    icon: '🔧',
    source_type: 'github',
    website_url: '',
    download_url: '',
    github_url: '',
    tags: [],
    is_downloadable: true,
    version: '1.0.0'
  })

  useEffect(() => {
    if (!tools.length) {
      setTools(toolsData as Tool[])
    }
  }, [tools, setTools])

  useEffect(() => {
    const filtered = tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTools(filtered)

    // Search GitHub if search term exists
    if (searchTerm.trim().length > 2) {
      searchGitHub(searchTerm)
    } else {
      setGithubResults([])
    }
  }, [tools, searchTerm])

  const searchGitHub = async (query: string) => {
    setIsSearchingGitHub(true)
    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+security+hacking+pentesting+cybersecurity&sort=stars&order=desc&per_page=6`
      )
      
      if (response.ok) {
        const data = await response.json()
        setGithubResults(data.items || [])
      } else {
        setGithubResults([])
      }
    } catch (error) {
      console.error('GitHub search error:', error)
      setGithubResults([])
    } finally {
      setIsSearchingGitHub(false)
    }
  }

  const generateToolId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const handleAddTool = () => {
    if (!newTool.name || !newTool.description || !newTool.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const tool: Tool = {
      id: generateToolId(),
      name: newTool.name!,
      description: newTool.description!,
      category: newTool.category!,
      icon: newTool.icon || '🔧',
      source_type: newTool.source_type || 'github',
      website_url: newTool.website_url || '',
      download_url: newTool.download_url || '',
      github_url: newTool.github_url || '',
      tags: typeof newTool.tags === 'string' 
        ? (newTool.tags as string).split(',').map(tag => tag.trim()).filter(Boolean)
        : newTool.tags || [],
      is_downloadable: newTool.is_downloadable ?? true,
      version: newTool.version || '1.0.0',
      created_at: new Date().toISOString()
    }

    setTools([...tools, tool])
    setNewTool({
      name: '',
      description: '',
      category: '',
      icon: '🔧',
      source_type: 'github',
      website_url: '',
      download_url: '',
      github_url: '',
      tags: [],
      is_downloadable: true,
      version: '1.0.0'
    })
    setIsAddDialogOpen(false)
    
    toast({
      title: "Success",
      description: "Tool added successfully"
    })
  }

  const handleDeleteTool = () => {
    setTools(tools.filter(tool => tool.id !== selectedToolId))
    setIsDeleteDialogOpen(false)
    setSelectedToolId('')
    
    toast({
      title: "Success", 
      description: "Tool deleted successfully"
    })
  }

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool)
    setNewTool(tool)
    setIsAddDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingTool) return handleAddTool()
    
    const updatedTool = {
      ...editingTool,
      ...newTool,
      tags: typeof newTool.tags === 'string'
        ? (newTool.tags as string).split(',').map(tag => tag.trim()).filter(Boolean)
        : newTool.tags || []
    }
    
    setTools(tools.map(tool => tool.id === editingTool.id ? updatedTool as Tool : tool))
    setEditingTool(null)
    setNewTool({
      name: '',
      description: '', 
      category: '',
      icon: '🔧',
      source_type: 'github',
      website_url: '',
      download_url: '',
      github_url: '',
      tags: [],
      is_downloadable: true,
      version: '1.0.0'
    })
    setIsAddDialogOpen(false)
    
    toast({
      title: "Success",
      description: "Tool updated successfully"
    })
  }

  const convertGitHubRepoToTool = (repo: GitHubRepo): Tool => {
    return {
      id: `github-${repo.id}`,
      name: repo.name,
      description: repo.description || 'No description available',
      category: 'GitHub Repository',
      icon: '📦',
      source_type: 'github',
      website_url: repo.html_url,
      download_url: repo.clone_url,
      github_url: repo.html_url,
      tags: repo.topics || [repo.language].filter(Boolean),
      is_downloadable: true,
      version: 'latest',
      created_at: new Date().toISOString()
    }
  }

  const categories = [
    'Network Security',
    'Web Security', 
    'Penetration Testing',
    'Cryptography',
    'Wireless Security',
    'OSINT',
    'Digital Forensics',
    'Malware Analysis',
    'Reverse Engineering',
    'Social Engineering',
    'Vulnerability Assessment'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔧</span>
                Tools Management
              </CardTitle>
              <CardDescription>
                Manage security tools and search GitHub repositories
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                    <DialogDescription>
                      {editingTool ? 'Update the tool information' : 'Add a new security tool to the collection'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tool Name *</Label>
                      <Input
                        id="name"
                        value={newTool.name || ''}
                        onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Nmap"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newTool.description || ''}
                        onChange={(e) => setNewTool(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the tool"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={newTool.category || ''}
                          onValueChange={(value) => setNewTool(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="icon">Icon (Emoji)</Label>
                        <Input
                          id="icon"
                          value={newTool.icon || ''}
                          onChange={(e) => setNewTool(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="🔧"
                          maxLength={2}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        type="url"
                        value={newTool.website_url || ''}
                        onChange={(e) => setNewTool(prev => ({ ...prev, website_url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="download">Download URL</Label>
                      <Input
                        id="download"
                        type="url"
                        value={newTool.download_url || ''}
                        onChange={(e) => setNewTool(prev => ({ ...prev, download_url: e.target.value }))}
                        placeholder="https://example.com/download"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        type="url"
                        value={newTool.github_url || ''}
                        onChange={(e) => setNewTool(prev => ({ ...prev, github_url: e.target.value }))}
                        placeholder="https://github.com/user/repo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="version">Version</Label>
                        <Input
                          id="version"
                          value={newTool.version || ''}
                          onChange={(e) => setNewTool(prev => ({ ...prev, version: e.target.value }))}
                          placeholder="1.0.0"
                        />
                      </div>
                      <div className="flex items-center space-x-2 mt-6">
                        <Switch
                          id="downloadable"
                          checked={newTool.is_downloadable ?? true}
                          onCheckedChange={(checked) => setNewTool(prev => ({ ...prev, is_downloadable: checked }))}
                        />
                        <Label htmlFor="downloadable">Is Downloadable</Label>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={Array.isArray(newTool.tags) ? newTool.tags.join(', ') : newTool.tags || ''}
                        onChange={(e) => setNewTool(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) }))}
                        placeholder="network, security, scanning"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setEditingTool(null)
                        setNewTool({
                          name: '',
                          description: '',
                          category: '',
                          icon: '🔧',
                          source_type: 'github',
                          website_url: '',
                          download_url: '',
                          github_url: '',
                          tags: [],
                          is_downloadable: true,
                          version: '1.0.0'
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingTool ? handleSaveEdit : handleAddTool}>
                      {editingTool ? 'Update Tool' : 'Add Tool'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Tool
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Tool</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select a tool to delete from the collection. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Select value={selectedToolId} onValueChange={setSelectedToolId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool to delete" />
                    </SelectTrigger>
                    <SelectContent>
                      {tools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.icon} {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteTool}
                      disabled={!selectedToolId}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Tool
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools or GitHub repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Local Tools */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Local Tools
            <Badge variant="outline">{filteredTools.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onEdit={handleEditTool}
                  onDelete={(id) => {
                    setSelectedToolId(id)
                    setIsDeleteDialogOpen(true)
                  }}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? `No tools found matching "${searchTerm}"` : 'No tools available'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Results */}
      {(githubResults.length > 0 || isSearchingGitHub) && (
        <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Results
              {isSearchingGitHub ? (
                <Badge variant="outline">Searching...</Badge>
              ) : (
                <Badge variant="outline">{githubResults.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Security-related repositories from GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearchingGitHub ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse border-primary/20">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {githubResults.map((repo) => (
                  <ToolCard
                    key={repo.id}
                    tool={convertGitHubRepoToTool(repo)}
                    isFromGitHub={true}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}