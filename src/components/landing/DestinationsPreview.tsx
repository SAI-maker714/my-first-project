import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const destinations = [
  { name: "Jaipur", state: "Rajasthan", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop", tag: "Heritage" },
  { name: "Manali", state: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop", tag: "Mountains" },
  { name: "Goa", state: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop", tag: "Beaches" },
  { name: "Varanasi", state: "Uttar Pradesh", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop", tag: "Spiritual" },
  { name: "Munnar", state: "Kerala", image: "https://images.unsplash.com/photo-1625807171007-573beb5ed21e?w=400&h=300&fit=crop", tag: "Nature" },
  { name: "Udaipur", state: "Rajasthan", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop", tag: "Lakes" },
];

const DestinationsPreview = () => {
  return (
    <section id="destinations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Popular Destinations</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Trending <span className="text-primary">Destinations</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore the most loved travel destinations across India
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {destinations.map((dest) => (
            <div key={dest.name} className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {dest.tag}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold text-xl">{dest.name}</h3>
                <p className="text-muted-foreground text-sm">{dest.state}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/register">
            <Button size="lg" className="px-8">
              Explore All Destinations <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsPreview;
