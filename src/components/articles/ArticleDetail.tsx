import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Tag, X } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_html: string;
  image: string;
  category: string;
  tags: string[];
  created_at: string;
}

interface ArticleDetailProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, isOpen, onClose }) => {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background/95 backdrop-blur-sm border-b pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-cyber font-bold text-right mb-2">
                {article.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(article.created_at).toLocaleDateString('ar-EG')}</span>
                </div>
                <Badge variant="secondary">{article.category}</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Article Description */}
          <div className="text-lg text-muted-foreground leading-relaxed">
            {article.description}
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none
                       prose-headings:text-foreground prose-headings:font-cyber
                       prose-h2:text-xl prose-h2:border-b prose-h2:border-primary/20 prose-h2:pb-2
                       prose-h3:text-lg prose-h3:text-primary
                       prose-h4:text-base prose-h4:font-semibold
                       prose-p:text-foreground prose-p:leading-relaxed
                       prose-ul:text-foreground prose-li:text-foreground
                       prose-strong:text-primary prose-strong:font-semibold
                       prose-table:w-full prose-table:border-collapse
                       prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2
                       prose-td:border prose-td:border-border prose-td:p-2
                       prose-pre:bg-muted prose-pre:border prose-pre:border-border
                       prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <span className="text-sm font-medium text-muted-foreground">العلامات:</span>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDetail;