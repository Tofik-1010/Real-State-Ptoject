import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, XCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { getInquiries, type Inquiry } from '@/lib/api';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  new: { label: 'New', class: 'bg-blue-100 text-blue-700', icon: Clock },
  contacted: { label: 'Contacted', class: 'bg-amber-100 text-amber-700', icon: CheckCircle2 },
  closed: { label: 'Closed', class: 'bg-emerald-100 text-emerald-700', icon: XCircle },
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const loadInquiries = async () => {
    setLoading(true);
    const data = await getInquiries();
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => { loadInquiries(); }, []);

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Inquiries</h1>
                <p className="text-muted-foreground text-sm">{inquiries.length} total inquiries</p>
              </div>
            </div>
            <button
              onClick={loadInquiries}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'new', 'contacted', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {f === 'all' ? 'All' : statusConfig[f]?.label || f}
              {f === 'all' && ` (${inquiries.length})`}
              {f !== 'all' && ` (${inquiries.filter(i => i.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30" />
            <p className="text-lg text-muted-foreground">No inquiries yet</p>
            <p className="text-sm text-muted-foreground">When visitors send inquiries on property pages, they'll appear here.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground bg-secondary/50">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inq, i) => {
                    const sc = statusConfig[inq.status] || statusConfig.new;
                    return (
                      <motion.tr
                        key={inq._id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{inq.name}</p>
                            {inq.phone && <p className="text-xs text-muted-foreground">{inq.phone}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{inq.email}</td>
                        <td className="px-4 py-3">
                          {inq.propertyId ? (
                            <Link
                              to={`/property/${inq.propertyId}`}
                              className="text-accent hover:underline flex items-center gap-1 text-sm"
                            >
                              {inq.propertyTitle?.slice(0, 30) || 'View'} <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{inq.message}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.class}`}>
                            <sc.icon className="w-3 h-3" /> {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Inquiries;
