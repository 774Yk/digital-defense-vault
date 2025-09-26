import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, Search, AlertTriangle, ExternalLink, Shield, Globe, Eye } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import ArticleDetail from '@/components/articles/ArticleDetail'
import articlesData from '@/data/dos-articles.json'

// Import images
import dosAttackImg from '@/assets/dos-attack-diagram.jpg'
import ddosAttackImg from '@/assets/ddos-attack-diagram.jpg'
import comparisonImg from '@/assets/dos-vs-ddos-comparison.jpg'
import firewallImg from '@/assets/firewall-protection.jpg'
import rateLimitingImg from '@/assets/rate-limiting.jpg'
import cdnImg from '@/assets/cdn-protection.jpg'
import idsImg from '@/assets/ids-systems.jpg'

interface DosArticle {
  id: string
  title: string
  slug: string
  description: string
  content_html: string
  image: string
  category: string
  tags: string[]
  created_at: string
}

interface ExternalResource {
  title: string
  description: string
  url: string
  icon: React.ElementType
}

const DosAttacks = () => {
  const [articles, setArticles] = useState<DosArticle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedArticle, setSelectedArticle] = useState<DosArticle | null>(null)
  const [isArticleDetailOpen, setIsArticleDetailOpen] = useState(false)

  // Image mapping
  const imageMap: Record<string, string> = {
    '/src/assets/dos-attack-diagram.jpg': dosAttackImg,
    '/src/assets/ddos-attack-diagram.jpg': ddosAttackImg,
    '/src/assets/dos-vs-ddos-comparison.jpg': comparisonImg,
    '/src/assets/firewall-protection.jpg': firewallImg,
    '/src/assets/rate-limiting.jpg': rateLimitingImg,
    '/src/assets/cdn-protection.jpg': cdnImg,
    '/src/assets/ids-systems.jpg': idsImg,
  }

  // External resources
  const externalResources: ExternalResource[] = [
    {
      title: 'OWASP DoS Prevention',
      description: 'دليل OWASP الشامل لمنع هجمات حرمان الخدمة',
      url: 'https://owasp.org/www-community/attacks/Denial_of_Service',
      icon: Shield
    },
    {
      title: 'Cloudflare DDoS Protection',
      description: 'مدونة Cloudflare حول حماية DDoS وأحدث التقنيات',
      url: 'https://blog.cloudflare.com/ddos/',
      icon: Globe
    },
    {
      title: 'Kaspersky Security Center',
      description: 'مركز Kaspersky للأمان وتقارير التهديدات',
      url: 'https://www.kaspersky.com/resource-center/threats/ddos-attacks',
      icon: Eye
    },
    {
      title: 'Imperva DDoS Protection',
      description: 'دليل Imperva لحماية التطبيقات من DDoS',
      url: 'https://www.imperva.com/learn/ddos/ddos-attacks/',
      icon: Shield
    }
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const processedArticles = articlesData.map(article => ({
        ...article,
        image: imageMap[article.image] || '/placeholder.svg'
      }))
      setArticles(processedArticles)
    } catch (error) {
      console.error('Error loading DOS articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))]
  
  const handleReadMore = (slug: string) => {
    const article = articles.find(a => a.slug === slug)
    if (article) {
      setSelectedArticle(article)
      setIsArticleDetailOpen(true)
    }
  }

  const handleCloseArticleDetail = () => {
    setIsArticleDetailOpen(false)
    setSelectedArticle(null)
  }

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer')
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

        {/* Search and Filters */}
        <section className="py-8 bg-background/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في المقالات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredArticles.length} مقال{filteredArticles.length !== 1 ? '' : ''} 
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category === 'all' ? 'جميع المقالات' : 
                     category === 'basics' ? 'الأساسيات' :
                     category === 'comparison' ? 'المقارنات' :
                     category === 'protection' ? 'الحماية' : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-cyber font-bold mb-4">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  مقالات تعليمية شاملة
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                تعلم كل ما تحتاج معرفته عن هجمات DoS وDDoS وطرق الحماية منها
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-primary/20 bg-card/60 backdrop-blur-md animate-pulse">
                    <div className="aspect-video bg-muted/20 rounded-t-lg"></div>
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
                <h3 className="text-xl font-semibold mb-2">لم يتم العثور على مقالات</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'جرب تعديل كلمات البحث' : 'ستظهر المقالات هنا عند إضافتها'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onReadMore={handleReadMore}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* External Resources */}
        <section className="py-16 bg-card/20 backdrop-blur-sm border-y border-primary/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-cyber font-bold">
                <span className="bg-gradient-cyber bg-clip-text text-transparent">
                  مصادر خارجية موثوقة
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                روابط لمصادر موثوقة ومحدثة حول أمن المعلومات والحماية من الهجمات
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {externalResources.map((resource, index) => {
                  const IconComponent = resource.icon
                  return (
                    <Card key={index} className="border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300 group">
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-4 p-3 bg-gradient-glow rounded-full w-fit">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {resource.title}
                        </CardTitle>
                        <CardDescription>
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          onClick={() => handleExternalLink(resource.url)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          زيارة الموقع
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              
              <div className="mt-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-cyber hover:bg-gradient-cyber/90 text-white font-semibold"
                  onClick={() => window.open('https://owasp.org/www-community/attacks/', '_blank', 'noopener noreferrer')}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  تعلم المزيد عن الأمن السيبراني
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Article Detail Modal */}
      <ArticleDetail 
        article={selectedArticle}
        isOpen={isArticleDetailOpen}
        onClose={handleCloseArticleDetail}
      />
    </div>
  )
}

export default DosAttacks