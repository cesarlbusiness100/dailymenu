import foodLabLogo from "@/assets/food-lab-logo.png";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-8 px-6">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center gap-6">
          <img 
            src={foodLabLogo} 
            alt="Food Lab Logo" 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              Mater Brickell Food Lab
            </h1>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-accent" />
              <span className="text-base md:text-lg font-medium">Daily Menu</span>
              <div className="h-px w-8 bg-accent" />
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Updated each morning by staff
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
