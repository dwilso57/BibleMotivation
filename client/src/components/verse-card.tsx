import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Share, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Verse } from "@shared/schema";

interface VerseCardProps {
  verse: {
    id: string;
    text: string;
    reference: string;
    categories: string[];
  };
  className?: string;
  showCategory?: boolean;
  isBookmarked?: boolean;
  onBookmarkChange?: () => void;
}

export default function VerseCard({ 
  verse, 
  className = "", 
  showCategory = true,
  isBookmarked = false,
  onBookmarkChange
}: VerseCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (localBookmarked) {
        // Would need bookmark ID to delete, simplified for now
        throw new Error("Delete bookmark not implemented");
      } else {
        return await apiRequest("POST", "/api/bookmarks", {
          verseId: verse.id,
          verseText: verse.text,
          verseReference: verse.reference,
        });
      }
    },
    onSuccess: () => {
      setLocalBookmarked(!localBookmarked);
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      onBookmarkChange?.();
      toast({
        title: localBookmarked ? "Bookmark removed" : "Verse bookmarked",
        description: localBookmarked 
          ? "Verse removed from your favorites"
          : "Verse saved to your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Bible Verse",
        text: `"${verse.text}" - ${verse.reference}`,
      });
    } else {
      navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference}`);
      toast({
        title: "Copied to clipboard",
        description: "Verse text copied to clipboard",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      hope: "bg-accent/10 text-accent-foreground",
      strength: "bg-destructive/10 text-destructive",
      peace: "bg-primary/10 text-primary",
      love: "bg-pink-100 text-pink-700",
      faith: "bg-purple-100 text-purple-700",
      courage: "bg-orange-100 text-orange-700",
      wisdom: "bg-green-100 text-green-700",
      forgiveness: "bg-blue-100 text-blue-700",
    };
    return colorMap[category] || "bg-secondary text-secondary-foreground";
  };

  return (
    <Card className={`verse-card ${className}`} data-testid={`card-verse-${verse.id}`}>
      <CardContent className="p-6">
        {showCategory && verse.categories.length > 0 && (
          <div className="mb-4">
            <Badge className={getCategoryColor(verse.categories[0])} data-testid={`badge-category-${verse.categories[0]}`}>
              <Heart className="w-3 h-3 mr-1" />
              {verse.categories[0]}
            </Badge>
          </div>
        )}
        
        <blockquote className="font-serif text-lg text-foreground leading-relaxed mb-4" data-testid="text-verse">
          "{verse.text}"
        </blockquote>
        
        <cite className="text-sm text-muted-foreground font-medium" data-testid="text-reference">
          {verse.reference}
        </cite>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => bookmarkMutation.mutate()}
            disabled={bookmarkMutation.isPending}
            className="text-muted-foreground hover:text-accent transition-colors"
            data-testid="button-bookmark"
          >
            <Bookmark className={`w-4 h-4 ${localBookmarked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-muted-foreground hover:text-primary transition-colors"
            data-testid="button-share"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
