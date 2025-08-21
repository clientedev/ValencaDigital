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
    <section id="home" className="pt-20 bg-white wave-bg" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* FAS-inspired hero banner */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-fas-navy mb-2">Pessoas</h2>
              <div className="w-16 h-1 bg-fas-accent mx-auto"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-fas-navy mb-2">Excelência</h2>
              <div className="w-16 h-1 bg-fas-accent mx-auto"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-fas-navy mb-2">Resultados</h2>
              <div className="w-16 h-1 bg-fas-accent mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div data-testid="hero-content">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-fas-navy leading-tight" data-testid="hero-title">
              Valença e Soares combina conhecimento sobre o mercado local com uma visão global
            </h1>
            <p className="text-lg mb-8 text-fas-text leading-relaxed" data-testid="hero-description">
              Proporcionamos assessoria jurídica completa para empresas de diversos setores. Desde 1996, 
              oferecemos soluções personalizadas com excelência e tratamento diferenciado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-buttons">
              <Button
                onClick={scrollToContact}
                className="btn-primary"
                data-testid="button-contact"
              >
                Fale Conosco
              </Button>
              <Button
                onClick={scrollToAreas}
                className="btn-outline"
                data-testid="button-areas"
              >
                Áreas de Prática
              </Button>
            </div>
          </div>
          <div className="hidden md:block" data-testid="hero-image">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Escritório de advocacia moderno"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
