import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calculator, IndianRupee, Calendar, Percent, TrendingDown, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/data';
import { motion } from 'framer-motion';

const bankRates = [
  { name: 'SBI', rate: 8.50, maxTenure: 30, processingFee: '0.35%' },
  { name: 'HDFC Bank', rate: 8.70, maxTenure: 30, processingFee: '0.50%' },
  { name: 'ICICI Bank', rate: 8.75, maxTenure: 30, processingFee: '0.50%' },
  { name: 'Axis Bank', rate: 8.75, maxTenure: 30, processingFee: '1.00%' },
  { name: 'Bank of Baroda', rate: 8.40, maxTenure: 30, processingFee: '0.25%' },
  { name: 'PNB', rate: 8.45, maxTenure: 30, processingFee: '0.35%' },
  { name: 'Kotak Mahindra', rate: 8.85, maxTenure: 20, processingFee: '0.50%' },
  { name: 'LIC Housing', rate: 8.50, maxTenure: 30, processingFee: '0.50%' },
];

const COLORS = ['hsl(220, 45%, 18%)', 'hsl(38, 92%, 50%)'];

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const { emi, totalInterest, totalAmount, schedule } = useMemo(() => {
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emiVal = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmt = emiVal * n;
    const totalInt = totalAmt - loanAmount;

    // Generate yearly amortization schedule
    let balance = loanAmount;
    const sched = [];
    for (let year = 1; year <= tenure; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;
      for (let month = 0; month < 12; month++) {
        const intForMonth = balance * r;
        const principalForMonth = emiVal - intForMonth;
        yearPrincipal += principalForMonth;
        yearInterest += intForMonth;
        balance -= principalForMonth;
      }
      sched.push({
        year,
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    return { emi: Math.round(emiVal), totalInterest: Math.round(totalInt), totalAmount: Math.round(totalAmt), schedule: sched };
  }, [loanAmount, interestRate, tenure]);

  const pieData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">EMI Calculator</h1>
              <p className="text-muted-foreground text-sm">Plan your home loan with precision</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sliders Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-card rounded-xl p-6 card-shadow space-y-8"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-accent" /> Loan Amount
                </label>
                <span className="text-sm font-bold text-accent">{formatPrice(loanAmount)}</span>
              </div>
              <input
                type="range"
                min={500000}
                max={100000000}
                step={100000}
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹5L</span><span>₹10Cr</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Percent className="w-4 h-4 text-accent" /> Interest Rate
                </label>
                <span className="text-sm font-bold text-accent">{interestRate}%</span>
              </div>
              <input
                type="range"
                min={6}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6%</span><span>15%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" /> Tenure (Years)
                </label>
                <span className="text-sm font-bold text-accent">{tenure} yrs</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenure}
                onChange={e => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 yr</span><span>30 yrs</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly EMI</span>
                <span className="text-xl font-display font-bold text-foreground">{formatPrice(emi)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Interest</span>
                <span className="text-base font-semibold text-destructive">{formatPrice(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-base font-semibold text-foreground">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </motion.div>

          {/* Chart + Amortization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Pie Chart */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Payment Breakdown</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => formatPrice(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{ background: COLORS[0] }} />
                    <div>
                      <p className="text-sm text-muted-foreground">Principal Amount</p>
                      <p className="font-semibold text-foreground">{formatPrice(loanAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{ background: COLORS[1] }} />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="font-semibold text-foreground">{formatPrice(totalInterest)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Interest is <span className="font-semibold text-foreground">{((totalInterest / loanAmount) * 100).toFixed(1)}%</span> of principal
                  </div>
                </div>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="bg-card rounded-xl p-6 card-shadow">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Yearly Amortization Schedule</h2>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Year</th>
                      <th className="pb-3 font-medium">Principal Paid</th>
                      <th className="pb-3 font-medium">Interest Paid</th>
                      <th className="pb-3 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map(row => (
                      <tr key={row.year} className="border-b border-border last:border-0">
                        <td className="py-2.5 font-medium text-foreground">{row.year}</td>
                        <td className="py-2.5 text-foreground">{formatPrice(row.principal)}</td>
                        <td className="py-2.5 text-destructive">{formatPrice(row.interest)}</td>
                        <td className="py-2.5 text-muted-foreground">{formatPrice(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bank Rate Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 card-shadow"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-accent" />
            <h2 className="font-display text-lg font-semibold text-foreground">Bank Rate Comparison (2026)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Bank</th>
                  <th className="pb-3 font-medium">Interest Rate</th>
                  <th className="pb-3 font-medium">Max Tenure</th>
                  <th className="pb-3 font-medium">Processing Fee</th>
                  <th className="pb-3 font-medium">EMI (for your loan)</th>
                </tr>
              </thead>
              <tbody>
                {bankRates.map(bank => {
                  const r = bank.rate / 12 / 100;
                  const n = tenure * 12;
                  const bankEmi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
                  return (
                    <tr key={bank.name} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-foreground">{bank.name}</td>
                      <td className="py-3 text-accent font-semibold">{bank.rate}%</td>
                      <td className="py-3 text-muted-foreground">{bank.maxTenure} years</td>
                      <td className="py-3 text-muted-foreground">{bank.processingFee}</td>
                      <td className="py-3 font-semibold text-foreground">{formatPrice(bankEmi)}/mo</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default EMICalculator;
