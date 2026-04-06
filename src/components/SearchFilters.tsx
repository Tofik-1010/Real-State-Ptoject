import { Search, SlidersHorizontal } from 'lucide-react';
import { PropertyStatus, PropertyType } from '@/lib/types';
import { cities, propertyTypeLabels } from '@/lib/data';
import { useState } from 'react';

interface Filters {
  search: string;
  city: string;
  type: PropertyType | '';
  status: PropertyStatus | '';
  minPrice: string;
  maxPrice: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const SearchFilters = ({ filters, onChange }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const set = (key: keyof Filters, val: string) => onChange({ ...filters, [key]: val });

  return (
    <div className="bg-card rounded-xl card-shadow p-4 space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, location..."
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filters.city}
            onChange={e => set('city', e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none"
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filters.type}
            onChange={e => set('type', e.target.value as PropertyType | '')}
            className="px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none"
          >
            <option value="">All Types</option>
            {Object.entries(propertyTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={e => set('status', e.target.value as PropertyStatus | '')}
            className="px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={e => set('minPrice', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none placeholder:text-muted-foreground"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={e => set('maxPrice', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm border-0 outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
export type { Filters };
