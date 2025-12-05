import { Flame } from "lucide-react";

const popularItems = [
  { name: "Tequeños", emoji: "🧀" },
  { name: "Empanadas", emoji: "🥟" },
  { name: "Milkshakes", emoji: "🥤" },
];

const PopularItems = () => {
  return (
    <section className="py-12 px-6 bg-cream">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-accent" />
          <h2 className="text-xl md:text-2xl font-semibold text-primary">Most Popular</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          These items are our highest-demand products and sell out quickly.
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          {popularItems.map((item) => (
            <div
              key={item.name}
              className="bg-card rounded-lg p-4 text-center shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-2 block">{item.emoji}</span>
              <span className="font-medium text-primary text-sm md:text-base">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularItems;
