import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  created_at: string;
}

interface ArticleCardProps {
  article: Article;
  onReadMore: (slug: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onReadMore }) => {
  return (
    <Card className="group border-primary/20 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300 overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {article.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{new Date(article.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            onClick={() => onReadMore(article.slug)}
          >
            اقرأ المقال
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;