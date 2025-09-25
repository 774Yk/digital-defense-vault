import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Search, Download, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  language: string
  level: string
  cover_image_url?: string
  tags: string[]
  created_at: string
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      // Show demo courses since we don't have courses table yet
      setCourses([
        {
          id: '1',
          title: 'Introduction to Cybersecurity',
          slug: 'intro-cybersecurity',
          description: 'Learn the fundamentals of cybersecurity including threats, vulnerabilities, and defense strategies.',
          language: 'English',
          level: 'Beginner',
          cover_image_url: '',
          tags: ['Security', 'Fundamentals', 'Beginner'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Advanced Network Security',
          slug: 'advanced-network-security', 
          description: 'Deep dive into network security protocols, intrusion detection, and advanced threat analysis.',
          language: 'English',
          level: 'Advanced',
          cover_image_url: '',
          tags: ['Network', 'Advanced', 'Security'],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Web Application Security',
          slug: 'web-app-security', 
          description: 'Comprehensive guide to securing web applications and understanding common vulnerabilities.',
          language: 'English',
          level: 'Intermediate',
          cover_image_url: '',
          tags: ['Web', 'Application', 'Security'],
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/50'
      default: return 'bg-primary/20 text-primary border-primary/50'
    }
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
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cyber font-bold">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  Cybersecurity Courses
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Master cybersecurity with our comprehensive courses covering everything from basic concepts to advanced techniques
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 bg-background/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-primary/20 bg-card/60 backdrop-blur-md animate-pulse">
                    <div className="h-48 bg-muted/20 rounded-t-lg"></div>
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
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Courses will appear here once they are published'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="group border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
                    {course.cover_image_url && (
                      <div className="aspect-video bg-muted/20 rounded-t-lg overflow-hidden">
                        <img 
                          src={course.cover_image_url} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {course.title}
                        </CardTitle>
                        <Badge className={`${getLevelColor(course.level)} text-xs`}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {course.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {course.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{course.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {course.language}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/courses/${course.slug}`}>
                                View Course
                              </Link>
                            </Button>
                            <Button size="sm" className="gap-1">
                              <Download className="w-3 h-3" />
                              Download
                            </Button>
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

export default Courses