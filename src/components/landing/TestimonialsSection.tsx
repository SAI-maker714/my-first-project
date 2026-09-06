import { Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", location: "Delhi", text: "YatraPlanner made our Rajasthan trip so smooth! The itinerary feature saved us hours of planning.", rating: 5 },
  { name: "Rahul Verma", location: "Mumbai", text: "Best travel planning app for India. Found hidden gems in Kerala that we wouldn't have discovered otherwise.", rating: 5 },
  { name: "Anita Desai", location: "Bangalore", text: "The transport comparison feature is amazing. Saved a lot of money on our family trip to Shimla.", rating: 4 },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Loved by <span className="text-primary">Travelers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-golden text-golden" />
                ))}
              </div>
              <p className="text-foreground/80 mb-4 italic">"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
