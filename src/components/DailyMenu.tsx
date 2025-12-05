import { Calendar, CheckCircle2 } from "lucide-react";

const todayItems = [
  { name: "Tequeños", available: true },
  { name: "Chick-fil-A Nuggets", available: true },
  { name: "Oreo Milkshake", available: true },
  { name: "Mango Boba Tea", available: true },
];

const DailyMenu = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <section className="py-12 px-6">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-primary text-primary-foreground rounded-xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-accent" />
            <h2 className="text-xl md:text-2xl font-semibold">Today's Menu</h2>
          </div>
          <p className="text-primary-foreground/70 text-sm mb-6">{today}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {todayItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 bg-primary-foreground/10 rounded-lg p-4 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </div>
            ))}
          </div>
          
          <p className="text-primary-foreground/60 text-xs mt-4 text-center">
            Staff updates this section each morning
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailyMenu;
