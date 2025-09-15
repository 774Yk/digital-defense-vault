import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Wrench, 
  Zap, 
  Bug, 
  FileText,
  ArrowRight,
  Play,
  Download,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const quickSections = [
  {
    title: "Courses",
    description: "Interactive cybersecurity learning paths with hands-on labs",
    icon: BookOpen,
    href: "/courses",
    color: "primary",
    stats: "50+ Courses",
    features: ["Video Tutorials", "Lab Exercises", "Certifications"],
    gradient: "from-primary/20 to-primary-glow/20"
  },
  {
    title: "Tools", 
    description: "Open-source security tools and custom utilities",
    icon: Wrench,
    href: "/tools",
    color: "secondary", 
    stats: "100+ Tools",
    features: ["Source Code", "Documentation", "Download Links"],
    gradient: "from-secondary/20 to-purple-400/20"
  },
  {
    title: "DOS Attacks",
    description: "Educational content on Denial of Service attacks and defense",
    icon: Zap,
    href: "/dos-attacks", 
    color: "yellow-400",
    stats: "15+ Articles",
    features: ["Attack Vectors", "Mitigation", "Legal Guidance"],
    gradient: "from-yellow-400/20 to-orange-400/20"
  },
  {
    title: "Vulnerabilities",
    description: "Comprehensive vulnerability research and proof-of-concepts",
    icon: Bug,
    href: "/vulnerabilities",
    color: "red-400",
    stats: "500+ CVEs",
    features: ["PoC Examples", "Exploitation", "Remediation"],
    gradient: "from-red-400/20 to-pink-400/20"
  },
  {
    title: "Latest Articles",
    description: "Recent cybersecurity research and industry insights",
    icon: FileText,
    href: "/articles",
    color: "accent",
    stats: "Weekly Updates", 
    features: ["Research Papers", "Case Studies", "News Analysis"],
    gradient: "from-accent/20 to-green-400/20"
  }
];

const QuickSectionsGrid = () => {
  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-cyber font-bold mb-6">
            <span className="text-foreground">Explore </span>
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Security Arsenal
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dive into comprehensive cybersecurity education with curated courses, tools, and research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickSections.map((section, index) => (
            <Card 
              key={section.title}
              className={`
                group relative overflow-hidden border-primary/20 bg-card/60 backdrop-blur-md
                hover:border-primary/50 hover:shadow-glow-primary transition-all duration-500
                hover:-translate-y-2 cursor-pointer
              `}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    p-3 rounded-lg bg-gradient-glow border border-primary/30
                    group-hover:animate-cyber-pulse group-hover:shadow-glow-primary
                  `}>
                    <section.icon className={`h-8 w-8 text-${section.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                      {section.stats}
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-cyber group-hover:text-primary transition-colors">
                  {section.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {section.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {section.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 group-hover:animate-pulse" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    asChild
                    variant="outline"
                    size="sm" 
                    className="flex-1 border-primary/30 group-hover:border-primary group-hover:bg-primary/10"
                  >
                    <Link to={section.href}>
                      <Eye className="h-4 w-4 mr-1" />
                      Explore
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  
                  {(section.title === "Tools" || section.title === "Courses") && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:text-accent hover:bg-accent/10"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Terminal-style indicator */}
                <div className="mt-4 font-mono text-xs text-muted-foreground/50 group-hover:text-primary/70 transition-colors">
                  <span className="animate-terminal-blink">█</span> /cybersec/{section.title.toLowerCase().replace(' ', '-')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Button size="lg" className="bg-gradient-cyber hover:shadow-glow-primary font-cyber">
            <Play className="mr-2 h-5 w-5" />
            Start Learning Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuickSectionsGrid;