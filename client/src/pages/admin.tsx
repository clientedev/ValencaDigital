import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import BlogForm from "@/components/blog/blog-form";
import { isAdminAuthenticated, logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, LogOut, ArrowLeft } from "lucide-react";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const authenticated = isAdminAuthenticated();
    if (!authenticated) {
      window.location.href = "/";
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest("POST", "/api/blog", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setShowForm(false);
      setEditingPost(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBlogPost> }) => {
      const response = await apiRequest("PUT", `/api/blog/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setShowForm(false);
      setEditingPost(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({
        title: "Artigo excluído!",
        description: "O artigo foi removido com sucesso.",
      });
    },
  });

  const handleSubmit = async (data: InsertBlogPost) => {
    if (editingPost) {
      await updateMutation.mutateAsync({ id: editingPost.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este artigo?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-gray" data-testid="admin-page">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-home">
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-navy">Painel Administrativo</h1>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" data-testid="button-logout">
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-navy" data-testid="admin-section-title">
            Gerenciar Artigos do Blog
          </h2>
          <Button
            onClick={() => {
              setEditingPost(undefined);
              setShowForm(true);
            }}
            className="btn-primary"
            data-testid="button-new-article"
          >
            <Plus size={16} className="mr-2" />
            Novo Artigo
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="admin-loading">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card data-testid="no-articles">
            <CardContent className="text-center py-12">
              <p className="text-warm-gray text-lg">Nenhum artigo criado ainda.</p>
              <Button
                onClick={() => setShowForm(true)}
                className="btn-primary mt-4"
                data-testid="button-create-first-article"
              >
                Criar Primeiro Artigo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="admin-articles-grid">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow" data-testid={`admin-article-${post.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2" data-testid={`admin-article-title-${post.id}`}>
                        {post.title}
                      </CardTitle>
                      <p className="text-sm text-warm-gray mt-1" data-testid={`admin-article-category-${post.id}`}>
                        {post.category}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {post.published ? "Publicado" : "Rascunho"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-warm-gray mb-4 line-clamp-3" data-testid={`admin-article-excerpt-${post.id}`}>
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-warm-gray mb-4">
                    <span data-testid={`admin-article-date-${post.id}`}>
                      {formatDate(post.createdAt)}
                    </span>
                    <span data-testid={`admin-article-likes-${post.id}`}>
                      ❤️ {post.likes} curtidas
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      data-testid={`button-edit-${post.id}`}
                    >
                      <Edit size={14} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${post.id}`}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="blog-form-dialog">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editingPost ? "Editar Artigo" : "Novo Artigo"}
            </DialogTitle>
          </DialogHeader>
          <BlogForm
            post={editingPost}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPost(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
