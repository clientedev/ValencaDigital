import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/chat", sessionId],
    queryFn: () => fetch(`/api/chat?sessionId=${sessionId}`).then(res => res.json()),
    enabled: isOpen
  });

  const sendMessage = useMutation({
    mutationFn: (data: { sessionId: string; message: string; sender: string; name?: string; email?: string; phone?: string }) =>
      apiRequest("/api/chat", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", sessionId] });
      setMessage("");
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasIntroduced && messages.length === 0) {
      // Send welcome message when chat opens for the first time
      sendMessage.mutate({
        sessionId,
        message: "olá",
        sender: "user"
      });
      setHasIntroduced(true);
    }
  }, [isOpen, messages.length, hasIntroduced, sessionId, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendMessage.mutate({
      sessionId,
      message: message.trim(),
      sender: "user"
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-fas-accent hover:bg-fas-navy shadow-lg transition-all duration-300 hover:scale-110"
          data-testid="chatbot-trigger"
        >
          <MessageCircle size={24} className="text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white border border-fas-border rounded-lg shadow-2xl transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
    }`} data-testid="chatbot-window">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-fas-navy text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-fas-accent rounded-full flex items-center justify-center">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-medium text-sm">Assistente Virtual</h3>
            <p className="text-xs text-fas-blue">Valença & Soares</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-fas-blue p-1 h-8 w-8"
          >
            <Minimize2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-fas-blue p-1 h-8 w-8"
            data-testid="chatbot-close"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50" data-testid="chat-messages">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fas-accent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg: ChatMessage) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[80%] ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user' ? 'bg-fas-accent' : 'bg-fas-navy'
                      }`}>
                        {msg.sender === 'user' ? (
                          <User size={14} className="text-white" />
                        ) : (
                          <Bot size={14} className="text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-fas-accent text-white'
                          : 'bg-white border border-gray-200 text-fas-text'
                      }`}>
                        <p className="leading-relaxed">{msg.message}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border-gray-300 focus:border-fas-accent"
                disabled={sendMessage.isPending}
                data-testid="chat-input"
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessage.isPending}
                className="bg-fas-accent hover:bg-fas-navy px-3"
                data-testid="chat-send"
              >
                {sendMessage.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}