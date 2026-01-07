import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, DoorClosed, Sparkles } from "lucide-react";
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

// Static menu data matching the screenshot
const drinksMenu = [
  { name: "Mango Passionfruit Boba", description: "Made with Mango popping pearls", price: "$5" },
  { name: "Strawberry Raspberry Boba", description: "Made with Strawberry popping pearls", price: "$5" },
  { name: "Peach Green Tea Boba", description: "Made with Lychee popping pearls", price: "$5" },
  { name: "Iced Lattes", description: "Note: All of our lattes are made with dairy!", price: "$5" },
];

const milkshakes = [
  { name: "Chocolate" },
  { name: "Vanilla" },
  { name: "Cookies and Cream" },
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
  { name: "Chick-Fil-A", description: "8 Piece Chicken Nuggets\nChicken Sandwich\nMedium Size mac and cheese", price: "$8" },
  { name: "Acai", description: "Comes with fresh fruit, honey, and granola", price: "$7" },
];

const combos = [
  { name: "East Combos", description: "Sushi Sake Fried Rice, Boba", price: "$13" },
  { name: "Cesar Special", description: "One Empanadas, one Tequeno, and one Boba", price: "$8" },
];

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

    // Auto-refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll carousel every 8 seconds
  useEffect(() => {
    if (!api) return;

    const autoScroll = setInterval(() => {
      api.scrollNext();
    }, 8000);

    return () => clearInterval(autoScroll);
  }, [api]);

  const inStockItems = dailyItems.filter((item) => item.available);
  const outOfStockItems = dailyItems.filter((item) => !item.available);

  return (
    <div className="h-screen w-screen bg-cream overflow-hidden">
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        setApi={setApi}
        className="h-full w-full"
      >
        <CarouselContent className="h-full ml-0">
          {/* Slide 1: Full Menu */}
          <CarouselItem className="h-screen pl-0">
            <div className="h-full w-full bg-cream p-6 flex flex-col">
              {/* Header */}
              <header className="flex items-center justify-between mb-4">
                <h1 className="text-5xl font-black text-navy uppercase tracking-tight leading-none">
                  Food Lab Menu
                </h1>
                <div className="text-right flex-1 px-8">
                  <h2 className="text-2xl font-bold text-navy uppercase">We Open Everyday</h2>
                  <p className="text-navy/80 font-medium">During All Lunches</p>
                  <p className="text-navy/70 italic text-sm">A Business BY Students, For Students</p>
                </div>
                <img
                  alt="Food Lab Logo"
                  className="w-20 h-20 object-contain"
                  src="/lovable-uploads/b5d8fa67-ae11-4be8-b032-0f4d100425a8.png"
                />
              </header>

              {/* Main Content - Horizontal Layout */}
              <div className="flex-1 grid grid-cols-4 gap-4">
                {/* Drinks */}
                <div className="bg-red rounded-xl p-4 text-white flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" />
                    <div className="border-2 border-white rounded-full px-4 py-1">
                      <h3 className="text-lg font-bold uppercase tracking-wider">Drinks</h3>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {drinksMenu.map((item) => (
                      <div key={item.name} className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-white/80 text-xs">{item.description}</p>
                        </div>
                        <span className="font-bold text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {/* Milkshakes */}
                  <div className="mt-3 pt-3 border-t border-white/30">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm">Milkshakes:</p>
                      <span className="font-bold text-sm">$6</span>
                    </div>
                    <div className="grid grid-cols-2 gap-0.5 text-xs">
                      {milkshakes.map((shake) => (
                        <span key={shake.name} className="text-white/90">{shake.name}</span>
                      ))}
                    </div>
                    <p className="text-white/70 text-xs mt-2 italic">All milkshakes are made with dairy!</p>
                  </div>
                </div>

                {/* Hot Snacks */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-navy uppercase tracking-wide mb-3 border-b-2 border-navy pb-2">
                    Hot Snacks
                  </h3>
                  <div className="space-y-3 flex-1">
                    {hotSnacks.map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <span className="font-semibold text-navy">{item.name}</span>
                        <span className="font-bold text-navy">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  {/* Combos */}
                  <div className="bg-red rounded-xl p-4 text-white mt-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Sparkles className="w-3 h-3" />
                      <div className="border-2 border-white rounded-full px-4 py-1">
                        <h3 className="text-sm font-bold uppercase tracking-wider">Combos</h3>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {combos.map((combo) => (
                        <div key={combo.name}>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-sm">{combo.name}</span>
                            <span className="font-bold text-sm">{combo.price}</span>
                          </div>
                          <p className="text-white/80 text-xs">{combo.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-navy uppercase tracking-wide mb-3 border-b-2 border-navy pb-2">
                    Featured
                  </h3>
                  <div className="space-y-4">
                    {featured.map((item) => (
                      <div key={item.name}>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-navy">{item.name}</span>
                          <span className="font-bold text-navy">{item.price}</span>
                        </div>
                        <p className="text-navy/70 text-xs whitespace-pre-line">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Specials */}
                <div className="bg-navy rounded-xl p-4 text-white flex flex-col">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <div className="border-2 border-white rounded-full px-4 py-1">
                      <h3 className="text-lg font-bold uppercase tracking-wider">Today's Specials</h3>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-4 flex-1 flex items-center justify-center">
                      <p className="text-white/70">Loading...</p>
                    </div>
                  ) : isClosed ? (
                    <div className="text-center py-4 space-y-2 flex-1 flex flex-col items-center justify-center">
                      <DoorClosed className="w-10 h-10 text-white/60" />
                      <p className="font-bold text-lg">We Are Closed</p>
                      <p className="text-white/70 text-sm">Check back during our regular hours</p>
                    </div>
                  ) : dailyItems.length === 0 ? (
                    <div className="text-center py-4 flex-1 flex items-center justify-center">
                      <p className="text-white/70 text-sm">No specials today — check our regular menu!</p>
                    </div>
                  ) : (
                    <div className="space-y-2 flex-1">
                      {inStockItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="font-semibold text-sm">{item.name}</span>
                        </div>
                      ))}
                      {outOfStockItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 opacity-60">
                          <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                          <span className="font-medium line-through text-xs">{item.name}</span>
                          <span className="text-xs text-white/50 ml-auto">Sold out</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-white/50 text-xs mt-3 text-center">✦ Updated daily by staff ✦</p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Slide 2: Today's Specials Full Screen */}
          <CarouselItem className="h-screen pl-0">
            <div className="h-full w-full bg-navy p-8 flex flex-col items-center justify-center">
              {/* Header */}
              <div className="flex items-center gap-6 mb-8">
                <img
                  alt="Food Lab Logo"
                  className="w-24 h-24 object-contain"
                  src="/lovable-uploads/b5d8fa67-ae11-4be8-b032-0f4d100425a8.png"
                />
                <div className="flex items-center gap-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                  <h1 className="text-6xl font-black text-white uppercase tracking-tight">
                    Today's Specials
                  </h1>
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full max-w-5xl flex items-center justify-center">
                {isLoading ? (
                  <p className="text-white/70 text-2xl">Loading...</p>
                ) : isClosed ? (
                  <div className="text-center space-y-6">
                    <DoorClosed className="w-24 h-24 mx-auto text-white/60" />
                    <p className="font-bold text-5xl text-white">We Are Closed</p>
                    <p className="text-white/70 text-2xl">Check back during our regular hours</p>
                  </div>
                ) : dailyItems.length === 0 ? (
                  <p className="text-white/70 text-2xl">No specials today — check our regular menu!</p>
                ) : (
                  <div className="grid grid-cols-2 gap-6 w-full">
                    {/* Available Items */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-green-400 uppercase tracking-wide border-b-2 border-green-400/30 pb-2 flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        Available Now
                      </h2>
                      <div className="space-y-3">
                        {inStockItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-white/10 rounded-xl px-6 py-4">
                            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                            <span className="font-bold text-2xl text-white">{item.name}</span>
                          </div>
                        ))}
                        {inStockItems.length === 0 && (
                          <p className="text-white/50 text-lg italic">All items sold out</p>
                        )}
                      </div>
                    </div>

                    {/* Sold Out Items */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold text-red-400 uppercase tracking-wide border-b-2 border-red-400/30 pb-2 flex items-center gap-3">
                        <XCircle className="w-6 h-6" />
                        Sold Out
                      </h2>
                      <div className="space-y-3">
                        {outOfStockItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl px-6 py-4 opacity-60">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="font-medium text-xl text-white line-through">{item.name}</span>
                          </div>
                        ))}
                        {outOfStockItems.length === 0 && (
                          <p className="text-white/50 text-lg italic">Nothing sold out yet!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-white/40 text-lg mt-6">✦ Updated daily by staff ✦</p>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default MenuBoard;
