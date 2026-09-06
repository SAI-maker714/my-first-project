import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="font-display text-lg font-bold">YatraPlanner</span>
            </div>
            <p className="text-primary-foreground/60 text-sm">
              Your trusted companion for planning the perfect Indian adventure.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <a href="#about" className="block hover:text-primary-foreground transition-colors">About</a>
              <a href="#features" className="block hover:text-primary-foreground transition-colors">Features</a>
              <a href="#destinations" className="block hover:text-primary-foreground transition-colors">Destinations</a>
              <Link to="/contact" className="block hover:text-primary-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Account</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <Link to="/login" className="block hover:text-primary-foreground transition-colors">Login</Link>
              <Link to="/register" className="block hover:text-primary-foreground transition-colors">Register</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              <p>support@yatraplanner.com</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/40">
          © 2026 YatraPlanner. All rights reserved. | BCA Final Year Project
        </div>
      </div>
    </footer>
  );
};

export default Footer;
