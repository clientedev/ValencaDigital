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
    <section id="home" className="pt-16 gradient-navy text-white" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-testid="hero-content">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="hero-title">
              Excelência em Serviços Jurídicos
            </h1>
            <p className="text-xl mb-8 text-blue-100" data-testid="hero-description">
              Desde 1996, oferecemos soluções jurídicas personalizadas com tratamento diferenciado para pessoas físicas e jurídicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-buttons">
              <Button
                onClick={scrollToContact}
                className="btn-secondary"
                data-testid="button-contact"
              >
                Fale Conosco
              </Button>
              <Button
                onClick={scrollToAreas}
                variant="outline"
                className="btn-outline"
                data-testid="button-areas"
              >
                Conheça Nossas Áreas
              </Button>
            </div>
          </div>
          <div className="hidden md:block" data-testid="hero-image">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Escritório de advocacia moderno"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
