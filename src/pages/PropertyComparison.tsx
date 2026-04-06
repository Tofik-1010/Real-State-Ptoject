import { useState, useMemo } from 'react';
import { properties, formatPrice, propertyTypeLabels } from '@/lib/data';
import { Property } from '@/lib/types';
import { ArrowLeftRight, Plus, X, CheckCircle2, XCircle, MapPin, Maximize, BedDouble, Bath, Tag, IndianRupee } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const MAX_COMPARE = 3;

const PropertyComparison = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const selectedProperties = useMemo(
    () => selectedIds.map(id => properties.find(p => p.id === id)!).filter(Boolean),
    [selectedIds]
  );

  const filteredProperties = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return properties.filter(
      p => !selectedIds.includes(p.id) && (p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q))
    );
  }, [searchQuery, selectedIds]);

  const addProperty = (id: string) => {
    if (selectedIds.length < MAX_COMPARE) {
      setSelectedIds(prev => [...prev, id]);
      setShowPicker(false);
      setSearchQuery('');
    }
  };

  const removeProperty = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  // Compute scores for radar chart
  const getScoreData = (props: Property[]) => {
    if (props.length === 0) return [];
    const maxPrice = Math.max(...props.map(p => p.price));
    const maxSize = Math.max(...props.map(p => parseFloat(p.size.replace(/[^0-9.]/g, '')) || 0));
    const maxBed = Math.max(...props.map(p => p.bedrooms || 0), 1);
    const maxBath = Math.max(...props.map(p => p.bathrooms || 0), 1);
    const maxFeatures = Math.max(...props.map(p => p.features.length), 1);

    return [
      { metric: 'Affordability', ...Object.fromEntries(props.map(p => [p.id, Math.round((1 - p.price / maxPrice) * 100) || 10])) },
      { metric: 'Space', ...Object.fromEntries(props.map(p => [p.id, Math.round(((parseFloat(p.size.replace(/[^0-9.]/g, '')) || 0) / maxSize) * 100) || 10])) },
      { metric: 'Bedrooms', ...Object.fromEntries(props.map(p => [p.id, Math.round(((p.bedrooms || 0) / maxBed) * 100) || 10])) },
      { metric: 'Bathrooms', ...Object.fromEntries(props.map(p => [p.id, Math.round(((p.bathrooms || 0) / maxBath) * 100) || 10])) },
      { metric: 'Amenities', ...Object.fromEntries(props.map(p => [p.id, Math.round((p.features.length / maxFeatures) * 100) || 10])) },
    ];
  };

  const radarData = getScoreData(selectedProperties);
  const radarColors = ['hsl(220, 45%, 18%)', 'hsl(38, 92%, 50%)', 'hsl(152, 60%, 40%)'];

  // Price per sqft
  const pricePerSqft = (p: Property) => {
    const sqft = parseFloat(p.size.replace(/[^0-9.]/g, '')) || 1;
    return Math.round(p.price / sqft);
  };

  const bestValue = useMemo(() => {
    if (selectedProperties.length < 2) return null;
    return selectedProperties.reduce((best, curr) => pricePerSqft(curr) < pricePerSqft(best) ? curr : best);
  }, [selectedProperties]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Compare Properties</h1>
              <p className="text-muted-foreground text-sm">Select up to {MAX_COMPARE} properties to compare side-by-side</p>
            </div>
          </div>
        </motion.div>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedProperties.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-xl overflow-hidden card-shadow relative"
            >
              <button
                onClick={() => removeProperty(p.id)}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={p.image} alt={p.title} className="w-full h-36 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm line-clamp-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {p.city}
                </p>
                <p className="text-accent font-bold text-sm mt-1">{formatPrice(p.price)}</p>
                {bestValue?.id === p.id && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="w-3 h-3" /> Best Value
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {selectedIds.length < MAX_COMPARE && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowPicker(true)}
              className="bg-card rounded-xl card-shadow border-2 border-dashed border-border h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Add Property</span>
            </motion.button>
          )}
        </div>

        {/* Property Picker Modal */}
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowPicker(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-card rounded-xl card-shadow max-w-lg w-full max-h-[70vh] overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-foreground">Select a Property</h3>
                    <button onClick={() => setShowPicker(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or city..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto max-h-96 p-2">
                  {filteredProperties.map(p => (
                    <button
                      key={p.id}
                      onClick={() => addProperty(p.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      <img src={p.image} alt={p.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm line-clamp-1">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.city} · {propertyTypeLabels[p.type]}</p>
                        <p className="text-xs font-semibold text-accent">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Table */}
        {selectedProperties.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Radar Chart */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Property Score Comparison</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    {selectedProperties.map((p, i) => (
                      <Radar
                        key={p.id}
                        name={p.title}
                        dataKey={p.id}
                        stroke={radarColors[i]}
                        fill={radarColors[i]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                {selectedProperties.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: radarColors[i] }} />
                    <span className="text-sm text-foreground line-clamp-1">{p.title.slice(0, 30)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Comparison */}
            <div className="bg-card rounded-xl p-6 card-shadow overflow-x-auto">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Detailed Comparison</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Feature</th>
                    {selectedProperties.map(p => (
                      <th key={p.id} className="pb-3 font-medium text-foreground">{p.title.slice(0, 25)}...</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Price', icon: IndianRupee, render: (p: Property) => formatPrice(p.price) },
                    { label: 'Price/sq.ft', icon: Tag, render: (p: Property) => `₹${pricePerSqft(p).toLocaleString('en-IN')}` },
                    { label: 'Location', icon: MapPin, render: (p: Property) => `${p.location}, ${p.city}` },
                    { label: 'Area', icon: Maximize, render: (p: Property) => p.size },
                    { label: 'Bedrooms', icon: BedDouble, render: (p: Property) => p.bedrooms ? `${p.bedrooms}` : 'N/A' },
                    { label: 'Bathrooms', icon: Bath, render: (p: Property) => p.bathrooms ? `${p.bathrooms}` : 'N/A' },
                    { label: 'Type', icon: Tag, render: (p: Property) => propertyTypeLabels[p.type] },
                    { label: 'Status', icon: CheckCircle2, render: (p: Property) => p.status.charAt(0).toUpperCase() + p.status.slice(1) },
                  ].map(row => (
                    <tr key={row.label} className="border-b border-border last:border-0">
                      <td className="py-3 text-muted-foreground flex items-center gap-2">
                        <row.icon className="w-4 h-4" /> {row.label}
                      </td>
                      {selectedProperties.map(p => (
                        <td key={p.id} className="py-3 text-foreground font-medium">{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-b border-border">
                    <td className="py-3 text-muted-foreground">Amenities</td>
                    {selectedProperties.map(p => (
                      <td key={p.id} className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.features.map(f => (
                            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{f}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {selectedProperties.length < 2 && (
          <div className="text-center py-12 text-muted-foreground">
            <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Select at least 2 properties to start comparing</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PropertyComparison;
