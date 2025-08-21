import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Início" },
    { href: "/#about", label: "Sobre" },
    { href: "/#areas", label: "Áreas de Atuação" },
    { href: "/blog", label: "Blog" },
    { href: "/#contact", label: "Contato" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-fas-border fixed w-full top-0 z-50" data-testid="header-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center" data-testid="header-logo">
            <Link href="/" className="flex flex-col">
              <h1 className="text-2xl font-bold text-fas-navy tracking-tight">Valença & Soares</h1>
              <span className="text-xs text-fas-gray uppercase tracking-wider">Advogados Associados</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12" data-testid="desktop-navigation">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.href.startsWith("/#") ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="text-fas-text hover:text-fas-accent transition-colors font-medium text-sm uppercase tracking-wider"
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors font-medium text-sm uppercase tracking-wider ${
                      location === item.href
                        ? "text-fas-accent"
                        : "text-fas-text hover:text-fas-accent"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-fas-navy"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-fas-border" data-testid="mobile-navigation">
            {navigationItems.map((item) => (
              <div key={item.href} className="py-3">
                {item.href.startsWith("/#") ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left text-fas-text hover:text-fas-accent transition-colors font-medium"
                    data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`block transition-colors font-medium ${
                      location === item.href
                        ? "text-fas-accent"
                        : "text-fas-text hover:text-fas-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
