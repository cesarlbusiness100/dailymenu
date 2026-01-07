import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, DoorClosed, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import foodLabLogo from "@/assets/food-lab-logo.png";
interface MenuItem {
  id: string;
  name: string;
  available: boolean;
  on_daily_menu: boolean;
}

// Static menu data matching the screenshot
const drinksMenu = [{
  name: "Mango Passionfruit Boba",
  description: "Made with Mango popping pearls",
  price: "$5"
}, {
  name: "Strawberry Raspberry Boba",
  description: "Made with Strawberry popping pearls",
  price: "$5"
}, {
  name: "Peach Green Tea Boba",
  description: "Made with Lychee popping pearls",
  price: "$5"
}, {
  name: "Iced Lattes",
  description: "Note: All of our lattes are made with dairy!",
  price: "$5"
}];
const milkshakes = [{
  name: "Chocolate"
}, {
  name: "Vanilla"
}, {
  name: "Cookies and Cream"
}, {
  name: "Strawberry"
}, {
  name: "Coffee Frappe"
}];
const hotSnacks = [{
  name: "Cheese Tequeños",
  price: "$2"
}, {
  name: "Beef/Cheese Empanadas",
  price: "$3"
}, {
  name: "Pan De Bono",
  price: "$2"
}, {
  name: "Ham Croquetas",
  price: "$2"
}];
const featured = [{
  name: "Fried Rice",
  description: "From Sushi Sake",
  price: "$10"
}, {
  name: "Chick-Fil-A",
  description: "8 Piece Chicken Nuggets\nChicken Sandwich\nMedium Size mac and cheese",
  price: "$8"
}, {
  name: "Acai",
  description: "Comes with fresh fruit, honey, and granola",
  price: "$7"
}];
const combos = [{
  name: "East Combos",
  description: "Sushi Sake Fried Rice, Boba",
  price: "$13"
}, {
  name: "Cesar Special",
  description: "One Empanadas, one Tequeno, and one Boba",
  price: "$8"
}];
const MenuBoard = () => {
  const [dailyItems, setDailyItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: settingsData
      } = await supabase.from('store_settings').select('is_closed').maybeSingle();
      if (settingsData) {
        setIsClosed(settingsData.is_closed);
      }
      const {
        data,
        error
      } = await supabase.from('daily_menu_items').select('id, name, available, on_daily_menu').eq('on_daily_menu', true).order('display_order', {
        ascending: true
      });
      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        setDailyItems(data || []);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  const inStockItems = dailyItems.filter(item => item.available);
  const outOfStockItems = dailyItems.filter(item => !item.available);
  return <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-5xl md:text-7xl font-black text-navy uppercase tracking-tight leading-none">
            Food Lab<br />Menu
          </h1>
          <div className="text-center md:text-right flex-1">
            <Sparkles className="w-5 h-5 text-navy mx-auto md:mx-0 md:ml-auto mb-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-navy uppercase">We Open Everyday</h2>
            <p className="text-navy/80 font-medium">During All Lunches</p>
            <Sparkles className="w-4 h-4 text-navy mx-auto md:mx-0 md:ml-auto my-2" />
            <p className="text-navy/70 italic">A Business BY Students,<br />For Students</p>
          </div>
          <img alt="Food Lab Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" src="/lovable-uploads/b5d8fa67-ae11-4be8-b032-0f4d100425a8.png" />
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Drinks */}
          <div className="bg-red rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5" />
              <div className="border-2 border-white rounded-full px-6 py-2">
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider">Drinks</h3>
              </div>
              <Sparkles className="w-5 h-5" />
            </div>
            
            <div className="space-y-4">
              {drinksMenu.map(item => <div key={item.name} className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="text-white/80 text-sm">{item.description}</p>
                  </div>
                  <span className="font-bold text-lg">{item.price}</span>
                </div>)}
            </div>

            {/* Milkshakes */}
            <div className="mt-6 pt-4 border-t border-white/30">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-lg">Milkshakes:</p>
                <span className="font-bold text-lg">$6</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {milkshakes.map(shake => <span key={shake.name} className="text-white/90">{shake.name}</span>)}
              </div>
              <p className="text-white/70 text-xs mt-3 italic">Note: All of our milkshakes are made with dairy!</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Hot Snacks & Featured Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Hot Snacks */}
              <div className="border-r-2 border-navy/20 pr-4">
                <h3 className="text-xl md:text-2xl font-bold text-navy uppercase tracking-wide mb-4 border-b-2 border-navy pb-2">
                  Hot Snacks
                </h3>
                <div className="space-y-3">
                  {hotSnacks.map(item => <div key={item.name} className="flex justify-between items-center">
                      <span className="font-semibold text-navy">{item.name}</span>
                      <span className="font-bold text-navy">{item.price}</span>
                    </div>)}
                </div>
              </div>

              {/* Featured */}
              <div className="pl-2">
                <h3 className="text-xl md:text-2xl font-bold text-navy uppercase tracking-wide mb-4 border-b-2 border-navy pb-2">
                  Featured
                </h3>
                <div className="space-y-3">
                  {featured.map(item => <div key={item.name}>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-navy">{item.name}</span>
                        <span className="font-bold text-navy">{item.price}</span>
                      </div>
                      <p className="text-navy/70 text-xs whitespace-pre-line">{item.description}</p>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Combos */}
            <div className="bg-red rounded-2xl p-5 text-white">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-4 h-4" />
                <div className="border-2 border-white rounded-full px-6 py-1.5">
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">Combos</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {combos.map(combo => <div key={combo.name}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold">{combo.name}</span>
                      <span className="font-bold">{combo.price}</span>
                    </div>
                    <p className="text-white/80 text-xs">{combo.description}</p>
                  </div>)}
              </div>
            </div>

            {/* Daily Menu - Editable Section */}
            <div className="bg-navy rounded-2xl p-5 text-white">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-4 h-4 text-accent" />
                <div className="border-2 border-white rounded-full px-6 py-1.5">
                  <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">Today's Specials</h3>
                </div>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              
              {isLoading ? <div className="text-center py-4">
                  <p className="text-white/70">Loading...</p>
                </div> : isClosed ? <div className="text-center py-6 space-y-3">
                  <DoorClosed className="w-10 h-10 mx-auto text-white/60" />
                  <p className="font-bold text-lg">We Are Closed</p>
                  <p className="text-white/70 text-sm">Check back during our regular hours</p>
                </div> : dailyItems.length === 0 ? <div className="text-center py-4">
                  <p className="text-white/70 text-sm">No specials today — check our regular menu!</p>
                </div> : <div className="space-y-2">
                  {inStockItems.map(item => <div key={item.id} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="font-semibold">{item.name}</span>
                    </div>)}
                  {outOfStockItems.map(item => <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2 opacity-60">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="font-medium line-through text-sm">{item.name}</span>
                      <span className="text-xs text-white/50 ml-auto">Sold out</span>
                    </div>)}
                </div>}
              
              <p className="text-white/50 text-xs mt-4 text-center">
                ✦ Updated daily by staff ✦
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default MenuBoard;