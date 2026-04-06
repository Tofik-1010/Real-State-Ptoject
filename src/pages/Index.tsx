import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Home, Map, Store, LandPlot, Search, Calculator, ArrowLeftRight, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import { properties, formatPrice, propertyTypeLabels } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const typeIcons: Record<string, React.ElementType> = {
  house: Home,
  apartment: Building2,
  villa: Home,
  shop: Store,
  plot: LandPlot,
  building: Building2,
};

const Index = () => {
  const featured = properties.filter(p => p.status === 'available').slice(0, 6);
  const types = Object.entries(propertyTypeLabels);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Indian cityscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight"
          >
            Find Your Dream
            <br />
            <span className="text-accent">Property in India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-primary-foreground/80 max-w-xl mx-auto"
          >
            Smart property search with EMI calculator and powerful comparison tools.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </Link>
            <Link
              to="/ai-recommend"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/20 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Smart Recommender
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Properties', value: '500+' },
            { label: 'Cities', value: '25+' },
            { label: 'Happy Buyers', value: '1,200+' },
            { label: 'Trusted Agents', value: '150+' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-card rounded-xl p-6 text-center card-shadow"
            >
              <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-3">
          Smart Tools for Smart Decisions
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
          Go beyond browsing — use smart tools and calculators to make informed property decisions.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { to: '/emi-calculator', icon: Calculator, label: 'EMI Calculator', desc: 'Calculate monthly payments with bank rate comparison' },
            { to: '/compare', icon: ArrowLeftRight, label: 'Compare Properties', desc: 'Side-by-side comparison with radar charts' },
            { to: '/ai-recommend', icon: Sparkles, label: 'Smart Recommender', desc: 'Intelligent property matching based on your preferences' },
          ].map((tool, i) => (
            <motion.div
              key={tool.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <Link
                to={tool.to}
                className="block bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all group h-full"
              >
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{tool.label}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Property Types */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-10">
          Browse by Property Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {types.map(([key, label]) => {
            const Icon = typeIcons[key] || Building2;
            return (
              <Link
                key={key}
                to={`/properties?type=${key}`}
                className="bg-card rounded-xl p-6 text-center card-shadow hover:card-shadow-hover transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="mt-3 font-medium text-foreground text-sm">{label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground">Featured Properties</h2>
          <Link to="/properties" className="text-accent font-medium text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-10">
          Why Choose PropNest
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'Smart Search', desc: 'Our engine understands your preferences and recommends the perfect property match — no more endless scrolling.' },
            { icon: Shield, title: 'Verified Listings', desc: 'Every property is verified by our team. RERA compliance, clear titles, and transparent documentation guaranteed.' },
            { icon: TrendingUp, title: 'Market Intelligence', desc: 'Real-time price trends, investment insights, and area analysis to help you make data-driven decisions.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-card rounded-xl p-8 card-shadow text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
