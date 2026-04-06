import { useState } from 'react';
import { Sparkles, Send, Loader2, MapPin, IndianRupee, Home, Building2, ArrowRight } from 'lucide-react';
import { properties, formatPrice, propertyTypeLabels, cities } from '@/lib/data';
import { Property, PropertyType } from '@/lib/types';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';

interface Preferences {
  budget: string;
  city: string;
  type: PropertyType | '';
  bedrooms: string;
  priority: string;
}

const AIRecommender = () => {
  const [step, setStep] = useState<'quiz' | 'loading' | 'results'>('quiz');
  const [preferences, setPreferences] = useState<Preferences>({
    budget: '',
    city: '',
    type: '',
    bedrooms: '',
    priority: '',
  });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [error, setError] = useState('');

  const getRecommendations = async () => {
    setStep('loading');
    setError('');

    // Filter properties based on preferences
    const candidates = properties.filter(p => {
      if (preferences.city && p.city !== preferences.city) return false;
      if (preferences.type && p.type !== preferences.type) return false;
      if (preferences.budget) {
        const maxBudget = Number(preferences.budget);
        if (p.price > maxBudget) return false;
      }
      if (preferences.bedrooms && p.bedrooms) {
        if (p.bedrooms < Number(preferences.bedrooms)) return false;
      }
      return p.status === 'available';
    });

    // Build prompt for AI
    const propertyList = (candidates.length > 0 ? candidates : properties.filter(p => p.status === 'available'))
      .slice(0, 15)
      .map(p => `ID:${p.id} | ${p.title} | ${p.city} | ${formatPrice(p.price)} | ${p.size} | ${p.bedrooms || 0} beds | Features: ${p.features.join(', ')}`)
      .join('\n');

    const userPrefs = `Budget: ${preferences.budget ? formatPrice(Number(preferences.budget)) : 'Flexible'}, City: ${preferences.city || 'Any'}, Type: ${preferences.type ? propertyTypeLabels[preferences.type] : 'Any'}, Bedrooms: ${preferences.bedrooms || 'Any'}, Priority: ${preferences.priority || 'Best value'}`;

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-recommend', {
        body: {
          preferences: userPrefs,
          properties: propertyList,
        },
      });

      if (fnError) throw fnError;

      setAiAnalysis(data.analysis || 'No analysis available.');
      setRecommendedIds(data.recommendedIds || candidates.slice(0, 3).map(p => p.id));
      setStep('results');
    } catch (err: any) {
      console.error('AI recommendation error:', err);
      // Fallback: use local scoring
      const scored = candidates.length > 0 ? candidates : properties.filter(p => p.status === 'available');
      const top3 = scored.slice(0, 3);
      setRecommendedIds(top3.map(p => p.id));
      setAiAnalysis(
        `Based on your preferences (${userPrefs}), here are my top recommendations:\n\n` +
        top3.map((p, i) => `**${i + 1}. ${p.title}** — ${formatPrice(p.price)} in ${p.city}\n${p.description.slice(0, 120)}...\n`).join('\n')
      );
      setStep('results');
    }
  };

  const recommendedProperties = recommendedIds
    .map(id => properties.find(p => p.id === id))
    .filter(Boolean) as Property[];

  const budgetOptions = [
    { label: 'Under ₹50 Lakhs', value: '5000000' },
    { label: '₹50L - ₹1 Crore', value: '10000000' },
    { label: '₹1Cr - ₹3 Crore', value: '30000000' },
    { label: '₹3Cr - ₹5 Crore', value: '50000000' },
    { label: '₹5Cr+', value: '100000000' },
  ];

  const priorityOptions = ['Best Value', 'Largest Space', 'Most Amenities', 'Investment Potential', 'Luxury Living'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Smart Property Recommender</h1>
              <p className="text-muted-foreground text-sm">Tell us your preferences, we'll find the best match</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Budget */}
              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-accent" /> What's your budget?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {budgetOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPreferences(p => ({ ...p, budget: p.budget === opt.value ? '' : opt.value }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.budget === opt.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" /> Preferred city?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cities.slice(0, 12).map(city => (
                    <button
                      key={city}
                      onClick={() => setPreferences(p => ({ ...p, city: p.city === city ? '' : city }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.city === city
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Home className="w-4 h-4 text-accent" /> Property type?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(propertyTypeLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setPreferences(p => ({ ...p, type: p.type === key ? '' : key as PropertyType }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.type === key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-accent" /> Minimum bedrooms?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3', '4', '5+'].map(n => (
                    <button
                      key={n}
                      onClick={() => setPreferences(p => ({ ...p, bedrooms: p.bedrooms === n.replace('+', '') ? '' : n.replace('+', '') }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.bedrooms === n.replace('+', '')
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {n} BHK
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="bg-card rounded-xl p-6 card-shadow space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" /> What matters most?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setPreferences(p => ({ ...p, priority: p.priority === opt ? '' : opt }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences.priority === opt
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={getRecommendations}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl gold-gradient text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-5 h-5" /> Get Recommendations
              </button>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 space-y-4"
            >
              <Loader2 className="w-12 h-12 mx-auto text-accent animate-spin" />
              <p className="text-lg font-display font-semibold text-foreground">Analyzing your preferences...</p>
              <p className="text-sm text-muted-foreground">Matching against {properties.length} properties</p>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Analysis */}
              <div className="bg-card rounded-xl p-6 card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Expert Analysis</h2>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                </div>
              </div>

              {/* Recommended Properties */}
              {recommendedProperties.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-semibold text-foreground">Recommended Properties</h2>
                  {recommendedProperties.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <Link
                        to={`/property/${p.id}`}
                        className="flex flex-col md:flex-row bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow"
                      >
                        <img src={p.image} alt={p.title} className="w-full md:w-56 h-40 object-cover" />
                        <div className="p-4 flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-semibold text-accent">#{i + 1} Match</span>
                              <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> {p.location}, {p.city}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-accent">{formatPrice(p.price)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {p.features.slice(0, 4).map(f => (
                              <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="hidden md:flex items-center pr-4">
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setStep('quiz'); setAiAnalysis(''); setRecommendedIds([]); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-muted transition-colors"
              >
                Try Again with Different Preferences
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default AIRecommender;
