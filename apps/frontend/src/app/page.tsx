import Hero from "@/components/Hero";
import TopProjects from "@/components/TopProjects";
import TopTutorials from "@/components/TopTutorials";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="space-y-20">
      <Hero />
      <TopProjects />
      <TopTutorials />
      <ContactSection />
    </div>
  );
}
