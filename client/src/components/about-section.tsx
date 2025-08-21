export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-fas-light-gray" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-fas-navy mb-6" data-testid="about-title">
            Sobre Valença e Soares
          </h2>
          <div className="w-24 h-1 bg-fas-accent mx-auto mb-8"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-testid="about-image">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Biblioteca jurídica moderna"
              className="rounded-xl shadow-lg"
            />
          </div>
          <div data-testid="about-content">
            <h3 className="text-2xl font-semibold text-fas-navy mb-6">Tradição e Inovação</h3>
            <p className="text-fas-text mb-6 leading-relaxed">
              Valença e Soares advogados associados foi instituído em 1996, por profissionais que reúnem o mesmo objetivo: oferecer excelência em serviços. O aprimoramento constante de profissionais, mantendo-os atualizados e hábeis a realizarem com eficácia os assuntos expostos, representa o lema do escritório.
            </p>
            <p className="text-fas-text mb-6 leading-relaxed">
              O tratamento diferenciado aos clientes, pessoas físicas e jurídicas, constitui a distinção marcante dos profissionais participantes desta sociedade. Nossos esforços direcionam-se no sentido de proporcionar às pessoas uma visão real dos problemas, com as melhores soluções, a curto e longo prazo.
            </p>
            <p className="text-fas-text leading-relaxed">
              De acordo com a nova tendência mundial, desenvolve-se o atendimento preventivo de advocacia, possibilitando uma posição mais competitiva dos clientes no mercado que atuam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
