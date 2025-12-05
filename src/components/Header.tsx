const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground py-12 px-6">
      <div className="container max-w-5xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
          Mater Brickell Food Lab
        </h1>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-accent" />
          <span className="text-lg md:text-xl font-medium">Daily Menu</span>
          <div className="h-px w-12 bg-accent" />
        </div>
        <p className="text-primary-foreground/80 text-sm md:text-base">
          Updated each morning by staff
        </p>
      </div>
    </header>
  );
};

export default Header;
