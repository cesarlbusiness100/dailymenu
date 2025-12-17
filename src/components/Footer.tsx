import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-6">
      <div className="container max-w-5xl mx-auto text-center">
        <div className="h-px w-24 bg-accent mx-auto mb-6" />
        <h4 className="font-semibold mb-1">Mater Brickell Food Lab</h4>
        <p className="text-primary-foreground/70 text-sm">Student Services Department</p>
        <p className="text-primary-foreground/50 text-xs mt-3">Menu updated daily</p>
        <Link 
          to="/admin/login" 
          className="inline-block mt-4 text-primary-foreground/40 text-xs hover:text-primary-foreground/60 transition-colors"
        >
          Staff Login
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
