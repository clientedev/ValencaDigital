import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MessageCircle, Clock, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    message: ""
  });
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

  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("/api/contact", "POST", data),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage.mutate(formData);
  };

  return (
    <section id="contact" className="py-20 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-fas-navy mb-6" data-testid="contact-title">
            Entre em Contato
          </h2>
          <div className="w-24 h-1 bg-fas-accent mx-auto mb-8"></div>
          <p className="text-xl text-fas-text max-w-2xl mx-auto">
            Fale conosco para esclarecer suas dúvidas jurídicas. Nossa equipe está pronta para ajudá-lo.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-fas-light-gray p-8 rounded-sm h-full">
              <h3 className="text-2xl font-semibold text-fas-navy mb-8">Informações de Contato</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4" data-testid="contact-address">
                  <div className="w-12 h-12 bg-fas-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-fas-navy mb-2">Endereço</h4>
                    <p className="text-fas-text">
                      Rua da Consolação, 3.357<br />
                      Consolação, São Paulo - SP<br />
                      CEP: 01416-001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-phone">
                  <div className="w-12 h-12 bg-fas-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-fas-navy mb-2">Telefone</h4>
                    <p className="text-fas-text">
                      (11) 3456-7890<br />
                      (11) 98765-4321
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-email">
                  <div className="w-12 h-12 bg-fas-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-fas-navy mb-2">E-mail</h4>
                    <p className="text-fas-text">
                      contato@valencaesoares.com.br<br />
                      escritorio@valencaesoares.com.br
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-hours">
                  <div className="w-12 h-12 bg-fas-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-fas-navy mb-2">Horário de Atendimento</h4>
                    <p className="text-fas-text">
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 12h<br />
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-fas-navy mb-4">Chat Online</h4>
                <p className="text-fas-text text-sm mb-4">
                  Converse conosco através do nosso assistente virtual disponível no canto inferior direito da tela.
                </p>
                <div className="flex items-center gap-2 text-fas-accent">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">Chat disponível 24h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
              <h3 className="text-2xl font-semibold text-fas-navy mb-8">Envie sua Mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-fas-navy mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="border-gray-300 focus:border-fas-accent"
                      data-testid="input-name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-fas-navy mb-2">
                      E-mail *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="border-gray-300 focus:border-fas-accent"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-fas-navy mb-2">
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 focus:border-fas-accent"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-fas-navy mb-2">
                      Área de Interesse *
                    </label>
                    <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                      <SelectTrigger className="border-gray-300 focus:border-fas-accent" data-testid="select-area">
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        {practiceAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-fas-navy mb-2">
                    Mensagem *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    rows={5}
                    className="border-gray-300 focus:border-fas-accent resize-none"
                    placeholder="Descreva sua necessidade jurídica ou dúvida..."
                    data-testid="textarea-message"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendMessage.isPending}
                  className="w-full bg-fas-accent hover:bg-fas-navy text-white font-medium py-3 transition-colors"
                  data-testid="button-submit"
                >
                  {sendMessage.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}