import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import PracticeAreaCard from "@/components/practice-areas/practice-area-card";

export default function Home() {
  const practiceAreas = [
    {
      title: "Direito do Trabalho",
      description: "Assessoria completa em relações trabalhistas, desde contratos até litígios complexos.",
      icon: "fas fa-briefcase"
    },
    {
      title: "Direito Previdenciário", 
      description: "Especialização em benefícios previdenciários e aposentadorias.",
      icon: "fas fa-user-shield"
    },
    {
      title: "Direito de Família e Sucessão",
      description: "Orientação em questões familiares, divórcios, inventários e heranças.",
      icon: "fas fa-heart"
    },
    {
      title: "Direito Civil",
      description: "Soluções em contratos, responsabilidade civil e direitos de personalidade.",
      icon: "fas fa-balance-scale"
    },
    {
      title: "Direito Imobiliário",
      description: "Assessoria em compra, venda e regularização de imóveis.",
      icon: "fas fa-building"
    },
    {
      title: "Direito Administrativo",
      description: "Representação em processos administrativos e licitações.",
      icon: "fas fa-university"
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <Header />
      <HeroSection />
      <AboutSection />
      
      {/* Practice Areas Section */}
      <section id="areas" className="py-20 bg-white" data-testid="practice-areas-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-fas-navy mb-6" data-testid="practice-areas-title">
              Áreas de Prática
            </h2>
            <div className="w-24 h-1 bg-fas-accent mx-auto mb-8"></div>
            <p className="text-xl text-fas-text">Conheça nossas especialidades jurídicas</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="practice-areas-grid">
            {practiceAreas.map((area) => (
              <PracticeAreaCard
                key={area.title}
                title={area.title}
                description={area.description}
                icon={area.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}
