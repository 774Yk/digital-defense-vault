import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SocialLinksSection from "@/components/sections/SocialLinksSection";
import QuickSectionsGrid from "@/components/sections/QuickSectionsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <SocialLinksSection />
        <QuickSectionsGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
