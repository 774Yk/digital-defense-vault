import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ExternalLink, Play, Cloud, FileText } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  platform: 'Udemy' | 'OneDrive' | 'Mega'
  link: string
  thumbnail: string
  embedAllowed: boolean
}

interface CourseCardProps {
  course: Course
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [isEmbedOpen, setIsEmbedOpen] = useState(false)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Udemy':
        return <Play className="w-4 h-4" />
      case 'OneDrive':
        return <Cloud className="w-4 h-4" />
      case 'Mega':
        return <FileText className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Udemy':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'OneDrive':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Mega':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-primary/10 text-primary border-primary/20'
    }
  }

  const handleCourseAccess = () => {
    if (course.embedAllowed) {
      setIsEmbedOpen(true)
    } else {
      window.open(course.link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      <Card className="group border-primary/20 bg-card/60 backdrop-blur-md hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge 
            className={`absolute top-3 right-3 ${getPlatformColor(course.platform)}`}
          >
            <div className="flex items-center gap-1">
              {getPlatformIcon(course.platform)}
              {course.platform}
            </div>
          </Badge>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {course.description}
          </CardDescription>
          
          <Button 
            onClick={handleCourseAccess}
            className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0"
            size="sm"
          >
            {course.embedAllowed ? (
              <>
                <Play className="w-4 h-4" />
                Open Course
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Visit {course.platform}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Embed Dialog */}
      <Dialog open={isEmbedOpen} onOpenChange={setIsEmbedOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getPlatformIcon(course.platform)}
              {course.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 mt-4">
            <iframe
              src={course.link}
              className="w-full h-full border-0 rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CourseCard