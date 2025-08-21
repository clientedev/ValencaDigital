import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { InsertBlogPost, BlogPost } from "@shared/schema";

interface BlogFormProps {
  post?: BlogPost;
  onSubmit: (data: InsertBlogPost) => Promise<void>;
  onCancel: () => void;
}

export default function BlogForm({ post, onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState<InsertBlogPost>({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    category: post?.category || "",
    imageUrl: post?.imageUrl || "",
    readTime: post?.readTime || "",
    published: post?.published ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Direito do Trabalho",
    "Direito Previdenciário",
    "Direito de Família e Sucessão",
    "Direito Civil",
    "Direito Imobiliário",
    "Direito Administrativo"
  ];

  const handleInputChange = (field: keyof InsertBlogPost, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      toast({
        title: post ? "Artigo atualizado!" : "Artigo criado!",
        description: "O artigo foi salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o artigo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg" data-testid="blog-form">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Título do artigo"
            required
            data-testid="input-blog-title"
          />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger data-testid="select-blog-category">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
            placeholder="https://..."
            data-testid="input-blog-image"
          />
        </div>
        <div>
          <Label htmlFor="readTime">Tempo de Leitura</Label>
          <Input
            id="readTime"
            value={formData.readTime}
            onChange={(e) => handleInputChange("readTime", e.target.value)}
            placeholder="5 min"
            required
            data-testid="input-blog-read-time"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Resumo</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => handleInputChange("excerpt", e.target.value)}
          placeholder="Breve descrição do artigo..."
          rows={3}
          required
          data-testid="textarea-blog-excerpt"
        />
      </div>

      <div>
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          placeholder="Conteúdo completo do artigo (HTML suportado)..."
          rows={10}
          required
          data-testid="textarea-blog-content"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => handleInputChange("published", checked)}
          data-testid="switch-blog-published"
        />
        <Label htmlFor="published">Publicar artigo</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          data-testid="button-blog-submit"
        >
          {isSubmitting ? "Salvando..." : (post ? "Atualizar" : "Criar")} Artigo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-testid="button-blog-cancel"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
