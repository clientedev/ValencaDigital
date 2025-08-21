import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticateAdmin } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleAdminLogin = async () => {
    const success = await authenticateAdmin(password);
    if (success) {
      toast({
        title: "Acesso autorizado!",
        description: "Redirecionando para o painel administrativo...",
      });
      window.location.href = "/admin";
    } else {
      toast({
        title: "Senha incorreta!",
        description: "Verifique a senha e tente novamente.",
        variant: "destructive",
      });
    }
    setPassword("");
    setAdminModalOpen(false);
  };

  const practiceAreas = [
    "Direito do Trabalho",
    "Direito Previdenciário", 
    "Direito de Família",
    "Direito Civil"
  ];

  const quickLinks = [
    "Sobre Nós",
    "Blog", 
    "Contato",
    "Política de Privacidade"
  ];

  return (
    <>
      <footer className="bg-fas-navy text-white py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div data-testid="footer-company-info">
              <h3 className="text-2xl font-bold mb-4">Valença & Soares</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Advogados Associados desde 1996, oferecendo excelência em serviços jurídicos.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accent-gold transition-colors"
                  data-testid="social-linkedin"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accent-gold transition-colors"
                  data-testid="social-facebook"
                >
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-accent-gold transition-colors"
                  data-testid="social-instagram"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
            
            <div data-testid="footer-practice-areas">
              <h4 className="text-lg font-semibold mb-4">Áreas de Atuação</h4>
              <ul className="space-y-2 text-gray-300">
                {practiceAreas.map((area) => (
                  <li key={area}>
                    <a
                      href="#areas"
                      className="hover:text-accent-gold transition-colors"
                      data-testid={`practice-area-${area.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {area}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div data-testid="footer-quick-links">
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-300">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-accent-gold transition-colors"
                      data-testid={`quick-link-${link.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div data-testid="footer-contact-info">
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-300">
                <p data-testid="contact-email">atendimento@valencaesoares.com.br</p>
                <p data-testid="contact-whatsapp">+55 11 99588-8564</p>
                <p data-testid="contact-support">Suporte Jurídico On-line</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm" data-testid="copyright">
              © 2024 Valença e Soares Advogados Associados. Todos os direitos reservados.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <button
                onClick={() => setAdminModalOpen(true)}
                className="text-gray-500 hover:text-accent-gold transition-colors ml-4"
                data-testid="admin-access-button"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={adminModalOpen} onOpenChange={setAdminModalOpen}>
        <DialogContent className="max-w-md" data-testid="admin-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-navy">Acesso Administrativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-warm-gray mb-2">Senha:</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
                data-testid="admin-password-input"
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleAdminLogin}
                className="flex-1 btn-primary"
                data-testid="admin-login-button"
              >
                Entrar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAdminModalOpen(false);
                  setPassword("");
                }}
                className="flex-1"
                data-testid="admin-cancel-button"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
