import Header from "@/components/Header";
import PopularItems from "@/components/PopularItems";
import DailyMenu from "@/components/DailyMenu";
import FullMenu from "@/components/FullMenu";
import Hours from "@/components/Hours";
import FeedbackButton from "@/components/FeedbackButton";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PopularItems />
        <DailyMenu />
        <FullMenu />
        <Hours />
        <FeedbackButton />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
