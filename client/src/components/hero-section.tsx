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
    <section id="home" className="pt-20 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden min-h-screen flex items-center" data-testid="hero-section">
      {/* Subtle animated background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center opacity-3 select-none">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-light text-fas-navy leading-none whitespace-nowrap tracking-wider" style={{animation: 'subtle-pulse 6s ease-in-out infinite'}}>
            VALENÇA & SOARES
          </h1>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean hero banner */}
        <div className="text-center mb-20">
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 mb-16">
            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h2 className="text-3xl md:text-4xl font-light text-fas-navy mb-3 tracking-wide">Pessoas</h2>
              <div className="w-20 h-0.5 bg-fas-accent mx-auto animate-expand"></div>
            </div>
            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <h2 className="text-3xl md:text-4xl font-light text-fas-navy mb-3 tracking-wide">Excelência</h2>
              <div className="w-20 h-0.5 bg-fas-accent mx-auto animate-expand" style={{animationDelay: '0.3s'}}></div>
            </div>
            <div className="text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <h2 className="text-3xl md:text-4xl font-light text-fas-navy mb-3 tracking-wide">Resultados</h2>
              <div className="w-20 h-0.5 bg-fas-accent mx-auto animate-expand" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight mb-12 text-fas-navy leading-tight tracking-wide animate-fade-in-up" data-testid="hero-title" style={{animationDelay: '1.1s'}}>
            Conhecimento local
            <br />
            <span className="text-fas-accent font-light">com visão global</span>
          </h1>
          <p className="text-xl md:text-2xl mb-16 text-fas-text leading-relaxed font-light max-w-4xl mx-auto animate-fade-in-up" data-testid="hero-description" style={{animationDelay: '1.4s'}}>
            Desde 1996, oferecemos assessoria jurídica completa para empresas de diversos setores com soluções personalizadas e tratamento diferenciado.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" data-testid="hero-buttons" style={{animationDelay: '1.7s'}}>
            <Button
              onClick={scrollToContact}
              className="btn-primary text-lg px-10 py-4 font-normal"
              data-testid="button-contact"
            >
              Fale Conosco
            </Button>
            <Button
              onClick={scrollToAreas}
              className="btn-outline text-lg px-10 py-4 font-normal"
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
