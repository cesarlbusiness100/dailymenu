import { Clock } from "lucide-react";

const Hours = () => {
  return (
    <section className="py-12 px-6">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 bg-cream rounded-xl p-6 border border-border">
          <Clock className="w-6 h-6 text-accent" />
          <div className="text-center">
            <h3 className="font-semibold text-primary text-lg">Hours of Operation</h3>
            <p className="text-muted-foreground">All Lunch Periods • 10:15 AM – 12:15 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hours;
