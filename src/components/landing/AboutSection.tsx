import { Globe, Map, Calendar, Shield } from "lucide-react";

const stats = [
  { value: "500+", label: "Destinations" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "29", label: "States Covered" },
  { value: "24/7", label: "Support" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">About YatraPlanner</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Your Gateway to <span className="text-primary">Incredible India</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            YatraPlanner is your all-in-one travel companion that helps you discover, plan, and experience the diverse beauty of India — from the snow-capped Himalayas to the tropical beaches of Kerala.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl bg-card border border-border">
              <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Globe, title: "Explore Destinations", desc: "Browse through curated Indian destinations with photos and details" },
            { icon: Map, title: "Smart Itineraries", desc: "AI-powered day-by-day itinerary planning with activities" },
            { icon: Calendar, title: "Trip Management", desc: "Save, edit, and manage all your travel plans in one place" },
            { icon: Shield, title: "Secure & Reliable", desc: "Your data is safe with enterprise-grade security" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
