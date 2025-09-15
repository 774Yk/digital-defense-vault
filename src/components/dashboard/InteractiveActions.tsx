import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Upload, 
  Camera, 
  Mic, 
  Video, 
  Search, 
  Share2, 
  FileText, 
  Image as ImageIcon,
  Download,
  MonitorSpeaker,
  Zap
} from 'lucide-react'

export const InteractiveActions = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded successfully`
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast({
      title: "Images Uploaded",
      description: `${files.length} image(s) uploaded successfully`
    })
  }

  const handleAudioRecording = () => {
    if (isRecording) {
      // Stop recording logic
      setIsRecording(false)
      toast({
        title: "Recording Stopped",
        description: "Audio recording saved successfully"
      })
    } else {
      // Start recording logic
      setIsRecording(true)
      toast({
        title: "Recording Started", 
        description: "Audio recording in progress..."
      })
    }
  }

  const handleCameraCapture = () => {
    toast({
      title: "Camera Activated",
      description: "Camera interface would open here"
    })
  }

  const handleVideoRecording = () => {
    toast({
      title: "Video Recording",
      description: "Video recording interface would open here"
    })
  }

  const handleScreenShare = () => {
    toast({
      title: "Screen Sharing",
      description: "Screen sharing interface would open here"
    })
  }

  const handleDeepSearch = () => {
    toast({
      title: "Deep Search",
      description: "Advanced search interface would open here"
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const actionButtons = [
    {
      title: 'Upload Documents',
      description: 'PDF, Word, Excel files',
      icon: Upload,
      action: () => fileInputRef.current?.click(),
      color: 'text-primary'
    },
    {
      title: 'Upload Images',
      description: 'Screenshots, reports',
      icon: ImageIcon,
      action: () => imageInputRef.current?.click(),
      color: 'text-accent'
    },
    {
      title: 'Voice Recording',
      description: 'Quick voice notes',
      icon: Mic,
      action: handleAudioRecording,
      color: isRecording ? 'text-destructive' : 'text-terminal-green',
      active: isRecording
    },
    {
      title: 'Camera Capture',
      description: 'Take photos/screenshots',
      icon: Camera,
      action: handleCameraCapture,
      color: 'text-secondary'
    },
    {
      title: 'Video Creation',
      description: 'Record presentation',
      icon: Video,
      action: handleVideoRecording,
      color: 'text-terminal-blue'
    },
    {
      title: 'Screen Share',
      description: 'Share screen/desktop',
      icon: MonitorSpeaker,
      action: handleScreenShare,
      color: 'text-terminal-yellow'
    },
    {
      title: 'Deep Search',
      description: 'AI-powered search',
      icon: Search,
      action: handleDeepSearch,
      color: 'text-primary'
    },
    {
      title: 'Quick Export',
      description: 'Export dashboard data',
      icon: Download,
      action: () => toast({ title: "Export Started", description: "Dashboard data export in progress..." }),
      color: 'text-accent'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Interactive Actions Grid */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Interactive Tools & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actionButtons.map((button) => (
              <Button
                key={button.title}
                variant={button.active ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-3 ${
                  button.active ? 'animate-pulse' : ''
                }`}
                onClick={button.action}
              >
                <button.icon className={`w-6 h-6 ${button.color}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{button.title}</div>
                  <div className="text-xs text-muted-foreground">{button.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Bar */}
      <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Quick Share:</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Dashboard
            </Button>
            <div className="ml-auto">
              <Badge variant="outline" className="gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Live Data
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}