import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { properties } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import SearchFilters, { Filters } from '@/components/SearchFilters';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';

  const [filters, setFilters] = useState<Filters>({
    search: '',
    city: '',
    type: initialType as Filters['type'],
    status: '',
    minPrice: '',
    maxPrice: '',
  });

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
      }
      if (filters.city && p.city !== filters.city) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">All Properties</h1>
          <p className="text-muted-foreground mt-1">Browse {filtered.length} properties across India</p>
        </div>
        <SearchFilters filters={filters} onChange={setFilters} />
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No properties found matching your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
