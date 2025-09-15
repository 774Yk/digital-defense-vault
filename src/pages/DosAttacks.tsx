import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/integrations/supabase/client'
import { Zap, Search, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface DosArticle {
  id: string
  title: string
  slug: string
  content_html: string
  legal_note_html: string
  created_at: string
}

const DosAttacks = () => {
  const [articles, setArticles] = useState<DosArticle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('dos_articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching DOS articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content_html?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  <Zap className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-cyber font-bold">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  DOS Attacks & Defense
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Understanding Denial of Service attacks: how they work, their impact, and how to defend against them
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-destructive-foreground">
                    <strong>Critical Legal Warning:</strong> Performing DOS attacks against systems you don't own is illegal and can result in serious criminal charges. This content is strictly for educational and defensive purposes only.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-background/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search DOS articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-primary/20 bg-card/60 backdrop-blur-md animate-pulse">
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
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'DOS attack articles will appear here once published'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="group border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        <span dangerouslySetInnerHTML={{ 
                          __html: article.content_html?.substring(0, 150) + '...' || 'No content available' 
                        }} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            Educational Only
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Defense Focus
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/dos-attacks/${article.slug}`}>
                              Read Article
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Defense Resources */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-y border-primary/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-cyber font-bold">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  Defense Resources
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Detection Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about tools and techniques for detecting DOS attacks in real-time
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Mitigation Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Discover effective methods to mitigate and prevent DOS attacks
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-card/60 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Response Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Develop comprehensive incident response plans for DOS attacks
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default DosAttacks