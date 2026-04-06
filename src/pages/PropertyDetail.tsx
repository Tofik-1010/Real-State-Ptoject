import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bath, BedDouble, Heart, MapPin, Maximize, Phone, Send, Tag, Calendar } from 'lucide-react';
import { properties, formatPrice, propertyTypeLabels } from '@/lib/data';
import { useFavorites } from '@/lib/favorites';
import { addInquiry } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { toast } from 'sonner';

const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);
  const { isFavorite, toggle } = useFavorites();
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">Property Not Found</h1>
          <Link to="/properties" className="text-accent mt-4 inline-block hover:underline">← Back to Properties</Link>
        </div>
      </div>
    );
  }

  const fav = isFavorite(property.id);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await addInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
    });
    setSending(false);
    toast.success('Inquiry sent successfully! The agent will contact you soon.');
    setInquiry({ name: '', email: '', phone: '', message: '' });
  };

  const statusClass: Record<string, string> = {
    available: 'badge-available',
    sold: 'badge-sold',
    rented: 'badge-rented',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-xl overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-[400px] object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={statusClass[property.status]}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </span>
                <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {propertyTypeLabels[property.type]}
                </span>
              </div>
              <button
                onClick={() => toggle(property.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card"
              >
                <Heart className={`w-5 h-5 ${fav ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{property.title}</h1>
                  <div className="flex items-center gap-1 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}, {property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-accent">{formatPrice(property.price)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Maximize, label: 'Area', value: property.size },
                  ...(property.bedrooms ? [{ icon: BedDouble, label: 'Bedrooms', value: `${property.bedrooms}` }] : []),
                  ...(property.bathrooms ? [{ icon: Bath, label: 'Bathrooms', value: `${property.bathrooms}` }] : []),
                  { icon: Tag, label: 'Type', value: propertyTypeLabels[property.type] },
                  { icon: Calendar, label: 'Listed', value: new Date(property.createdAt).toLocaleDateString('en-IN') },
                ].map((item) => (
                  <div key={item.label} className="bg-card rounded-lg p-4 card-shadow text-center">
                    <item.icon className="w-5 h-5 mx-auto text-accent mb-1" />
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-foreground text-sm">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h2 className="font-display text-xl font-semibold text-foreground">Features & Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map(f => (
                    <span key={f} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 card-shadow space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Contact Agent</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {property.agentName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{property.agentName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {property.agentPhone}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleInquiry} className="bg-card rounded-xl p-6 card-shadow space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Send Inquiry</h3>
              <input
                required
                type="text"
                placeholder="Your Name"
                value={inquiry.name}
                onChange={e => setInquiry(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
              <input
                required
                type="email"
                placeholder="Your Email"
                value={inquiry.email}
                onChange={e => setInquiry(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={inquiry.phone}
                onChange={e => setInquiry(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
              <textarea
                required
                placeholder="I'm interested in this property..."
                value={inquiry.message}
                onChange={e => setInquiry(p => ({ ...p, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gold-gradient text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
