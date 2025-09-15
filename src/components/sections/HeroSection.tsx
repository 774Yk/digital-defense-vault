import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Shield, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 bg-gradient-glow" />
        {/* Cyber Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-cyber-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full animate-neon-flicker" />
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-accent rounded-full animate-cyber-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Contact Developer Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-card/80 backdrop-blur-md border border-primary/30 rounded-full">
            <Terminal className="h-4 w-4 text-primary mr-2 animate-terminal-blink" />
            <span className="text-sm text-foreground">
              Contact the developer: <span className="text-primary font-mono">Yassenalhajere@gmail.com</span>
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-cyber font-bold mb-6">
          <span className="bg-gradient-cyber bg-clip-text text-transparent animate-neon-flicker">
            Cyber Security
          </span>
          <br />
          <span className="text-foreground">Educational Hub</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-light">
          Master cybersecurity through interactive courses, tools, and vulnerability research. 
          <span className="text-primary"> Learn. Practice. Defend.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="group bg-gradient-cyber hover:shadow-glow-primary transition-all duration-300 font-semibold px-8 py-4 text-lg"
          >
            <Shield className="mr-2 h-5 w-5 group-hover:animate-cyber-pulse" />
            Explore Courses
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:shadow-glow-primary font-semibold px-8 py-4 text-lg"
          >
            <Zap className="mr-2 h-5 w-5" />
            View Tools
          </Button>
        </div>

        {/* Stats/Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card/40 backdrop-blur-md border border-primary/20 rounded-lg p-6 hover:shadow-glow-primary transition-all duration-300 group">
            <div className="text-3xl font-cyber font-bold text-primary mb-2 group-hover:animate-neon-flicker">50+</div>
            <div className="text-foreground font-medium mb-1">Security Courses</div>
            <div className="text-sm text-muted-foreground">Interactive learning paths</div>
          </div>
          
          <div className="bg-card/40 backdrop-blur-md border border-secondary/20 rounded-lg p-6 hover:shadow-glow-secondary transition-all duration-300 group">
            <div className="text-3xl font-cyber font-bold text-secondary mb-2 group-hover:animate-neon-flicker">100+</div>
            <div className="text-foreground font-medium mb-1">Security Tools</div>
            <div className="text-sm text-muted-foreground">Open source & custom</div>
          </div>
          
          <div className="bg-card/40 backdrop-blur-md border border-accent/20 rounded-lg p-6 hover:shadow-glow-accent transition-all duration-300 group">
            <div className="text-3xl font-cyber font-bold text-accent mb-2 group-hover:animate-neon-flicker">500+</div>
            <div className="text-foreground font-medium mb-1">Vulnerabilities</div>
            <div className="text-sm text-muted-foreground">Research & PoCs</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;