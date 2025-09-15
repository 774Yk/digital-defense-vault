import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Mail, MapPin, Clock, Send } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SocialLinksSection from '@/components/sections/SocialLinksSection'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      })
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-b border-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-glow rounded-full">
                <Mail className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-cyber font-bold">
              <span className="bg-gradient-cyber bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about cybersecurity, need help with our tools, or want to contribute to the platform? 
              We're here to help and collaborate.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      Send us a message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your question or feedback..."
                          rows={6}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Direct Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-glow rounded-lg">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Email</p>
                          <p className="text-muted-foreground">Yassenalhajere@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-glow rounded-lg">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Response Time</p>
                          <p className="text-muted-foreground">Usually within 24-48 hours</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-glow rounded-lg">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Purpose</p>
                          <p className="text-muted-foreground">Educational & Defensive Cybersecurity</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>What can we help with?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Questions about cybersecurity concepts</li>
                      <li>• Technical support for tools and resources</li>
                      <li>• Suggestions for new content or features</li>
                      <li>• Collaboration opportunities</li>
                      <li>• Educational partnerships</li>
                      <li>• Reporting issues or bugs</li>
                      <li>• General feedback about the platform</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle>Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We maintain a professional and educational environment. All communications 
                      should focus on legitimate cybersecurity education and defensive practices. 
                      We do not provide assistance for illegal activities or unauthorized system access.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <SocialLinksSection />
      </main>

      <Footer />
    </div>
  )
}

export default Contact