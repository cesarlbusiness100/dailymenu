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

const DailyMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from('store_settings')
        .select('is_closed')
        .maybeSingle();

      if (settingsData) {
        setIsClosed(settingsData.is_closed);
      }

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

    fetchData();
  }, []);

  const inStockItems = menuItems.filter(item => item.available);
  const outOfStockItems = menuItems.filter(item => !item.available);

  return (
    <section className="py-8 px-4 md:py-12 md:px-6 bg-cream min-h-[60vh] flex items-center">
      <div className="container max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-navy">
          {/* Header Section */}
          <div className="bg-navy text-white px-6 py-6 md:px-10 md:py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-accent" />
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight uppercase">
                    Today's Menu
                  </h2>
                  <p className="text-cream/80 text-sm md:text-lg mt-1 font-medium">{today}</p>
                </div>
              </div>
              <img 
                src={foodLabLogo} 
                alt="Food Lab Logo" 
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6 md:p-10">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
                  <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
                </div>
              </div>
            ) : isClosed ? (
              <div className="text-center py-16 space-y-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red/10">
                  <DoorClosed className="w-12 h-12 text-red" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-navy mb-2">We Are Closed</h3>
                  <p className="text-muted-foreground text-lg">Check back during our regular hours</p>
                </div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-muted-foreground text-xl">No items on today's menu yet</p>
                <p className="text-muted-foreground/60">Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Available Items */}
                {inStockItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-red rounded-full px-6 py-2 inline-flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-white font-bold uppercase tracking-wide text-sm md:text-base">
                          Available Now
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 bg-navy/20"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {inStockItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-gradient-to-r from-navy/5 to-transparent rounded-xl p-5 md:p-6 border-l-4 border-navy hover:shadow-md transition-shadow"
                        >
                          <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-500 flex-shrink-0" />
                          <span className="font-bold text-navy text-lg md:text-2xl">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Out of Stock Items */}
                {outOfStockItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-muted rounded-full px-6 py-2 inline-flex items-center gap-2">
                        <span className="text-muted-foreground font-bold uppercase tracking-wide text-sm md:text-base">
                          Sold Out
                        </span>
                      </div>
                      <div className="flex-1 h-0.5 bg-muted"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {outOfStockItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-muted/30 rounded-xl p-4 md:p-5 opacity-60"
                        >
                          <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red/60 flex-shrink-0" />
                          <span className="font-medium text-muted-foreground line-through text-base md:text-xl">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-navy/5 px-6 py-4 md:px-10 md:py-5 border-t border-navy/10">
            <p className="text-center text-navy/60 text-xs md:text-sm font-medium">
              ✦ Updated daily by our staff ✦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyMenu;
