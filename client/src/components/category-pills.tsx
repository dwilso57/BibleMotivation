import { Button } from "@/components/ui/button";
import { VERSE_CATEGORIES } from "@shared/schema";

interface CategoryPillsProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export default function CategoryPills({ selectedCategory, onCategorySelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant={selectedCategory === null ? "default" : "secondary"}
        size="sm"
        onClick={() => onCategorySelect(null)}
        className="category-pill rounded-full"
        data-testid="button-category-all"
      >
        All
      </Button>
      
      {VERSE_CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategorySelect(category)}
          className="category-pill rounded-full capitalize"
          data-testid={`button-category-${category}`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
