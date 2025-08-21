import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToAreas = () => {
    const element = document.getElementById("areas");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="pt-20 bg-white relative overflow-hidden" data-testid="hero-section">
      {/* Animated Background Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center opacity-5 select-none">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-fas-navy leading-none whitespace-nowrap" style={{animation: 'subtle-pulse 4s ease-in-out infinite'}}>
            VALENÇA & SOARES
          </h1>
        </div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-fas-accent opacity-10 rounded-full animate-float" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-fas-navy opacity-10 transform rotate-45" style={{animation: 'gentle-rotate 20s linear infinite, float 8s ease-in-out infinite', animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-fas-accent opacity-10 rounded-full animate-float" style={{animationDelay: '2s', animationDuration: '7s'}}></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-fas-navy opacity-10 transform rotate-12 animate-float" style={{animationDelay: '0.5s', animationDuration: '5s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-fas-accent opacity-10 rounded-full animate-float" style={{animationDelay: '3s', animationDuration: '9s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-fas-navy opacity-10 transform rotate-45 animate-float" style={{animationDelay: '4s', animationDuration: '6s'}}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* FAS-inspired hero banner */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl md:text-3xl font-bold text-fas-navy mb-2">Pessoas</h2>
              <div className="w-16 h-1 bg-fas-accent mx-auto animate-expand"></div>
            </div>
            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <h2 className="text-2xl md:text-3xl font-bold text-fas-navy mb-2">Excelência</h2>
              <div className="w-16 h-1 bg-fas-accent mx-auto animate-expand" style={{animationDelay: '0.2s'}}></div>
            </div>
            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <h2 className="text-2xl md:text-3xl font-bold text-fas-navy mb-2">Resultados</h2>
              <div className="w-16 h-1 bg-fas-accent mx-auto animate-expand" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-fas-navy leading-tight animate-fade-in-up" data-testid="hero-title" style={{animationDelay: '0.8s'}}>
            Valença e Soares combina conhecimento sobre o mercado local com uma visão global
          </h1>
          <p className="text-xl mb-12 text-fas-text leading-relaxed animate-fade-in-up" data-testid="hero-description" style={{animationDelay: '1s'}}>
            Proporcionamos assessoria jurídica completa para empresas de diversos setores. Desde 1996, 
            oferecemos soluções personalizadas com excelência e tratamento diferenciado.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" data-testid="hero-buttons" style={{animationDelay: '1.2s'}}>
            <Button
              onClick={scrollToContact}
              className="btn-primary text-lg px-8 py-4"
              data-testid="button-contact"
            >
              Fale Conosco
            </Button>
            <Button
              onClick={scrollToAreas}
              className="btn-outline text-lg px-8 py-4"
              data-testid="button-areas"
            >
              Áreas de Prática
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
