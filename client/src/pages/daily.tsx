import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Bell, Shield } from "lucide-react";
import VerseCard from "@/components/verse-card";

export default function Daily() {
  const { data: dailyVerse, isLoading } = useQuery({
    queryKey: ["/api/daily-verse"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="scripture-gradient py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="golden-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sun className="text-accent-foreground text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Daily Verse</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Start each day with God's word. Receive inspiration and guidance through carefully selected verses.
          </p>
        </div>
      </section>

      {/* Today's Verse */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>

          {isLoading ? (
            <Card className="p-8">
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-2/3 mx-auto" />
                <Skeleton className="h-6 w-1/3 mx-auto mt-6" />
              </CardContent>
            </Card>
          ) : dailyVerse ? (
            <Card className="verse-card shadow-xl" data-testid="card-daily-verse">
              <CardContent className="p-8 sm:p-12">
                <blockquote className="font-serif text-2xl sm:text-3xl text-foreground leading-relaxed mb-6 text-center" data-testid="text-daily-verse">
                  "{dailyVerse.verseText}"
                </blockquote>
                <cite className="block text-lg font-medium text-muted-foreground text-center" data-testid="text-daily-reference">
                  {dailyVerse.verseReference}
                </cite>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8">
              <CardContent>
                <p className="text-center text-muted-foreground">No daily verse available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Daily Inspiration Section */}
      <section className="bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="golden-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="text-accent-foreground text-2xl" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-4">Never Miss Your Daily Inspiration</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Set up daily notifications to receive a carefully selected verse each morning to guide and inspire your day.
          </p>
          
          <Card className="bg-secondary/30 border-0 p-8 mb-8">
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Sun className="w-4 h-4 mr-2" />
                  Delivered every morning at 7:00 AM
                </div>
              </div>
              <Button 
                size="lg"
                className="golden-accent text-accent-foreground font-semibold hover:shadow-xl transition-all"
                data-testid="button-enable-notifications"
              >
                <Bell className="w-4 h-4 mr-2" />
                Enable Daily Verses
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-2" />
            We respect your privacy. Unsubscribe anytime.
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">Why Daily Verses?</h2>
            <p className="text-muted-foreground text-lg">Experience the transformative power of daily scripture</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Start Strong</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Begin each day with purpose and spiritual grounding through God's word.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Stay Consistent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Build a daily habit of reflection and spiritual growth with gentle reminders.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">Find Peace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Discover comfort and guidance in scripture during life's challenges.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
