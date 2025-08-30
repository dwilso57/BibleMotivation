import { Link, useLocation } from "wouter";
import { BookOpen, Heart, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: BookOpen },
    { path: "/daily", label: "Daily Verse", icon: Sun },
    { path: "/favorites", label: "Favorites", icon: Heart },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="golden-accent w-10 h-10 rounded-lg flex items-center justify-center">
              <BookOpen className="text-accent-foreground text-lg" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Divine Words</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-muted-foreground hover:text-foreground transition-colors ${
                  location === item.path ? "text-foreground font-medium" : ""
                }`}
                data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors ${
                        location === item.path ? "text-foreground font-medium" : ""
                      }`}
                      data-testid={`mobile-link-${item.label.toLowerCase().replace(" ", "-")}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
