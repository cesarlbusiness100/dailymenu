import foodLabLogo from "@/assets/food-lab-logo.png";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-8 px-6">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <img 
            src={foodLabLogo} 
            alt="Food Lab Logo" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover flex-shrink-0"
          />
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              Mater Brickell Food Lab
            </h1>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-8 bg-accent" />
              <span className="text-base md:text-lg font-medium">Daily Menu</span>
              <div className="h-px w-8 bg-accent" />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Updated each morning by staff
            </p>
          </div>
          <p className="hidden md:block text-primary-foreground/80 text-sm italic max-w-40 text-right flex-shrink-0">
            "A business brought to you by students, for students."
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
