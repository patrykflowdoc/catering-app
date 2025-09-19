import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { type MenuItem } from "@shared/schema";

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export function MenuItemCard({ item, isSelected, onSelectionChange }: MenuItemCardProps) {
  return (
    <Card 
      className={`bg-accent rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-ring' : ''
      }`}
      onClick={() => onSelectionChange(!isSelected)}
      data-testid={`card-menu-item-${item.id}`}
    >
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-32 object-cover"
        data-testid={`img-menu-item-${item.id}`}
      />
      <div className="p-4">
        <div className="flex items-center cursor-pointer">
          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
            isSelected ? 'bg-primary border-primary' : 'border-border'
          }`}>
            {isSelected && (
              <svg 
                className="w-3 h-3 text-primary-foreground" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                data-testid={`icon-check-${item.id}`}
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground" data-testid={`text-name-${item.id}`}>
              {item.name}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid={`text-description-${item.id}`}>
              {item.description}
            </p>
            <p className="text-sm font-semibold text-primary mt-1" data-testid={`text-price-${item.id}`}>
              {item.price} zł
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
