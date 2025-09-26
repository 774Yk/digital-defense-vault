import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Course {
  id: string
  title: string
  description: string
  platform: 'Udemy' | 'OneDrive' | 'Mega'
  link: string
  thumbnail: string
  embedAllowed: boolean
}

interface CourseManagementProps {
  courses: Course[]
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
}

const CourseManagement = ({ courses, setCourses }: CourseManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const { toast } = useToast()

  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    platform: 'Udemy',
    link: '',
    thumbnail: '',
    embedAllowed: false
  })

  const generateThumbnail = (platform: string, title: string) => {
    const keywords = title.toLowerCase().includes('python') ? 'python programming' :
                    title.toLowerCase().includes('c++') ? 'cpp programming' :
                    title.toLowerCase().includes('security') ? 'cybersecurity' :
                    title.toLowerCase().includes('web') ? 'web development' :
                    'programming code'
    
    return `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&q=${encodeURIComponent(keywords)}`
  }

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.link) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      })
      return
    }

    const course: Course = {
      ...newCourse,
      id: Date.now().toString(),
      thumbnail: newCourse.thumbnail || generateThumbnail(newCourse.platform, newCourse.title)
    }

    setCourses(prev => [...prev, course])
    setNewCourse({
      title: '',
      description: '',
      platform: 'Udemy',
      link: '',
      thumbnail: '',
      embedAllowed: false
    })
    setIsAddDialogOpen(false)
    
    toast({
      title: "تم بنجاح",
      description: "تم إضافة الكورس بنجاح"
    })
  }

  const handleDeleteCourse = () => {
    setCourses(prev => prev.filter(course => course.id !== selectedCourseId))
    setIsDeleteDialogOpen(false)
    setSelectedCourseId('')
    
    toast({
      title: "تم بنجاح",
      description: "تم حذف الكورس بنجاح"
    })
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course })
  }

  const handleSaveEdit = () => {
    if (!editingCourse) return

    setCourses(prev => prev.map(course => 
      course.id === editingCourse.id ? editingCourse : course
    ))
    setEditingCourse(null)
    
    toast({
      title: "تم بنجاح",
      description: "تم تحديث الكورس بنجاح"
    })
  }

  const handleCancelEdit = () => {
    setEditingCourse(null)
  }

  return (
    <Card className="bg-card/60 border-primary/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>إدارة الكورسات</span>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                  <Plus className="w-4 h-4" />
                  إضافة كورس
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة كورس جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">عنوان الكورس</Label>
                    <Input
                      id="title"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="أدخل عنوان الكورس"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={newCourse.description}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="أدخل وصف الكورس"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">المنصة</Label>
                    <Select value={newCourse.platform} onValueChange={(value: 'Udemy' | 'OneDrive' | 'Mega') => 
                      setNewCourse(prev => ({ ...prev, platform: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Udemy">Udemy</SelectItem>
                        <SelectItem value="OneDrive">OneDrive</SelectItem>
                        <SelectItem value="Mega">Mega</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="link">رابط الكورس</Label>
                    <Input
                      id="link"
                      value={newCourse.link}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="أدخل رابط الكورس"
                    />
                  </div>
                  <div>
                    <Label htmlFor="thumbnail">رابط الصورة المصغرة (اختياري)</Label>
                    <Input
                      id="thumbnail"
                      value={newCourse.thumbnail}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="سيتم إنشاؤها تلقائياً إذا تُركت فارغة"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="embedAllowed"
                      checked={newCourse.embedAllowed}
                      onCheckedChange={(checked) => setNewCourse(prev => ({ ...prev, embedAllowed: checked }))}
                    />
                    <Label htmlFor="embedAllowed">السماح بالتضمين (Iframe)</Label>
                  </div>
                  <Button onClick={handleAddCourse} className="w-full">
                    إضافة الكورس
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  حذف كورس
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>حذف كورس</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label htmlFor="courseSelect">اختر الكورس المراد حذفه</Label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر كورس" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleDeleteCourse} 
                    variant="destructive" 
                    className="w-full"
                    disabled={!selectedCourseId}
                  >
                    حذف الكورس
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            إجمالي الكورسات: {courses.length}
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                {editingCourse?.id === course.id ? (
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse(prev => prev ? { ...prev, title: e.target.value } : null)}
                      className="text-sm"
                    />
                    <Textarea
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="text-xs"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit} className="gap-1">
                        <Save className="w-3 h-3" />
                        حفظ
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} className="gap-1">
                        <X className="w-3 h-3" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{course.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{course.description}</div>
                      <div className="text-xs text-primary">{course.platform}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCourse(course)}
                      className="gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      تعديل
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseManagement