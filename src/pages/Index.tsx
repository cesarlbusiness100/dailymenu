import { Link } from "react-router-dom";
import MenuBoard from "@/components/MenuBoard";
import FeedbackButton from "@/components/FeedbackButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <MenuBoard />
      <FeedbackButton />
      <div className="pb-6 text-center">
        <Link 
          to="/admin/login" 
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Staff Login
        </Link>
      </div>
    </div>
  );
};

export default Index;
