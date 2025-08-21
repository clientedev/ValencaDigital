import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import Chatbot from "@/components/chatbot";
import PracticeAreaCard from "@/components/practice-areas/practice-area-card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  // Buscar artigos recentes
  const { data: recentPosts, isLoading } = useQuery({
    queryKey: ["/api/blog"],
    enabled: true
  });

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

      {/* Recent Articles Section */}
      <section className="py-20 bg-fas-light-gray" data-testid="recent-articles-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-fas-navy mb-6" data-testid="recent-articles-title">
              Insights Jurídicos
            </h2>
            <div className="w-24 h-1 bg-fas-accent mx-auto mb-8"></div>
            <p className="text-xl text-fas-text">Acompanhe as últimas novidades e tendências jurídicas</p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-sm shadow-sm p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="recent-articles-grid">
              {Array.isArray(recentPosts) ? recentPosts.slice(0, 3).map((post: any) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden card-hover"
                  data-testid={`article-card-${post.id}`}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-fas-gray mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <span className="inline-block px-3 py-1 text-xs font-medium text-fas-accent bg-fas-accent/10 rounded-full mb-4">
                      {post.category}
                    </span>
                    
                    <h3 className="text-xl font-semibold text-fas-navy mb-4 leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-fas-text mb-6 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <Link 
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-fas-accent hover:text-fas-navy transition-colors font-medium"
                      data-testid={`article-link-${post.id}`}
                    >
                      Ler mais
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              )) : null}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/blog" 
              className="btn-outline text-lg px-8 py-4"
              data-testid="view-all-articles"
            >
              Ver todos os artigos
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
      <Chatbot />
    </div>
  );
}
