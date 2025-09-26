import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CoursesSection from '@/components/sections/CoursesSection'

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <CoursesSection />
      </main>
      <Footer />
    </div>
  )
}

export default Courses