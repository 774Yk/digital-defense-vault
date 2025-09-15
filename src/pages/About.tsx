import { Shield, Target, Users, BookOpen, Wrench, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const About = () => {
  const missions = [
    {
      icon: BookOpen,
      title: "Education First",
      description: "Providing comprehensive cybersecurity education to build a stronger defense community"
    },
    {
      icon: Shield,
      title: "Defensive Focus",
      description: "All content is designed to improve defensive capabilities and security awareness"
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Fostering a collaborative environment for cybersecurity professionals and enthusiasts"
    },
    {
      icon: Target,
      title: "Practical Learning",
      description: "Hands-on tools and real-world scenarios to enhance practical security skills"
    }
  ]

  const values = [
    "Ethical cybersecurity practices",
    "Educational and defensive purposes only",
    "Open source collaboration",
    "Continuous learning and improvement",
    "Legal compliance and responsibility",
    "Community-driven content"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-b border-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-glow rounded-full">
                <Shield className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-cyber font-bold">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                About Our Mission
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Building a comprehensive cybersecurity education platform focused on defensive techniques, 
              ethical practices, and community-driven learning.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-cyber font-bold mb-4">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We believe that cybersecurity education should be accessible, practical, and focused on building 
                defensive capabilities. Our platform provides comprehensive resources for security professionals, 
                students, and enthusiasts to learn and grow in the field of cybersecurity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.map((mission) => (
                <Card key={mission.title} className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-glow rounded-lg">
                        <mission.icon className="w-6 h-6 text-primary" />
                      </div>
                      {mission.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-foreground">
                      {mission.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Legal Notice */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-y border-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-destructive-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-destructive-foreground mb-3">
                    Legal Notice & Terms of Use
                  </h3>
                  <div className="space-y-3 text-sm text-destructive-foreground">
                    <p>
                      <strong>Educational and Defensive Use Only:</strong> All content, tools, and techniques provided 
                      on this platform are intended solely for educational purposes and defensive cybersecurity practices.
                    </p>
                    <p>
                      <strong>No Encouragement of Illegal Activities:</strong> We do not encourage, condone, or support 
                      any illegal hacking activities. Unauthorized access to computer systems is illegal and unethical.
                    </p>
                    <p>
                      <strong>User Responsibility:</strong> Users are responsible for ensuring their activities comply 
                      with all applicable laws and regulations. Use this knowledge responsibly to protect systems 
                      and networks, not to exploit them.
                    </p>
                    <p>
                      <strong>Ethical Guidelines:</strong> We promote ethical cybersecurity practices that focus on 
                      protecting organizations and individuals from security threats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-cyber font-bold mb-4">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  Our Values
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                These core values guide everything we do and every piece of content we create.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-card/60 backdrop-blur-md rounded-lg border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools & Resources */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-y border-primary/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-cyber font-bold mb-4">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  What We Offer
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-primary/20 bg-card/60 backdrop-blur-md text-center">
                <CardHeader>
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive cybersecurity courses from beginner to advanced levels
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/60 backdrop-blur-md text-center">
                <CardHeader>
                  <Wrench className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Educational security tools and utilities for defensive purposes
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/60 backdrop-blur-md text-center">
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Learn about common vulnerabilities and how to defend against them
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/60 backdrop-blur-md text-center">
                <CardHeader>
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Attack Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Understanding attack vectors to build better defenses
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-cyber font-bold mb-6">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions, suggestions, or want to contribute? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                📧 Yassenalhajere@gmail.com
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                🌐 Educational Platform
              </Badge>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About