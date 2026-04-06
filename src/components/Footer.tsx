import { Building2, Calculator, ArrowLeftRight, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            <span className="font-display text-xl font-bold">PropNest</span>
          </div>
          <p className="text-sm opacity-80">
            India's trusted real estate platform. Find your dream property — houses, apartments, plots, shops & more.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/properties" className="block hover:opacity-100">Browse Properties</Link>
            <Link to="/favorites" className="block hover:opacity-100">My Favorites</Link>
            <Link to="/dashboard" className="block hover:opacity-100">Dashboard</Link>
            <Link to="/inquiries" className="block hover:opacity-100">Inquiries</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Tools</h4>
          <div className="space-y-2 text-sm opacity-80">
            <Link to="/emi-calculator" className="flex items-center gap-1.5 hover:opacity-100">
              <Calculator className="w-3.5 h-3.5" /> EMI Calculator
            </Link>
            <Link to="/compare" className="flex items-center gap-1.5 hover:opacity-100">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Compare Properties
            </Link>
            <Link to="/ai-recommend" className="flex items-center gap-1.5 hover:opacity-100">
              <Sparkles className="w-3.5 h-3.5" /> Smart Recommender
            </Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Cities</h4>
          <div className="space-y-2 text-sm opacity-80">
            <p>Mumbai</p>
            <p>New Delhi</p>
            <p>Bangalore</p>
            <p>Hyderabad</p>
            <p>Gurugram</p>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
        © 2026 PropNest. All rights reserved. | Made in India 🇮🇳
      </div>
    </div>
  </footer>
);

export default Footer;
