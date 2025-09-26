import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import CourseCard from './CourseCard'
import coursesData from '@/data/courses.json'

interface Course {
  id: string
  title: string
  description: string
  platform: 'Udemy' | 'OneDrive' | 'Mega'
  link: string
  thumbnail: string
  embedAllowed: boolean
}

const CoursesGrid = () => {
  const [courses] = useState<Course[]>(coursesData as Course[])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)
  const [searchTerm, setSearchTerm] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('all')

  useEffect(() => {
    let filtered = courses

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by platform
    if (platformFilter !== 'all') {
      filtered = filtered.filter(course => course.platform === platformFilter)
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, platformFilter])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/60 border-primary/20"
          />
        </div>
        
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-card/60 border-primary/20">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder="All Platforms" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Udemy">Udemy</SelectItem>
            <SelectItem value="OneDrive">OneDrive</SelectItem>
            <SelectItem value="Mega">Mega</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        {platformFilter !== 'all' && ` on ${platformFilter}`}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm || platformFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Courses will appear here once they are published'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesGrid