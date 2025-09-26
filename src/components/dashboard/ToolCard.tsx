import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Download, Github, Edit, Trash2 } from 'lucide-react'

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

interface ToolCardProps {
  tool: Tool
  onEdit?: (tool: Tool) => void
  onDelete?: (toolId: string) => void
  showActions?: boolean
  isFromGitHub?: boolean
}

export const ToolCard = ({ 
  tool, 
  onEdit, 
  onDelete, 
  showActions = false,
  isFromGitHub = false
}: ToolCardProps) => {
  const handleOpenTool = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-primary/20 bg-card/60 backdrop-blur-md hover:bg-card/80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                {tool.name}
                {isFromGitHub && (
                  <Badge variant="secondary" className="text-xs">
                    GitHub
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {tool.version}
              </Badge>
            </div>
          </CardTitle>
          {showActions && !isFromGitHub && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(tool)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(tool.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
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
              onClick={() => handleOpenTool(tool.website_url || tool.github_url)}
              className="flex-1 gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              {isFromGitHub ? 'View' : 'Open'}
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

          {tool.github_url && !isFromGitHub && (
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
  )
}