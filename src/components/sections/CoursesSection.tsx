import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, ExternalLink, Cloud, FileText, Play } from 'lucide-react';
import coursesData from '@/data/courses.json';

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  link: string;
  thumbnail: string;
  embedAllowed: boolean;
}

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCourses(coursesData);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'udemy':
        return <FileText className="w-4 h-4" />;
      case 'onedrive':
        return <Cloud className="w-4 h-4" />;
      case 'mega':
        return <div className="w-4 h-4 bg-primary rounded text-xs font-bold flex items-center justify-center text-background">M</div>;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'udemy':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'onedrive':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'mega':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-primary/20 text-primary border-primary/50';
    }
  };

  const handleCourseClick = (course: Course) => {
    window.open(course.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-card/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-glow rounded-full">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-cyber font-bold">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Course Library
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of programming and cybersecurity courses from top platforms
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.slice(0, 12).map((course) => (
            <Card 
              key={course.id} 
              className="group border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <div className="aspect-video bg-muted/20 rounded-t-lg overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <Badge className={`${getPlatformColor(course.platform)} text-xs shrink-0`}>
                    <div className="flex items-center gap-1">
                      {getPlatformIcon(course.platform)}
                      {course.platform}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs line-clamp-3 mb-4">
                  {course.description}
                </CardDescription>
                <Button 
                  size="sm" 
                  className="w-full gap-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourseClick(course);
                  }}
                >
                  {course.embedAllowed ? <Play className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                  {course.embedAllowed ? 'Watch Course' : 'Open Course'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {filteredCourses.length > 12 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              View All {filteredCourses.length} Courses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;