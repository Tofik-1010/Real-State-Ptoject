import { Link } from 'react-router-dom';
import { Heart, MapPin, Maximize, BedDouble, Bath, Tag } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatPrice, propertyTypeLabels } from '@/lib/data';
import { useFavorites } from '@/lib/favorites';
import { motion } from 'framer-motion';

interface Props {
  property: Property;
  index?: number;
}

const statusClass: Record<string, string> = {
  available: 'badge-available',
  sold: 'badge-sold',
  rented: 'badge-rented',
};

const PropertyCard = ({ property, index = 0 }: Props) => {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(property.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300"
    >
      <div className="relative overflow-hidden">
        <Link to={`/property/${property.id}`}>
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={statusClass[property.status]}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
          <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {propertyTypeLabels[property.type]}
          </span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggle(property.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart className={`w-4 h-4 ${fav ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </button>
        <div className="absolute bottom-3 left-3">
          <span className="text-lg font-bold text-primary-foreground bg-primary/90 px-3 py-1 rounded-lg backdrop-blur-sm">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      <Link to={`/property/${property.id}`} className="block p-4 space-y-3">
        <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{property.location}, {property.city}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1">
            <Maximize className="w-3.5 h-3.5" />
            {property.size}
          </span>
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" />
              {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {property.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Tag className="w-3.5 h-3.5" />
            {propertyTypeLabels[property.type]}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
