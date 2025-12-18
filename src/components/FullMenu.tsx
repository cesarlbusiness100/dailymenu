import { UtensilsCrossed } from "lucide-react";

const menuItems = [
  {
    name: "Tequeños",
    description: "Traditional Venezuelan cheese sticks, golden-fried to perfection",
  },
  {
    name: "Empanadas",
    description: "Savory stuffed pastries — choice of seasoned beef or melted cheese",
  },
  {
    name: "Milkshakes",
    description: "Creamy blended shakes — Oreo, chocolate, strawberry, frappe, or vanilla",
  },
  {
    name: "Chick-fil-A Items",
    description: "Rotating selection — nuggets, chicken sandwich, or mac and cheese",
  },
  {
    name: "Açaí Bowls",
    description: "Fresh açaí blend with customizable toppings upon request",
  },
  {
    name: "Pan de Bono",
    description: "Authentic Colombian cheese bread, warm and freshly baked",
  },
  {
    name: "Boba Tea",
    description: "Refreshing fruit tea with tapioca — peach, mango, passionfruit, or raspberry",
  },
  {
    name: "Lattes & Coffee",
    description: "Espresso-based beverages — caramel, mocha, or vanilla flavors",
  },
  {
    name: "Fireman Derek's Cake Cups",
    description: "Premium cake cups — chocolate or birthday cake flavors",
  },
];

const FullMenu = () => {
  return (
    <section id="full-menu" className="py-12 px-6 bg-secondary">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <UtensilsCrossed className="w-5 h-5 text-accent" />
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Complete Menu</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="bg-card rounded-lg p-5 shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <h3 className="font-semibold text-primary">{item.name}</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FullMenu;
