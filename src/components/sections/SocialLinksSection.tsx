import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  Send, 
  Github,
  ExternalLink
} from "lucide-react";

const socialLinks = [
  {
    name: "Twitter/X",
    icon: Twitter,
    href: "https://twitter.com",
    color: "hover:text-blue-400 hover:shadow-[0_0_20px_rgba(29,161,242,0.5)]"
  },
  {
    name: "Instagram", 
    icon: Instagram,
    href: "https://instagram.com",
    color: "hover:text-pink-400 hover:shadow-[0_0_20px_rgba(225,48,108,0.5)]"
  },
  {
    name: "Facebook",
    icon: Facebook, 
    href: "https://facebook.com",
    color: "hover:text-blue-500 hover:shadow-[0_0_20px_rgba(24,119,242,0.5)]"
  },
  {
    name: "Telegram",
    icon: Send,
    href: "https://telegram.org",
    color: "hover:text-blue-300 hover:shadow-[0_0_20px_rgba(0,136,204,0.5)]"
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com", 
    color: "hover:text-gray-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
  },
  {
    name: "TryHackMe",
    icon: ExternalLink,
    href: "https://tryhackme.com",
    color: "hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
  }
];

const SocialLinksSection = () => {
  return (
    <section className="py-16 bg-card/20 backdrop-blur-sm border-y border-primary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-cyber font-bold mb-4">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Connect & Follow
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest cybersecurity research, tools, and educational content across all platforms
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className={`
                bg-card/60 backdrop-blur-md border border-primary/20 rounded-lg p-6
                transition-all duration-300 hover:border-primary/50 hover:bg-card/80
                flex flex-col items-center text-center space-y-3
                ${social.color}
              `}>
                <div className="p-3 bg-gradient-glow rounded-full group-hover:animate-cyber-pulse">
                  <social.icon className="h-6 w-6 text-foreground group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {social.name}
                  </div>
                  <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Follow for updates
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-cyber rounded-full shadow-glow-primary">
            <span className="text-primary-foreground font-semibold mr-2">
              Join the Community
            </span>
            <ExternalLink className="h-4 w-4 text-primary-foreground animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialLinksSection;