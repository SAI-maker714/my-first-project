import { MapPin, Plane, Hotel, Route, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Destination Discovery",
    desc: "Choose from hundreds of Indian destinations. Get detailed info about places to visit, local cuisine, and best time to travel.",
  },
  {
    icon: Route,
    title: "Itinerary Planner",
    desc: "Create day-by-day travel plans with activities, timings, and recommendations powered by AI.",
  },
  {
    icon: Plane,
    title: "Transport Options",
    desc: "Compare flights, trains, buses, and car rentals. Find the best route to reach your destination.",
  },
  {
    icon: Hotel,
    title: "Hotel Recommendations",
    desc: "Discover hotels and stays that match your budget and preferences near your chosen destinations.",
  },
  {
    icon: Users,
    title: "User Dashboard",
    desc: "Save your trips, access past itineraries, and manage all your travel plans from one dashboard.",
  },
  {
    icon: BarChart3,
    title: "Admin Panel",
    desc: "Admin dashboard to manage destinations, users, and monitor platform activity.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything You Need to <span className="text-primary">Travel Smart</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From discovering hidden gems to planning every detail of your journey — we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative p-8 rounded-2xl bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute top-4 right-4 text-6xl font-display font-bold text-primary/5">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
