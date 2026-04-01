'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, TrendingUp, Clock, CheckCircle, 
  ArrowUpRight, Wallet, CreditCard, Banknote,
  AlertCircle, History, Info, X, Check, ArrowRight,
  Plus, Smartphone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const supabase = createClient();

export default function WalletPage() {
  const { user, refreshUser } = useAuth();
  const { requestPayout, updatePayoutInfo } = useMarketplace();
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutInfo, setPayoutInfo] = useState({
    type: 'upi',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolder: ''
  });

  const fetchPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('writer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPayouts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPayouts();
      if (user.payout_info) {
        setPayoutInfo(prev => ({ ...prev, ...user.payout_info }));
      }
    }
  }, [user]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount);
    
    if (!amount || amount < 100) {
      return toast.error('Minimum withdrawal is ₹100');
    }
    
    if (amount > (user.wallet_balance || 0)) {
      return toast.error('Insufficient balance');
    }

    if (!user.payout_info?.upiId && !user.payout_info?.accountNumber) {
      toast.error('Please add a payout method first');
      setShowWithdrawModal(false);
      setShowMethodModal(true);
      return;
    }

    const success = await requestPayout(user.id, amount, user.payout_info);
    if (success) {
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchPayouts();
      refreshUser();
    }
  };

  const handleSaveMethod = async (e) => {
    e.preventDefault();
    await updatePayoutInfo(user.id, payoutInfo);
    setShowMethodModal(false);
    refreshUser();
  };

  const stats = [
    { label: 'Current Balance', value: user.wallet_balance || 0, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Earnings', value: user.total_earnings || 0, icon: IndianRupee, color: 'text-gold-400', bg: 'bg-gold-500/10' },
    { label: 'Pending Payouts', value: payouts.filter(p => p.status === 'pending' || p.status === 'processing').reduce((acc, p) => acc + p.amount, 0), icon: Clock, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-900 text-ink tracking-tight">My <span className="gradient-text-gold">Wallet</span></h1>
          <p className="text-sm text-ink-muted mt-1">Manage your earnings and withdrawal requests</p>
        </div>
        <Button 
          variant="gold" 
          onClick={() => setShowWithdrawModal(true)}
          disabled={(user.wallet_balance || 0) < 100}
        >
          <ArrowUpRight size={18} className="mr-2" />
          Withdraw Funds
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl border border-glass-border flex flex-col items-center text-center group hover:border-violet-500/20 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <p className="text-sm text-ink-muted mb-1 font-medium">{stat.label}</p>
            <h3 className={`font-display text-3xl font-800 ${stat.color}`}>{formatCurrency(stat.value)}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payout Method Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-glass-border overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <CreditCard size={120} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-700 text-ink flex items-center gap-2">
                <Banknote size={20} className="text-violet-400" />
                Payout Method
              </h2>
              <button onClick={() => setShowMethodModal(true)} className="text-xs text-violet-400 font-bold hover:underline">
                Update
              </button>
            </div>

            {user.payout_info?.upiId || user.payout_info?.accountNumber ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-void/40 border border-violet-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    {user.payout_info.type === 'upi' ? <Smartphone size={16} className="text-violet-400" /> : <CreditCard size={16} className="text-violet-400" />}
                    <span className="text-[10px] font-black uppercase text-violet-400 tracking-widest">{user.payout_info.type} Primary</span>
                  </div>
                  <p className="text-base font-display font-bold text-ink">
                    {user.payout_info.type === 'upi' ? user.payout_info.upiId : user.payout_info.accountNumber}
                  </p>
                  {user.payout_info.type === 'bank' && <p className="text-[11px] text-ink-subtle mt-1">{user.payout_info.bankName} • {user.payout_info.ifscCode}</p>}
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10">
                  <AlertCircle size={14} className="text-gold-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-ink-subtle leading-tight">Admin will transfer funds to this method within 24-48 hours of request.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-void/40 flex items-center justify-center mx-auto mb-4 border border-glass-border">
                  <Plus size={20} className="text-ink-subtle" />
                </div>
                <p className="text-sm text-ink-muted mb-4">No payout method added</p>
                <Button variant="secondary" size="sm" onClick={() => setShowMethodModal(true)}>Add Payout Details</Button>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-violet-600/10 border border-violet-600/20 relative overflow-hidden">
            <h3 className="font-display font-700 text-ink mb-2">How it works?</h3>
            <ul className="text-xs text-ink-subtle space-y-3 relative z-10">
              <li className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/30 flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
                Deliver assignments to earn credits in your wallet.
              </li>
              <li className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/30 flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
                Request withdrawal once you reach the ₹100 threshold.
              </li>
              <li className="flex gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-600/30 flex items-center justify-center shrink-0 text-[10px] font-bold">3</span>
                Admin verifies and transfers real cash to your UPI/Bank.
              </li>
            </ul>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-3xl border border-glass-border overflow-hidden">
            <div className="p-6 border-b border-glass-border flex items-center justify-between">
              <h2 className="font-display font-700 text-ink flex items-center gap-2">
                <History size={20} className="text-violet-400" />
                Withdrawal History
              </h2>
            </div>
            
            <div className="overflow-x-auto min-h-[300px]">
              {payouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-void/40 flex items-center justify-center mb-4 text-ink-subtle">
                    <TrendingUp size={30} />
                  </div>
                  <h3 className="text-ink font-semibold mb-1">No withdrawals yet</h3>
                  <p className="text-ink-subtle text-xs max-w-xs">Your payout requests and status updates will appear here.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-glass border-b border-glass-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-ink-subtle tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-ink-subtle tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-ink-subtle tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-ink-subtle tracking-widest">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-glass/10 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-xs text-ink font-medium">{formatDate(payout.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-display font-800 text-gold-400">{formatCurrency(payout.amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`badge-${
                            payout.status === 'paid' ? 'emerald' : 
                            payout.status === 'pending' ? 'gold' : 
                            payout.status === 'processing' ? 'violet' : 'red'
                          } text-[9px] px-2 py-0.5 rounded-full inline-block font-black uppercase`}>
                            {payout.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] text-ink-subtle truncate max-w-[120px] block">
                            {payout.payout_method?.type === 'upi' ? payout.payout_method.upiId : payout.payout_method.accountNumber}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Withdraw Funds */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-void/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md glass-card rounded-[2.5rem] p-8 border border-glass-border shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 bg-gold-400/10 blur-[100px] rounded-full" />
              <button onClick={() => setShowWithdrawModal(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-glass border border-glass-border text-ink-subtle"><X size={18} /></button>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/20 flex items-center justify-center text-gold-400"><ArrowUpRight size={24} /></div>
                <div>
                  <h3 className="font-display text-2xl font-800 text-ink">Withdraw</h3>
                  <p className="text-xs text-ink-muted">Choose amount to transfer</p>
                </div>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">Amount to Withdraw</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" size={18} />
                    <input 
                      type="number"
                      className="input-field pl-12 text-2xl font-display font-800 text-gold-400" 
                      placeholder="500" 
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      min="100"
                      max={user.wallet_balance}
                      required 
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-[10px] text-ink-muted">Available: <span className="text-ink font-bold">{formatCurrency(user.wallet_balance || 0)}</span></p>
                    <button type="button" onClick={() => setWithdrawAmount(user.wallet_balance)} className="text-[10px] text-violet-400 font-bold hover:underline">MAX</button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-void/50 border border-glass-border space-y-3">
                  <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Payout Destination</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400"><Smartphone size={14} /></div>
                    <p className="text-sm font-semibold text-ink">{user.payout_info?.upiId || 'Not Added'}</p>
                  </div>
                </div>

                <Button variant="gold" size="lg" className="w-full justify-center py-4" type="submit">Confirm Withdrawal</Button>
                <p className="text-center text-[10px] text-ink-subtle">By withdrawing, you agree to our settlement terms.</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Update Method */}
      <AnimatePresence>
        {showMethodModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMethodModal(false)}
              className="absolute inset-0 bg-void/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md glass-card rounded-[2.5rem] p-8 border border-glass-border shadow-2xl"
            >
              <button onClick={() => setShowMethodModal(false)} className="absolute top-6 right-6 p-2 rounded-xl bg-glass border border-glass-border text-ink-subtle"><X size={18} /></button>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400"><CreditCard size={24} /></div>
                <div>
                  <h3 className="font-display text-2xl font-800 text-ink">Payout Method</h3>
                  <p className="text-xs text-ink-muted">Where should we send your money?</p>
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-void/50 rounded-2xl border border-glass-border mb-6">
                <button 
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${payoutInfo.type === 'upi' ? 'bg-violet-600 text-white shadow-lg' : 'text-ink-subtle'}`}
                  onClick={() => setPayoutInfo(prev => ({...prev, type: 'upi'}))}
                >UPI</button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${payoutInfo.type === 'bank' ? 'bg-violet-600 text-white shadow-lg' : 'text-ink-subtle'}`}
                  onClick={() => setPayoutInfo(prev => ({...prev, type: 'bank'}))}
                >Bank Account</button>
              </div>

              <form onSubmit={handleSaveMethod} className="space-y-4">
                {payoutInfo.type === 'upi' ? (
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">UPI ID</label>
                    <input 
                      className="input-field" 
                      placeholder="e.g. yourname@okaxis" 
                      value={payoutInfo.upiId}
                      onChange={e => setPayoutInfo(prev => ({...prev, upiId: e.target.value}))}
                      required 
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">Account Holder Name</label>
                      <input className="input-field" placeholder="Full Name" value={payoutInfo.accountHolder} onChange={e => setPayoutInfo(prev => ({...prev, accountHolder: e.target.value}))} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">Account Number</label>
                        <input className="input-field" placeholder="1234567890" value={payoutInfo.accountNumber} onChange={e => setPayoutInfo(prev => ({...prev, accountNumber: e.target.value}))} required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">IFSC Code</label>
                        <input className="input-field" placeholder="SBIN0001234" value={payoutInfo.ifscCode} onChange={e => setPayoutInfo(prev => ({...prev, ifscCode: e.target.value}))} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">Bank Name</label>
                      <input className="input-field" placeholder="SBI, HDFC, etc." value={payoutInfo.bankName} onChange={e => setPayoutInfo(prev => ({...prev, bankName: e.target.value}))} required />
                    </div>
                  </div>
                )}

                <Button variant="primary" size="lg" className="w-full justify-center py-4 mt-4" type="submit">Save Payout Details</Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
