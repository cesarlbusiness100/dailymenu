import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeedbackButton = () => {
  return (
    <section className="py-8 px-6">
      <div className="container max-w-5xl mx-auto text-center">
        <p className="text-muted-foreground text-sm mb-4">
          Have a suggestion or want to request a new item?
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        >
          <a
            href="https://forms.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Submit a Request or Feedback
          </a>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackButton;
