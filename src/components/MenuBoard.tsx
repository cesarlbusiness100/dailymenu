import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, DoorClosed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface MenuItem {
  id: string;
  name: string;
  available: boolean;
  on_daily_menu: boolean;
}

// Static menu data
const drinksMenu = [
  { name: "Mango Passionfruit Boba", description: "Made with Mango popping pearls", price: "$5" },
  { name: "Strawberry Raspberry Boba", description: "Made with Strawberry popping pearls", price: "$5" },
  { name: "Peach Green Tea Boba", description: "Made with Lychee popping pearls", price: "$5" },
  { name: "Iced Lattes", description: "All lattes made with dairy", price: "$5" },
];

const milkshakes = [
  { name: "Chocolate" },
  { name: "Vanilla" },
  { name: "Cookies & Cream" },
  { name: "Strawberry" },
  { name: "Coffee Frappe" },
];

const hotSnacks = [
  { name: "Cheese Tequeños", price: "$2" },
  { name: "Beef/Cheese Empanadas", price: "$3" },
  { name: "Pan De Bono", price: "$2" },
  { name: "Ham Croquetas", price: "$2" },
];

const featured = [
  { name: "Fried Rice", description: "From Sushi Sake", price: "$10" },
  { name: "Chick-Fil-A", description: "8pc Nuggets · Sandwich · Mac & Cheese", price: "$8" },
  { name: "Açaí Bowl", description: "Fresh fruit, honey & granola", price: "$7" },
];

const combos = [
  { name: "East Combo", description: "Fried Rice + Boba", price: "$13" },
  { name: "Cesar Special", description: "Empanada + Tequeño + Boba", price: "$8" },
];

// Decorative separator component
const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
    <div className="w-1.5 h-1.5 rotate-45 bg-current opacity-40" />
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
  </div>
);

const MenuBoard = () => {
  const [dailyItems, setDailyItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from("store_settings")
        .select("is_closed")
        .maybeSingle();

      if (settingsData) {
        setIsClosed(settingsData.is_closed);
      }

      const { data, error } = await supabase
        .from("daily_menu_items")
        .select("id, name, available, on_daily_menu")
        .eq("on_daily_menu", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching menu items:", error);
      } else {
        setDailyItems(data || []);
      }
      setIsLoading(false);
    };
    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!api) return;
    const autoScroll = setInterval(() => api.scrollNext(), 8000);
    return () => clearInterval(autoScroll);
  }, [api]);

  const inStockItems = dailyItems.filter((item) => item.available);
  const outOfStockItems = dailyItems.filter((item) => !item.available);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-cream via-cream to-secondary overflow-hidden">
      <Carousel opts={{ loop: true, align: "start" }} setApi={setApi} className="h-full w-full">
        <CarouselContent className="h-full ml-0">
          
          {/* Slide 1: Full Menu */}
          <CarouselItem className="h-screen pl-0">
            <div className="h-full w-full p-8 flex flex-col">
              {/* Header */}
              <header className="flex items-center justify-between mb-6 pb-4 border-b border-navy/10">
                <div className="flex items-center gap-6">
                  <img
                    alt="Food Lab Logo"
                    className="w-16 h-16 object-contain drop-shadow-sm"
                    src="/lovable-uploads/b5d8fa67-ae11-4be8-b032-0f4d100425a8.png"
                  />
                  <div>
                    <h1 className="font-display text-4xl font-bold text-navy tracking-tight">
                      Food Lab
                    </h1>
                    <p className="text-navy/60 text-sm font-medium tracking-widest uppercase">Menu</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-navy font-semibold">Open Daily</p>
                  <p className="text-navy/60 text-sm">During All Lunches</p>
                  <p className="text-navy/40 text-xs italic mt-1">By Students, For Students</p>
                </div>
              </header>

              {/* Main Content Grid */}
              <div className="flex-1 grid grid-cols-4 gap-6">
                
                {/* Drinks Column */}
                <div className="bg-gradient-to-b from-burgundy to-accent rounded-lg p-5 text-white shadow-lg shadow-accent/20 flex flex-col">
                  <h3 className="font-display text-2xl font-semibold text-center mb-1 tracking-wide">
                    Drinks
                  </h3>
                  <Separator className="text-white/50 mb-4" />
                  
                  <div className="space-y-3 flex-1">
                    {drinksMenu.map((item) => (
                      <div key={item.name} className="group">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-sm group-hover:text-gold transition-colors">{item.name}</span>
                          <span className="text-gold font-bold text-sm">{item.price}</span>
                        </div>
                        <p className="text-white/60 text-xs">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-display font-semibold">Milkshakes</span>
                      <span className="text-gold font-bold">$6</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/80">
                      {milkshakes.map((s, i) => (
                        <span key={s.name}>
                          {s.name}{i < milkshakes.length - 1 && <span className="text-white/40 ml-3">·</span>}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/40 text-xs mt-2 italic">Made with dairy</p>
                  </div>
                </div>

                {/* Hot Snacks Column */}
                <div className="flex flex-col">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm border border-navy/5 flex-1">
                    <h3 className="font-display text-xl font-semibold text-navy text-center mb-1">
                      Hot Snacks
                    </h3>
                    <Separator className="text-navy mb-4" />
                    
                    <div className="space-y-4">
                      {hotSnacks.map((item) => (
                        <div key={item.name} className="flex justify-between items-center group">
                          <span className="font-medium text-navy group-hover:text-accent transition-colors">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-px w-8 bg-navy/20 group-hover:bg-accent/30 transition-colors" />
                            <span className="font-bold text-accent">{item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Combos */}
                  <div className="mt-4 bg-gradient-to-br from-navy to-primary rounded-lg p-4 text-white shadow-md">
                    <h3 className="font-display text-lg font-semibold text-center text-gold mb-3">
                      Combos
                    </h3>
                    <div className="space-y-3">
                      {combos.map((combo) => (
                        <div key={combo.name} className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-sm">{combo.name}</span>
                            <p className="text-white/60 text-xs">{combo.description}</p>
                          </div>
                          <span className="font-bold text-gold">{combo.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured Column */}
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm border border-navy/5 flex flex-col">
                  <h3 className="font-display text-xl font-semibold text-navy text-center mb-1">
                    Featured
                  </h3>
                  <Separator className="text-navy mb-4" />
                  
                  <div className="space-y-5 flex-1">
                    {featured.map((item) => (
                      <div key={item.name} className="group">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-navy group-hover:text-accent transition-colors">{item.name}</span>
                          <span className="font-bold text-accent">{item.price}</span>
                        </div>
                        <p className="text-navy/50 text-xs mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Specials Column */}
                <div className="bg-gradient-to-b from-navy via-navy to-primary rounded-lg p-5 text-white shadow-lg shadow-navy/30 flex flex-col">
                  <h3 className="font-display text-2xl font-semibold text-center text-gold mb-1">
                    Today's Specials
                  </h3>
                  <Separator className="text-gold/50 mb-4" />

                  {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    </div>
                  ) : isClosed ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                      <DoorClosed className="w-12 h-12 text-white/40" />
                      <p className="font-display font-semibold text-xl">We're Closed</p>
                      <p className="text-white/50 text-sm">See you next time!</p>
                    </div>
                  ) : dailyItems.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-white/50 text-sm text-center">No specials today<br />Check our regular menu</p>
                    </div>
                  ) : (
                    <div className="space-y-2 flex-1">
                      {inStockItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-md px-4 py-2.5 border border-white/5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                      ))}
                      {outOfStockItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-md px-4 py-2 opacity-50">
                          <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                          <span className="text-xs line-through">{item.name}</span>
                          <span className="text-xs text-white/40 ml-auto">Sold out</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-white/30 text-xs mt-4 text-center">Updated daily</p>
                </div>
              </div>

              {/* Footer accent */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 text-navy/30">
                  <div className="w-8 h-px bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-8 h-px bg-current" />
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Today's Specials Full Screen */}
          <CarouselItem className="h-screen pl-0">
            <div className="h-full w-full bg-gradient-to-br from-navy via-navy to-primary p-10 flex flex-col items-center justify-center">
              {/* Header */}
              <div className="flex items-center gap-8 mb-10">
                <img
                  alt="Food Lab Logo"
                  className="w-20 h-20 object-contain drop-shadow-lg"
                  src="/lovable-uploads/b5d8fa67-ae11-4be8-b032-0f4d100425a8.png"
                />
                <div className="text-center">
                  <h1 className="font-display text-5xl font-bold text-gold tracking-tight">
                    Today's Specials
                  </h1>
                  <Separator className="text-gold/40 mt-3" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full max-w-5xl flex items-center justify-center">
                {isLoading ? (
                  <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
                ) : isClosed ? (
                  <div className="text-center space-y-6">
                    <DoorClosed className="w-20 h-20 mx-auto text-white/30" />
                    <p className="font-display font-bold text-4xl text-white">We're Closed</p>
                    <p className="text-white/50 text-xl">See you next time!</p>
                  </div>
                ) : dailyItems.length === 0 ? (
                  <p className="text-white/50 text-xl">No specials today — check our regular menu!</p>
                ) : (
                  <div className="grid grid-cols-2 gap-10 w-full">
                    {/* Available Items */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <h2 className="font-display text-2xl font-semibold text-emerald-400">
                          Available Now
                        </h2>
                        <div className="flex-1 h-px bg-emerald-400/20" />
                      </div>
                      <div className="space-y-3">
                        {inStockItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/5 shadow-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span className="font-semibold text-xl text-white">{item.name}</span>
                          </div>
                        ))}
                        {inStockItems.length === 0 && (
                          <p className="text-white/40 italic">All items sold out</p>
                        )}
                      </div>
                    </div>

                    {/* Sold Out Items */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <XCircle className="w-6 h-6 text-red-400" />
                        <h2 className="font-display text-2xl font-semibold text-red-400">
                          Sold Out
                        </h2>
                        <div className="flex-1 h-px bg-red-400/20" />
                      </div>
                      <div className="space-y-3">
                        {outOfStockItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-lg px-6 py-4 opacity-60">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <span className="font-medium text-lg text-white/70 line-through">{item.name}</span>
                          </div>
                        ))}
                        {outOfStockItems.length === 0 && (
                          <p className="text-white/40 italic">Nothing sold out yet!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-white/20 text-sm mt-8">Updated daily by staff</p>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default MenuBoard;
