import { UtensilsCrossed } from "lucide-react";

const menuItems = [
  {
    name: "Tequeños",
    description: "Venezuelan cheese sticks",
    emoji: "🧀",
  },
  {
    name: "Empanadas",
    description: "2 options: beef and cheese",
    emoji: "🥟",
  },
  {
    name: "Milkshakes",
    description: "Oreo, chocolate, strawberry, frappe, vanilla",
    emoji: "🥤",
  },
  {
    name: "Chick-fil-A Items",
    description: "Nuggets, sandwich, mac and cheese (rotating)",
    emoji: "🍗",
  },
  {
    name: "Açaí Bowls",
    description: "Customizable on request",
    emoji: "🫐",
  },
  {
    name: "Pan de Bono",
    description: "Colombian cheese bread",
    emoji: "🍞",
  },
  {
    name: "Boba Tea",
    description: "Peach, mango, passionfruit, raspberry",
    emoji: "🧋",
  },
  {
    name: "Lattes & Coffee",
    description: "Caramel, mocha, vanilla options",
    emoji: "☕",
  },
  {
    name: "Fireman Derek's Ice Cream",
    description: "Chocolate and birthday cake cups",
    emoji: "🍨",
  },
];

const FullMenu = () => {
  return (
    <section className="py-12 px-6 bg-secondary">
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
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-primary">{item.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FullMenu;
