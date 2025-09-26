import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';
import CourseCard from '@/components/dashboard/CourseCard';
import coursesData from '@/data/courses.json';

type Course = {
  id: string;
  title: string;
  description: string;
  platform: 'Udemy' | 'OneDrive' | 'Mega';
  link: string;
  thumbnail: string;
  embedAllowed: boolean;
};

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCourses(coursesData as Course[]);
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <CourseCard 
              key={course.id} 
              course={course}
            />
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