import { useState } from "react";
import { MessageSquarePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FeedbackButton = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("feedback_requests")
      .insert({
        name: name.trim() || null,
        message: message.trim(),
      });

    if (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted.",
      });
      setName("");
      setMessage("");
    }

    setIsSubmitting(false);
  };

  return (
    <section className="py-8 px-6">
      <div className="container max-w-xl mx-auto">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquarePlus className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-primary">Submit a Request or Feedback</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Have a suggestion or want to request a new item?
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
            <Textarea
              placeholder="Your message or request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FeedbackButton;
