import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, RefreshCw, Search } from "lucide-react";
import VerseCard from "@/components/verse-card";
import CategoryPills from "@/components/category-pills";
import type { Verse } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: dailyVerse, isLoading: dailyLoading } = useQuery({
    queryKey: ["/api/daily-verse"],
  });

  const { data: randomVerse, isLoading: randomLoading, refetch: refetchRandom } = useQuery({
    queryKey: ["/api/verses/random"],
    enabled: false,
  });

  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ["/api/verses/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const { data: categoryVerses = [], isLoading: categoryLoading } = useQuery({
    queryKey: ["/api/verses/category", selectedCategory],
    enabled: !!selectedCategory,
  });

  const currentVerse = randomVerse || dailyVerse;
  const displayVerses = searchQuery.length > 2 ? searchResults : selectedCategory ? categoryVerses : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="scripture-gradient py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-8" data-testid="badge-daily-verse">
            <Sun className="w-4 h-4 mr-2 text-accent" />
            {randomVerse ? "Random Verse" : "Today's Verse"}
          </Badge>
          
          {dailyLoading && !randomVerse ? (
            <Card className="p-8 sm:p-12 mb-8">
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3 mx-auto" />
                <Skeleton className="h-6 w-1/3 mx-auto mt-6" />
              </CardContent>
            </Card>
          ) : currentVerse ? (
            <Card className="verse-card shadow-xl p-8 sm:p-12 mb-8" data-testid="card-main-verse">
              <CardContent>
                <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-relaxed mb-6" data-testid="text-main-verse">
                  "{currentVerse.verseText || currentVerse.text}"
                </blockquote>
                <cite className="text-lg font-medium text-muted-foreground" data-testid="text-main-reference">
                  {currentVerse.verseReference || currentVerse.reference}
                </cite>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 sm:p-12 mb-8">
              <CardContent>
                <p className="text-muted-foreground">No verse available</p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              onClick={() => refetchRandom()}
              disabled={randomLoading}
              className="golden-accent text-accent-foreground px-6 py-3 font-medium hover:shadow-lg transition-all"
              data-testid="button-new-verse"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${randomLoading ? 'animate-spin' : ''}`} />
              New Verse
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-card py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-4">Find Inspiration</h2>
            <p className="text-muted-foreground text-lg">Search for verses by keywords or browse by category</p>
          </div>
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for hope, strength, peace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-base"
              data-testid="input-search"
            />
          </div>
          
          <CategoryPills 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </section>

      {/* Search Results / Category Results */}
      {(searchQuery.length > 2 || selectedCategory) && (
        <section className="bg-muted py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                {searchQuery.length > 2 ? "Search Results" : `${selectedCategory} Verses`}
              </h2>
              <p className="text-muted-foreground text-lg">
                {searchLoading || categoryLoading ? "Loading..." : `${displayVerses.length} verses found`}
              </p>
            </div>
            
            {searchLoading || categoryLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayVerses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-search-results">
                {displayVerses.map((verse: Verse) => (
                  <VerseCard key={verse.id} verse={verse} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No verses found. Try a different search term or category.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              &copy; 2024 Divine Words. All rights reserved. Scripture quotations are from the New International Version (NIV).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
