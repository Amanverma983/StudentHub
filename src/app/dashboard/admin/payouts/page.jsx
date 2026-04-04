'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Banknote, IndianRupee, Clock, CheckCircle,
  ArrowUpRight, Wallet, History, AlertCircle, Info,
  Check, Smartphone, ExternalLink, Mail, User, ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function AdminPayoutsPage() {
  const { isAdmin } = useAuth();
  const { fetchAllPayouts, confirmPayout, fetchAllWriters } = useMarketplace();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [writers, setWriters] = useState([]);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'writers'

  const loadData = async () => {
    setLoading(true);
    const [reqs, wrtrs] = await Promise.all([
      fetchAllPayouts(),
      fetchAllWriters()
    ]);
    setRequests(reqs);
    setWriters(wrtrs);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const handleMarkAsPaid = async (requestId) => {
    const success = await confirmPayout(requestId);
    if (success) {
      loadData();
    }
  };

  if (!isAdmin) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle size={48} className="text-red-400 mx-auto" />
        <h1 className="text-xl font-display font-bold">Unauthorized Access</h1>
        <p className="text-ink-muted text-sm">You do not have permission to view this page.</p>
      </div>
    </div>
  );

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const totalOwed = writers.reduce((acc, w) => acc + (w.wallet_balance || 0), 0);
  const totalEarnings = writers.reduce((acc, w) => acc + (w.total_earnings || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-800 text-ink">Payout Management</h1>
        <p className="text-sm text-ink-muted mt-1">Manage writer earnings and withdrawal requests</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-glass-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Wallet size={20} />
            </div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">Total Owed</p>
          </div>
          <h2 className="text-3xl font-display font-900 text-ink">{formatCurrency(totalOwed)}</h2>
          <p className="text-[10px] text-ink-subtle mt-2 italic">Sum of all current wallet balances</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-glass-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">All-Time Earnings</p>
          </div>
          <h2 className="text-3xl font-display font-900 text-ink">{formatCurrency(totalEarnings)}</h2>
          <p className="text-[10px] text-ink-subtle mt-2 italic">Total work done by all writers</p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-glass-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Clock size={20} />
            </div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">Pending Requests</p>
          </div>
          <h2 className="text-3xl font-display font-900 text-ink">{pendingRequests.length}</h2>
          <p className="text-[10px] text-ink-subtle mt-2 italic">Withdrawal requests waiting for payout</p>
        </div>
      </div>

      {/* Management Area */}
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-glass/20 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'requests' ? 'bg-violet-600 text-white shadow-glow-sm' : 'text-ink-muted hover:text-ink'
              }`}
          >
            Withdrawal Requests
          </button>
          <button
            onClick={() => setActiveTab('writers')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'writers' ? 'bg-violet-600 text-white shadow-glow-sm' : 'text-ink-muted hover:text-ink'
              }`}
          >
            Writers Ledger
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'requests' ? (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card rounded-[2.5rem] border border-glass-border overflow-hidden"
            >
              <div className="p-8 border-b border-glass-border">
                <h3 className="font-display font-700 text-ink">Pending Withdrawals</h3>
                <p className="text-xs text-ink-muted mt-1 underline decoration-gold-400/30">Verify UPI details and send cash manually before marking as paid.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-glass/10 border-b border-glass-border">
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Writer</th>
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Method / Details</th>
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Status</th>
                      <th className="px-8 py-4 text-right text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center text-ink-subtle italic">No withdrawal requests found.</td>
                      </tr>
                    ) : (
                      requests.map(req => (
                        <tr key={req.id} className="hover:bg-glass/5 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-glass flex items-center justify-center font-bold text-violet-400 text-xs">
                                {req.writer?.name?.[0]}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-ink">{req.writer?.name}</p>
                                <p className="text-[10px] text-ink-subtle">{req.writer?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-display font-800 text-ink">{formatCurrency(req.amount)}</p>
                            <p className="text-[10px] text-ink-subtle">{formatDate(req.created_at)}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gold-400">
                              <Smartphone size={12} />
                              <p className="text-xs font-mono">{req.payout_method?.upiId || 'N/A'}</p>
                            </div>
                            <p className="text-[10px] text-ink-subtle mt-1 uppercase tracking-widest font-black">UPI Payment</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${req.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gold-500/15 text-gold-400'
                              }`}>
                              {req.status === 'completed' ? 'PAID' : 'PENDING'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            {req.status === 'pending' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleMarkAsPaid(req.id)}
                                className="text-[10px] py-1.5 px-3 h-auto gap-1.5"
                              >
                                <Check size={12} /> Mark as Paid
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="writers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card rounded-[2.5rem] border border-glass-border overflow-hidden"
            >
              <div className="p-8 border-b border-glass-border">
                <h3 className="font-display font-700 text-ink">Writers Ledger</h3>
                <p className="text-xs text-ink-muted mt-1">Track history and earnings for all platform writers.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-glass/10 border-b border-glass-border">
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Writer</th>
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Total Earnings</th>
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Wallet Balance</th>
                      <th className="px-8 py-4 text-left text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Jobs Done</th>
                      <th className="px-8 py-4 text-right text-[10px] uppercase font-bold text-ink-subtle tracking-widest">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {writers.map(writer => (
                      <tr key={writer.id} className="hover:bg-glass/5 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center font-bold text-violet-400 text-xs shrink-0">
                              {writer.name?.[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-ink truncate">{writer.name}</p>
                              <p className="text-[10px] text-ink-subtle truncate">{writer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-display font-800 text-emerald-400">
                          {formatCurrency(writer.total_earnings || 0)}
                        </td>
                        <td className="px-8 py-6 text-sm font-display font-800 text-gold-400">
                          {formatCurrency(writer.wallet_balance || 0)}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-ink-subtle">
                            <ArrowUpRight size={12} />
                            <p className="text-xs font-medium">{writer.completed_gigs || 0} completed</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold text-[10px] uppercase">
                            <CheckCircle size={12} /> Active
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Card */}
      <div className="p-8 rounded-[2.5rem] bg-void/40 border border-violet-500/10 flex gap-6 items-start">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 flex items-center justify-center text-violet-400 shrink-0">
          <Info size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="font-display font-700 text-ink">Important: Manual Payout Required</h4>
          <p className="text-xs text-ink-muted leading-relaxed">
            StudentHub acts as a virtual tracking system. As the administrator, you must manually transfer the real cash to the writer's bank/UPI account once they request a withdrawal. Use the <strong>Mark as Paid</strong> button only after the transaction is successful in your bank app.
          </p>
        </div>
      </div>
    </div>
  );
}
