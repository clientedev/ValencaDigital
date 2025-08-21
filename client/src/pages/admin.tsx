import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MessageSquare, User, Phone, Clock, Settings, Eye } from "lucide-react";
import { useLocation } from "wouter";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  area: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  sender: "user" | "bot";
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedContactMessage, setSelectedContactMessage] = useState<ContactMessage | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem("admin-auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticateMutation = useMutation({
    mutationFn: (password: string) => apiRequest("/api/admin/auth", "POST", { password }),
    onSuccess: () => {
      setIsAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo ao painel administrativo.",
      });
    },
    onError: () => {
      toast({
        title: "Senha incorreta",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const updateContactStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/api/contact/${id}/status`, "PATCH", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Status atualizado",
        description: "O status da mensagem foi atualizado com sucesso.",
      });
    }
  });

  const { data: contactMessages = [], isLoading: contactLoading } = useQuery({
    queryKey: ["/api/contact"],
    queryFn: () => fetch("/api/contact").then(res => res.json()),
    enabled: isAuthenticated
  });

  const { data: chatMessages = [], isLoading: chatLoading } = useQuery({
    queryKey: ["/api/chat"],
    queryFn: () => fetch("/api/chat").then(res => res.json()),
    enabled: isAuthenticated
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateMutation.mutate(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "Nova", variant: "destructive" as const },
      read: { label: "Lida", variant: "secondary" as const },
      replied: { label: "Respondida", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Group chat messages by session
  const chatSessions = chatMessages.reduce((acc: Record<string, ChatMessage[]>, msg: ChatMessage) => {
    if (!acc[msg.sessionId]) {
      acc[msg.sessionId] = [];
    }
    acc[msg.sessionId].push(msg);
    return acc;
  }, {});

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-fas-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-fas-navy">Painel Administrativo</CardTitle>
            <CardDescription>
              Digite a senha para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
                data-testid="admin-password-input"
              />
              <Button
                type="submit"
                className="w-full bg-fas-accent hover:bg-fas-navy"
                disabled={authenticateMutation.isPending}
                data-testid="admin-login-button"
              >
                {authenticateMutation.isPending ? "Verificando..." : "Acessar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-fas-navy">Painel Administrativo</h1>
            <p className="text-fas-text">Valença & Soares Advogados</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-fas-accent text-fas-accent hover:bg-fas-accent hover:text-white"
          >
            Sair
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Mensagens de Contato ({contactMessages.length})
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversas do Chat ({Object.keys(chatSessions).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            {contactLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fas-accent"></div>
              </div>
            ) : (
              <div className="grid gap-6">
                {contactMessages.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma mensagem de contato ainda.</p>
                    </CardContent>
                  </Card>
                ) : (
                  contactMessages.map((message: ContactMessage) => (
                    <Card key={message.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {message.name}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {message.email}
                              </span>
                              {message.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {message.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(message.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Área de Interesse:</p>
                            <Badge variant="outline">{message.area}</Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Mensagem:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                              {message.message}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateContactStatusMutation.mutate({ id: message.id, status: "read" })}
                              disabled={message.status === "read" || updateContactStatusMutation.isPending}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Marcar como Lida
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateContactStatusMutation.mutate({ id: message.id, status: "replied" })}
                              disabled={message.status === "replied" || updateContactStatusMutation.isPending}
                              className="bg-fas-accent hover:bg-fas-navy"
                            >
                              Marcar como Respondida
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat">
            {chatLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fas-accent"></div>
              </div>
            ) : (
              <div className="grid gap-6">
                {Object.keys(chatSessions).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma conversa de chat ainda.</p>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(chatSessions).map(([sessionId, messages]: [string, ChatMessage[]]) => (
                    <Card key={sessionId}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Sessão: {sessionId.split('-').slice(-2).join('-')}
                        </CardTitle>
                        <CardDescription>
                          {messages.length} mensagens • Último: {formatDate(messages[messages.length - 1]?.createdAt)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {messages
                            .sort((a: ChatMessage, b: ChatMessage) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                            .map((msg: ChatMessage) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[70%] rounded-lg p-3 text-sm ${
                                  msg.sender === 'user'
                                    ? 'bg-fas-accent text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  <p>{msg.message}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}