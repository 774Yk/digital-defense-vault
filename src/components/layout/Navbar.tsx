import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X, Globe, LogIn, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Tools", href: "/tools" },
    { name: "DOS Attacks", href: "/dos-attacks" },
    { name: "Vulnerabilities", href: "/vulnerabilities" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || (href !== "/" && location.pathname.startsWith(href));
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-cyber rounded-lg shadow-glow-primary group-hover:animate-cyber-pulse">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-cyber font-bold text-xl text-primary">CyberSec Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary shadow-glow-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Globe className="h-4 w-4 mr-1" />
              EN
            </Button>
            
            {/* Auth Buttons */}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Button>
            
            <Button variant="outline" size="sm" className="border-primary/30 hover:border-primary">
              <LayoutDashboard className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/90 backdrop-blur-md border-t border-primary/20 rounded-b-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-primary/20 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Language (EN)
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;