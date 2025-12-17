import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  available: boolean;
  on_daily_menu: boolean;
}

const DailyMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from('daily_menu_items')
        .select('id, name, available, on_daily_menu')
        .eq('on_daily_menu', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        setMenuItems(data || []);
      }
      setIsLoading(false);
    };

    fetchMenuItems();
  }, []);

  const inStockItems = menuItems.filter(item => item.available);
  const outOfStockItems = menuItems.filter(item => !item.available);

  return (
    <section className="py-12 px-6">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-primary text-primary-foreground rounded-xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-accent" />
            <h2 className="text-xl md:text-2xl font-semibold">Today's Menu</h2>
          </div>
          <p className="text-primary-foreground/70 text-sm mb-6">{today}</p>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-primary-foreground/70">Loading menu...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-primary-foreground/70">No items on today's menu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inStockItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {outOfStockItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {outOfStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg p-4 backdrop-blur-sm opacity-60"
                    >
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="font-medium line-through">{item.name}</span>
                      <span className="text-xs text-primary-foreground/60 ml-auto">Out of stock</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <p className="text-primary-foreground/60 text-xs mt-4 text-center">
            Staff updates this section each morning
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailyMenu;
