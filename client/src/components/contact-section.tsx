import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const practiceAreas = [
    "Direito do Trabalho",
    "Direito Previdenciário",
    "Direito de Família e Sucessão",
    "Direito Civil",
    "Direito Imobiliário",
    "Direito Administrativo"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Mensagem enviada com sucesso!",
          description: "Entraremos em contato em breve.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          area: "",
          message: ""
        });
      } else {
        throw new Error(result.error || "Erro ao enviar mensagem");
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 gradient-fas text-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="contact-title">
            Fale Conosco
          </h2>
          <div className="w-24 h-1 bg-fas-accent mx-auto mb-8"></div>
          <p className="text-xl text-blue-100">Entre em contato para uma consulta personalizada</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div data-testid="contact-info">
            <h3 className="text-2xl font-semibold mb-6">Informações de Contato</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4" data-testid="contact-email-info">
                <Mail className="text-accent-gold text-xl" size={24} />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-blue-100">atendimento@valencaesoares.com.br</div>
                </div>
              </div>
              <div className="flex items-center gap-4" data-testid="contact-whatsapp-info">
                <MessageCircle className="text-accent-gold text-xl" size={24} />
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-blue-100">+55 11 99588-8564</div>
                </div>
              </div>
              <div className="flex items-start gap-4" data-testid="contact-hours-info">
                <Clock className="text-accent-gold text-xl mt-1" size={24} />
                <div>
                  <div className="font-semibold">Horário de Atendimento</div>
                  <div className="text-blue-100">Segunda a Sexta: 9h às 18h</div>
                  <div className="text-blue-100">Suporte Jurídico On-line</div>
                </div>
              </div>
            </div>
          </div>
          
          <div data-testid="contact-form">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="bg-fas-navy-light border-gray-500 text-white placeholder-gray-300"
                  data-testid="input-name"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-fas-navy-light border-gray-500 text-white placeholder-gray-300"
                  data-testid="input-email"
                />
              </div>
              <Input
                type="tel"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-fas-navy-light border-gray-500 text-white placeholder-gray-300"
                data-testid="input-phone"
              />
              <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                <SelectTrigger
                  className="bg-fas-navy-light border-gray-500 text-white"
                  data-testid="select-area"
                >
                  <SelectValue placeholder="Selecione a área de interesse" />
                </SelectTrigger>
                <SelectContent>
                  {practiceAreas.map((area) => (
                    <SelectItem key={area} value={area} data-testid={`select-option-${area.toLowerCase().replace(/\s+/g, '-')}`}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Descreva sua situação..."
                rows={4}
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                required
                className="bg-fas-navy-light border-gray-500 text-white placeholder-gray-300"
                data-testid="textarea-message"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-secondary"
                data-testid="button-submit-contact"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
