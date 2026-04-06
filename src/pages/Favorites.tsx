import { properties } from '@/lib/data';
import { useFavorites } from '@/lib/favorites';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useFavorites();
  const favProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Favorites</h1>
          <p className="text-muted-foreground mt-1">{favProperties.length} saved properties</p>
        </div>

        {favProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProperties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/40" />
            <p className="text-lg text-muted-foreground">No favorites yet</p>
            <Link
              to="/properties"
              className="inline-block px-6 py-3 rounded-xl gold-gradient text-accent-foreground font-semibold hover:opacity-90"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
