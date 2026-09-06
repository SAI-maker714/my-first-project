import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-primary">YatraPlanner</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Features</a>
            <a href="#destinations" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Destinations</a>
            <a href="#testimonials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Reviews</a>
            <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="#about" className="block px-3 py-2 text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>About</a>
            <a href="#features" className="block px-3 py-2 text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#destinations" className="block px-3 py-2 text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Destinations</a>
            <a href="#testimonials" className="block px-3 py-2 text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Reviews</a>
            <Link to="/contact" className="block px-3 py-2 text-sm font-medium hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
            <div className="flex gap-2 px-3">
              <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
              <Link to="/register"><Button size="sm">Get Started</Button></Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
