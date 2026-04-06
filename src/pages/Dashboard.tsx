import { useState } from 'react';
import { Building2, Heart, TrendingUp, BarChart3, Plus, X, Users, IndianRupee } from 'lucide-react';
import { properties, formatPrice, propertyTypeLabels, cities } from '@/lib/data';
import { Property, PropertyType, PropertyStatus } from '@/lib/types';
import { useFavorites } from '@/lib/favorites';
import { getUserProperties, addUserProperty } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { favorites } = useFavorites();
  const [userProperties, setUserProperties] = useState(getUserProperties());
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const allProperties = [...properties, ...userProperties.map(p => ({ ...p, type: p.type as PropertyType, status: p.status as PropertyStatus }))];
  const available = allProperties.filter(p => p.status === 'available').length;
  const sold = allProperties.filter(p => p.status === 'sold').length;
  const rented = allProperties.filter(p => p.status === 'rented').length;


  const [form, setForm] = useState({
    title: '', price: '', location: '', city: '', state: '', size: '',
    type: 'house', status: 'available', bedrooms: '', bathrooms: '',
    agentName: '', agentPhone: '', image: '', description: '', features: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location || !form.city) {
      toast.error('Please fill in required fields: Title, Price, Location, City');
      return;
    }
    setSaving(true);
    await addUserProperty({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      location: form.location,
      city: form.city,
      state: form.state,
      size: form.size,
      type: form.type,
      status: form.status,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      image: form.image || '/placeholder.svg',
      agentName: form.agentName,
      agentPhone: form.agentPhone,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    });
    setUserProperties(getUserProperties());
    setShowAddForm(false);
    setForm({ title: '', price: '', location: '', city: '', state: '', size: '', type: 'house', status: 'available', bedrooms: '', bathrooms: '', agentName: '', agentPhone: '', image: '', description: '', features: '' });
    setSaving(false);
    toast.success('Property added successfully!');
  };

  const stats = [
    { icon: Building2, label: 'Total Properties', value: allProperties.length, color: 'from-blue-500/20 to-blue-600/5 border-blue-200', iconColor: 'text-blue-600 bg-blue-100' },
    { icon: TrendingUp, label: 'Available', value: available, color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-200', iconColor: 'text-emerald-600 bg-emerald-100' },
    { icon: BarChart3, label: 'Sold', value: sold, color: 'from-rose-500/20 to-rose-600/5 border-rose-200', iconColor: 'text-rose-600 bg-rose-100' },
    { icon: Users, label: 'Rented', value: rented, color: 'from-violet-500/20 to-violet-600/5 border-violet-200', iconColor: 'text-violet-600 bg-violet-100' },
    { icon: Heart, label: 'My Favorites', value: favorites.length, color: 'from-pink-500/20 to-pink-600/5 border-pink-200', iconColor: 'text-pink-600 bg-pink-100' },
  ];

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";
  const labelClass = "text-xs font-semibold text-accent uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your property management</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-gradient-to-br ${s.color} border rounded-xl p-5 space-y-3`}
            >
              <div className={`w-10 h-10 rounded-lg ${s.iconColor} flex items-center justify-center`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Properties */}
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Properties</h2>
            <Link to="/properties" className="text-accent text-sm font-medium hover:underline">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground bg-secondary/40">
                  <th className="px-6 py-3 font-medium">Property</th>
                  <th className="px-6 py-3 font-medium">Location</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {allProperties.slice(0, 10).map((p) => {
                  const statusMap: Record<string, string> = {
                    available: 'badge-available',
                    sold: 'badge-sold',
                    rented: 'badge-rented',
                  };
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-3">
                        <Link to={`/property/${p.id}`} className="font-medium text-foreground hover:text-accent transition-colors">
                          {p.title.slice(0, 45)}{p.title.length > 45 ? '...' : ''}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{p.city}</td>
                      <td className="px-6 py-3 text-muted-foreground capitalize">{p.type}</td>
                      <td className="px-6 py-3"><span className={statusMap[p.status] || 'badge-available'}>{p.status}</span></td>
                      <td className="px-6 py-3 font-semibold text-accent text-right">{formatPrice(p.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User-added properties */}
        {userProperties.length > 0 && (
          <div className="bg-card rounded-xl card-shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Your Added Properties</h2>
              <p className="text-sm text-muted-foreground">{userProperties.length} properties added by you</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground bg-secondary/40">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">City</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {userProperties.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-3 font-medium text-foreground">{p.title}</td>
                      <td className="px-6 py-3 text-muted-foreground">{p.city}</td>
                      <td className="px-6 py-3 text-muted-foreground capitalize">{p.type}</td>
                      <td className="px-6 py-3 font-semibold text-accent text-right">{formatPrice(p.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl card-shadow max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Add New Property</h2>
                  <p className="text-sm text-muted-foreground">Fill in the details below</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Title *</label>
                    <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} placeholder="e.g. 3BHK Flat in Bandra" />
                  </div>
                  <div>
                    <label className={labelClass}>Price (₹) *</label>
                    <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={inputClass} placeholder="e.g. 15000000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Location *</label>
                    <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputClass} placeholder="e.g. Bandra West" />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputClass} placeholder="e.g. Mumbai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>State</label>
                    <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className={inputClass} placeholder="e.g. Maharashtra" />
                  </div>
                  <div>
                    <label className={labelClass}>Size</label>
                    <input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className={inputClass} placeholder="e.g. 1,500 sq.ft." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <input type="number" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} className={inputClass} placeholder="e.g. 3" />
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <input type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} className={inputClass} placeholder="e.g. 2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Agent Name</label>
                    <input value={form.agentName} onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))} className={inputClass} placeholder="e.g. Rajesh Sharma" />
                  </div>
                  <div>
                    <label className={labelClass}>Agent Phone</label>
                    <input value={form.agentPhone} onChange={e => setForm(f => ({ ...f, agentPhone: e.target.value }))} className={inputClass} placeholder="e.g. +91 98765 43210" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Image URL</label>
                    <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className={inputClass} placeholder="https://..." />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputClass}>
                      {Object.entries(propertyTypeLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputClass}>
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputClass} resize-none`} rows={3} placeholder="Describe the property..." />
                </div>
                <div>
                  <label className={labelClass}>Features (comma-separated)</label>
                  <input value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} className={inputClass} placeholder="e.g. Swimming Pool, Gym, Parking" />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl gold-gradient text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Property'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Dashboard;
