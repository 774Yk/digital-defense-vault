import { Link } from "react-router-dom";
import { Shield, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: "Courses", href: "/courses" },
      { name: "Tools", href: "/tools" },
      { name: "Vulnerabilities", href: "/vulnerabilities" },
      { name: "DOS Attacks", href: "/dos-attacks" }
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" }
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
      { name: "Support", href: "/support" }
    ]
  };

  return (
    <footer className="relative bg-card/40 backdrop-blur-md border-t border-primary/20">
      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-cyber rounded-lg shadow-glow-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-cyber font-bold text-xl text-primary">CyberSec Hub</span>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering cybersecurity professionals through comprehensive education, 
              cutting-edge tools, and real-world vulnerability research.
            </p>

            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-2">Developer Contact:</div>
              <a 
                href="mailto:Yassenalhajere@gmail.com"
                className="text-primary hover:text-primary-glow font-mono text-sm hover:underline transition-colors"
              >
                Yassenalhajere@gmail.com
              </a>
            </div>

            <Button 
              asChild
              variant="outline" 
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Link to="/dashboard">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Access Dashboard
              </Link>
            </Button>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-cyber font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-cyber font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-cyber font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {currentYear} CyberSec Hub. All rights reserved. | 
              <span className="text-primary ml-1">Educational purposes only</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-muted-foreground">Powered by</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-mono text-primary">Open Source</span>
              </div>
            </div>
          </div>
          
          {/* Legal Disclaimer */}
          <div className="mt-6 p-4 bg-muted/20 border border-yellow-400/20 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <span className="text-yellow-400 font-semibold">⚠️ Legal Notice:</span> 
              All content, tools, and vulnerability information are provided for educational and defensive purposes only. 
              Unauthorized access to computer systems is illegal and strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;