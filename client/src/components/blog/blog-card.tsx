import { useState, useEffect } from "react";
import { Heart, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/auth";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
  onLikeUpdate?: (postId: string, liked: boolean, likeCount: number) => void;
}

export default function BlogCard({ post, onLikeUpdate }: BlogCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkLikeStatus();
  }, [post.id]);

  const checkLikeStatus = async () => {
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/blog/${post.id}/like-status?sessionId=${sessionId}`);
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const sessionId = getSessionId();
    
    try {
      const response = await fetch(`/api/blog/${post.id}/like`, {
        method: liked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount(data.likeCount);
        onLikeUpdate?.(post.id, newLiked, data.likeCount);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível curtir o artigo.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const shareLinks = [
    {
      name: "LinkedIn",
      icon: "fab fa-linkedin",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + "/blog")}&title=${encodeURIComponent(post.title)}`,
      color: "text-blue-700",
    },
    {
      name: "Facebook", 
      icon: "fab fa-facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + "/blog")}`,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: "fab fa-twitter", 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.origin + "/blog")}&text=${encodeURIComponent(post.title)}`,
      color: "text-blue-400",
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden card-hover"
      data-testid={`blog-card-${post.id}`}
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
          data-testid={`blog-image-${post.id}`}
        />
      )}
      <div className="p-6">
        <div className="text-sm text-professional-blue font-semibold mb-2" data-testid={`blog-category-${post.id}`}>
          {post.category.toUpperCase()}
        </div>
        <h3 className="text-xl font-semibold text-navy mb-3" data-testid={`blog-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-warm-gray mb-4 leading-relaxed" data-testid={`blog-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-sm text-warm-gray mb-4">
          <span data-testid={`blog-date-${post.id}`}>
            {formatDate(post.createdAt)}
          </span>
          <span data-testid={`blog-read-time-${post.id}`}>
            {post.readTime} de leitura
          </span>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`p-2 ${liked ? "text-red-500" : "text-warm-gray hover:text-red-500"}`}
              data-testid={`button-like-${post.id}`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              <span className="ml-2">{likeCount}</span>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-warm-gray hover:text-professional-blue"
                  data-testid={`button-share-${post.id}`}
                >
                  <Share2 size={18} />
                  <span className="ml-2">Compartilhar</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-2">
                  {shareLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleShare(link.url)}
                      className={`flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded text-sm ${link.color}`}
                      data-testid={`share-${link.name.toLowerCase()}-${post.id}`}
                    >
                      <i className={link.icon}></i>
                      {link.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button
            variant="link"
            className="p-0 text-professional-blue font-semibold"
            data-testid={`button-read-more-${post.id}`}
          >
            Ler mais
            <ExternalLink size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </article>
  );
}
