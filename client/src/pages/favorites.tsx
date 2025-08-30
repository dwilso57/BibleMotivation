import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Bookmark } from "@shared/schema";

export default function Favorites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ["/api/bookmarks"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/bookmarks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmark removed",
        description: "Verse removed from your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleShare = (bookmark: Bookmark) => {
    if (navigator.share) {
      navigator.share({
        title: "Bible Verse",
        text: `"${bookmark.verseText}" - ${bookmark.verseReference}`,
      });
    } else {
      navigator.clipboard.writeText(`"${bookmark.verseText}" - ${bookmark.verseReference}`);
      toast({
        title: "Copied to clipboard",
        description: "Verse text copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="scripture-gradient py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="golden-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-accent-foreground text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Favorite Verses</h1>
          <p className="text-muted-foreground text-lg">
            Verses you've saved for inspiration and encouragement
          </p>
        </div>
      </section>

      {/* Bookmarks */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="space-y-6" data-testid="list-bookmarks">
              {bookmarks.map((bookmark: Bookmark) => (
                <Card key={bookmark.id} className="verse-card" data-testid={`card-bookmark-${bookmark.id}`}>
                  <CardContent className="p-6">
                    <blockquote className="font-serif text-xl text-foreground leading-relaxed mb-4" data-testid="text-bookmark-verse">
                      "{bookmark.verseText}"
                    </blockquote>
                    
                    <cite className="text-sm text-muted-foreground font-medium mb-4 block" data-testid="text-bookmark-reference">
                      {bookmark.verseReference}
                    </cite>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span data-testid="text-bookmark-date">
                        Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(bookmark)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        data-testid="button-share-bookmark"
                      >
                        Share
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(bookmark.id)}
                        disabled={deleteMutation.isPending}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-testid="button-delete-bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">No Favorite Verses Yet</h3>
              <p className="text-muted-foreground text-lg mb-8">
                Start building your collection by bookmarking verses that inspire you.
              </p>
              <Button asChild className="golden-accent text-accent-foreground" data-testid="button-browse-verses">
                <a href="/">Browse Verses</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
