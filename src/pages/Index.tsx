import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SocialLinksSection from "@/components/sections/SocialLinksSection";
import QuickSectionsGrid from "@/components/sections/QuickSectionsGrid";
import CoursesSection from "@/components/sections/CoursesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <SocialLinksSection />
        <QuickSectionsGrid />
        <CoursesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
