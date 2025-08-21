import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory ? `/api/blog?category=${selectedCategory}` : "/api/blog";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const categories = [
    "Direito do Trabalho",
    "Direito Previdenciário", 
    "Direito de Família e Sucessão",
    "Direito Civil",
    "Direito Imobiliário",
    "Direito Administrativo"
  ];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="blog-page">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-light-gray" data-testid="blog-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-6" data-testid="blog-title">
              Blog Jurídico
            </h1>
            <div className="w-24 h-1 bg-accent-gold mx-auto mb-8"></div>
            <p className="text-xl text-warm-gray">Artigos e insights sobre o mundo jurídico</p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-12 bg-white" data-testid="blog-search-filters">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-warm-gray" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
              <div className="flex flex-wrap gap-2" data-testid="category-filters">
                <Button
                  onClick={() => setSelectedCategory("")}
                  variant={selectedCategory === "" ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === "" ? "btn-primary" : ""}
                  data-testid="filter-all"
                >
                  Todos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className={selectedCategory === category ? "btn-primary" : "text-xs"}
                    data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category.replace("Direito ", "").replace(" e Sucessão", "")}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-12 bg-light-gray" data-testid="blog-posts-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-loading">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12" data-testid="no-posts-found">
                <p className="text-xl text-warm-gray">
                  {searchTerm || selectedCategory
                    ? "Nenhum artigo encontrado com os filtros selecionados."
                    : "Nenhum artigo disponível no momento."}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" data-testid="blog-posts-grid">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Load More Button - for future pagination */}
            {filteredPosts.length > 0 && (
              <div className="text-center" data-testid="load-more-section">
                <Button className="btn-primary" data-testid="button-load-more">
                  Carregar Mais Artigos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
