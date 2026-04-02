'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, Briefcase, Star, Clock, ArrowRight,
  Zap, PenTool, FileText, Globe, ChevronRight,
  IndianRupee, CheckCircle, Timer, Award, Check,
  X, Truck, Paperclip, MapPin, ExternalLink, Users,
  ShieldCheck, AlertTriangle, Eye, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

function WriterDashboard({ user }) {
  const { filteredGigs, submitDelivery } = useMarketplace();
  const [showDeliverModal, setShowDeliverModal] = useState(null); // stores gig object
  const [deliveryData, setDeliveryData] = useState({ trackingId: '', proofUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Gigs (Assigned to this writer and in-progress)
  const activeGigs = filteredGigs.filter(g => g.assigned_to === user.id && g.status === 'in-progress');
  // Available Gigs (Status open)
  const openGigs = filteredGigs.filter(g => g.status === 'open').slice(0, 3);

  const stats = [
    { label: 'Total Earned', value: formatCurrency(user.totalEarnings || 0), icon: IndianRupee, trend: '+₹2,400 this month', color: 'text-gold-400', bg: 'bg-gold-500/10', border: 'border-gold-500/20' },
    { label: 'Gigs Completed', value: user.completedGigs || 0, icon: CheckCircle, trend: '+5 this week', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Your Rating', value: user.rating || '–', icon: Star, trend: 'Top 10% writer', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Active Gigs', value: activeGigs.length, icon: Timer, trend: 'In-progress', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  ];

  const handleSubmitDelivery = async (e) => {
    e.preventDefault();
    if (!deliveryData.trackingId) return toast.error('Please enter tracking ID');
    setIsSubmitting(true);
    try {
      await submitDelivery(showDeliverModal.id, deliveryData);
      setShowDeliverModal(null);
      setDeliveryData({ trackingId: '', proofUrl: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted mb-1">Good {new Date().getHours() < 12 ? 'morning' : 'day'}, ✨</p>
          <h1 className="font-display text-3xl font-800 text-ink">{user.name?.split(' ')[0]}</h1>
        </div>
        <Link href="/dashboard/marketplace" className="btn-gold text-sm px-5 py-2.5">
          <Briefcase size={15} /> Browse Gigs
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`stat-card border ${stat.border}`}>
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}><stat.icon size={17} className={stat.color} /></div>
            <div className={`font-display text-2xl font-800 mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-ink-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active Assignments for Writer */}
      {activeGigs.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-sky-500/20 bg-sky-500/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Truck size={20} />
            </div>
            <div>
              <h2 className="font-display font-600 text-ink">Active Assignments</h2>
              <p className="text-xs text-ink-subtle">Complete these to get paid</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGigs.map(gig => (
              <div key={gig.id} className="p-5 rounded-2xl bg-void/40 border border-glass-border flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">{gig.title}</p>
                  <p className="text-[10px] text-ink-muted uppercase tracking-wider">{gig.subject} • {gig.pages} pages</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gold-400">
                  <MapPin size={12} />
                  <span className="truncate">{gig.delivery_address}</span>
                </div>
                <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => setShowDeliverModal(gig)}>
                  Mark as Delivered
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Gigs Section */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-600 text-ink">New Opportunities</h2>
          <Link href="/dashboard/marketplace" className="text-xs text-violet-400">View all</Link>
        </div>
        <div className="space-y-3">
          {openGigs.map(gig => (
            <div key={gig.id} className="flex items-center justify-between p-4 rounded-2xl border border-glass-border">
              <div>
                <p className="text-sm font-medium text-ink">{gig.title}</p>
                <p className="text-xs text-ink-subtle">{gig.subject} • ₹{gig.price}</p>
              </div>
              <ChevronRight size={16} className="text-ink-subtle" />
            </div>
          ))}
        </div>
      </div>

      {/* Deliver Modal */}
      <AnimatePresence>
        {showDeliverModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={() => setShowDeliverModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md glass-card rounded-3xl p-8 border border-glass-border shadow-2xl">
              <h3 className="font-display text-xl font-700 text-ink mb-2">Submit Delivery</h3>
              <p className="text-xs text-ink-muted mb-6">Enter tracking details for: <span className="text-ink font-medium">{showDeliverModal.title}</span></p>
              
              <form onSubmit={handleSubmitDelivery} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1.5">Courier Tracking ID</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. EB123456789IN" 
                    value={deliveryData.trackingId}
                    onChange={e => setDeliveryData(prev => ({...prev, trackingId: e.target.value}))}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1.5">Proof Link (Optional)</label>
                  <input 
                    className="input-field" 
                    placeholder="Link to photo of receipt or PDF" 
                    value={deliveryData.proofUrl}
                    onChange={e => setDeliveryData(prev => ({...prev, proofUrl: e.target.value}))}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowDeliverModal(null)}>Cancel</Button>
                  <Button variant="primary" type="submit" loading={isSubmitting} className="flex-1 justify-center">Confirm Delivery</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomerDashboard({ user }) {
  const { gigs, assignWriter } = useMarketplace();
  const [activeExpands, setActiveExpands] = useState({}); // { gigId: boolean }
  const [applicants, setApplicants] = useState({}); // { gigId: [] }
  const myGigs = gigs.filter(g => g.customer_id === user.id);
  const supabase = createClient();

  const fetchApplicants = async (gigId) => {
    try {
      const { data, error } = await supabase
        .from('gig_applications')
        .select(`
          writer_id,
          profiles:writer_id(id, name, rating, avatar_url)
        `)
        .eq('gig_id', gigId);
      
      if (error) throw error;
      setApplicants(prev => ({ ...prev, [gigId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (gigId) => {
    if (!activeExpands[gigId]) fetchApplicants(gigId);
    setActiveExpands(prev => ({ ...prev, [gigId]: !prev[gigId] }));
  };

  const handleAssignWriter = async (gigId, writerId) => {
    await assignWriter(gigId, writerId);
    setActiveExpands(prev => ({ ...prev, [gigId]: false }));
  };

  const stats = [
    { label: 'Total Spent', value: formatCurrency(user.totalSpent || 0), icon: IndianRupee, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Active Orders', value: user.activeOrders || 0, icon: Clock, color: 'text-gold-400', bg: 'bg-gold-500/10', border: 'border-gold-500/20' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Writers Used', value: '8', icon: Award, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-muted mb-1">Welcome back,</p>
          <h1 className="font-display text-3xl font-800 text-ink">{user.name?.split(' ')[0]} 👋</h1>
        </div>
        <Link href="/dashboard/marketplace" className="btn-primary text-sm px-5 py-2.5">
          <Zap size={15} />
          Post Assignment
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`stat-card border ${stat.border}`}
          >
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <div className={`font-display text-2xl font-800 mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-ink-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* My Orders */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-600 text-ink">My Assignments</h2>
          <Link href="/dashboard/marketplace" className="btn-primary text-xs px-3 py-1.5">
            + Post New
          </Link>
        </div>

        {myGigs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={40} className="text-ink-subtle mx-auto mb-4" />
            <p className="text-ink-muted mb-2">No assignments yet</p>
            <p className="text-sm text-ink-subtle mb-6">Post your first assignment to get started</p>
            <Link href="/dashboard/marketplace" className="btn-primary text-sm">
              Post Assignment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myGigs.map((gig, i) => (
              <div key={gig.id} className="flex flex-col rounded-2xl border border-glass-border overflow-hidden">
                <div className="flex items-center justify-between p-5 bg-glass/20 transition-all">
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-1">{gig.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">{gig.subject}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                        gig.payment_status === 'pending_verification' ? 'bg-amber-500/15 text-amber-500 animate-pulse' :
                        gig.status === 'open' ? 'bg-violet-500/15 text-violet-400' :
                        gig.status === 'in-progress' ? 'bg-gold-500/15 text-gold-400 font-black' :
                        'bg-emerald-500/15 text-emerald-400'
                      }`}>{gig.payment_status === 'pending_verification' ? 'Verifying Payment' : gig.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-display font-800 text-ink">₹{gig.price}</p>
                      <p className="text-[10px] text-ink-subtle">{gig.delivery_type} delivery</p>
                    </div>
                    {gig.status === 'open' && (
                      <button 
                        onClick={() => toggleExpand(gig.id)}
                        className={`p-2 rounded-xl transition-all ${activeExpands[gig.id] ? 'bg-violet-500 text-white' : 'bg-glass border border-glass-border text-ink-subtle hover:text-ink'}`}
                      >
                        <Users size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Info for active/completed */}
                {(gig.status === 'in-progress' || gig.status === 'completed') && (
                  <div className="px-5 pb-5 pt-2 bg-void/20 border-t border-glass-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                        <Truck size={12} className="text-gold-400" />
                        <span>{gig.status === 'completed' ? 'Delivered via' : 'Shipping to:'} <b>{gig.delivery_address}</b></span>
                      </div>
                      {gig.tracking_id && (
                        <div className="flex items-center gap-2">
                          <span className="badge-gold text-[9px] px-2">ID: {gig.tracking_id}</span>
                          {gig.delivery_proof_url && (
                            <a href={gig.delivery_proof_url} target="_blank" className="text-violet-400 hover:underline text-[9px] flex items-center gap-1">
                              View Proof <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Applicants Drawer */}
                <AnimatePresence>
                  {activeExpands[gig.id] && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: 'auto' }} 
                      exit={{ height: 0 }}
                      className="bg-void/60 border-t border-glass-border overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <p className="text-[10px] font-bold text-ink-muted uppercase mb-2">Applicants ({applicants[gig.id]?.length || 0})</p>
                        {applicants[gig.id]?.length === 0 ? (
                          <p className="text-[10px] text-ink-subtle italic">No applicants yet. Check back soon!</p>
                        ) : (
                          applicants[gig.id]?.map(app => (
                            <div key={app.profiles.id} className="flex items-center justify-between p-3 rounded-xl bg-glass border border-glass-border/50">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-violet-400 text-xs">
                                  {app.profiles.name?.[0]}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-ink">{app.profiles.name}</p>
                                  <div className="flex items-center gap-1 text-[10px] text-gold-400">
                                    <Star size={10} fill="currentColor" /> {app.profiles.rating || 'New'}
                                  </div>
                                </div>
                              </div>
                              <Button variant="primary" size="sm" className="text-[10px] px-3 h-7" onClick={() => handleAssignWriter(gig.id, app.profiles.id)}>
                                Assign Task
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )
}
      </div>

      {/* Career Tools */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Resume Builder', desc: 'Land more interviews', href: '/dashboard/resume', icon: FileText },
          { label: 'Portfolio Maker', desc: 'Showcase your work', href: '/dashboard/portfolio', icon: Globe },
        ].map((tool) => (
          <Link key={tool.href} href={tool.href} className="glass-card rounded-2xl p-5 group hover:border-violet-500/25">
            <tool.icon size={20} className="text-violet-400 mb-3" />
            <p className="font-display font-600 text-sm text-ink mb-1">{tool.label}</p>
            <p className="text-xs text-ink-muted">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({ user }) {
  const { gigs, verifyGigPayment, themeRequests, verifyThemeUnlock } = useMarketplace();
  const [activeTab, setActiveTab] = useState('gigs');
  const [selectedProof, setSelectedProof] = useState(null);

  const pendingGigs = gigs.filter(g => g.payment_status === 'pending_verification');
  const pendingThemes = (themeRequests || []).filter(t => t.status === 'pending');

  const stats = [
    { label: 'Pending Gigs', value: pendingGigs.length, icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Theme Requests', value: pendingThemes.length, icon: Sparkles, color: 'text-gold-400', bg: 'bg-gold-500/10' },
    { label: 'Total Gigs', value: gigs.length, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">Central Command</p>
          <h1 className="font-display text-4xl font-900 text-ink tracking-tight">Admin <span className="gradient-text-gold">Dashboard</span></h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="glass-card p-6 border border-glass-border">
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 border border-glass-border`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className={`font-display text-3xl font-800 mb-1 ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-ink-muted uppercase font-bold tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Verification Tabs */}
      <div className="glass-card rounded-[2.5rem] p-8 border border-glass-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 p-1 bg-void/50 rounded-2xl border border-glass-border">
            {[
              { id: 'gigs', label: 'Gig Payments', count: pendingGigs.length },
              { id: 'themes', label: 'Theme Unlocks', count: pendingThemes.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                    : 'text-ink-subtle hover:text-ink'
                }`}
              >
                {tab.label}
                {tab.count > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">{tab.count}</span>}
              </button>
            ))}
          </div>
          <h2 className="font-display font-700 text-ink flex items-center gap-2 opacity-60">
            <ShieldCheck size={18} className="text-emerald-400" />
            Verification Queue
          </h2>
        </div>

        <div className="space-y-4">
          {activeTab === 'gigs' ? (
            pendingGigs.length === 0 ? (
              <EmptyQueue message="No pending gig payments" />
            ) : (
              pendingGigs.map(gig => (
                <VerificationCard 
                  key={gig.id}
                  id={gig.id}
                  title={gig.title}
                  amount={gig.price}
                  user={gig.profiles?.name}
                  txnId={gig.transaction_id}
                  proof={gig.payment_proof_url}
                  time={gig.created_at}
                  onApprove={() => verifyGigPayment(gig.id, 'paid')}
                  onReject={() => verifyGigPayment(gig.id, 'rejected')}
                  onViewProof={setSelectedProof}
                />
              ))
            )
          ) : (
            pendingThemes.length === 0 ? (
              <EmptyQueue message="No pending theme unlocks" />
            ) : (
              pendingThemes.map(req => (
                <VerificationCard 
                  key={req.id}
                  id={req.id}
                  title={`Unlock: ${req.theme_id}`}
                  amount={req.amount}
                  user={req.profiles?.name}
                  txnId={req.transaction_id}
                  proof={req.payment_proof_url}
                  time={req.created_at}
                  onApprove={() => verifyThemeUnlock(req.id, req.user_id, req.theme_id, 'approved')}
                  onReject={() => verifyThemeUnlock(req.id, req.user_id, req.theme_id, 'rejected')}
                  onViewProof={setSelectedProof}
                />
              ))
            )
          )}
        </div>
      </div>

      {/* Proof Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-void/90 backdrop-blur-md" onClick={() => setSelectedProof(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-2xl w-full glass-card rounded-[3rem] p-4 border border-glass-border shadow-3xl">
              <button 
                onClick={() => setSelectedProof(null)} 
                className="absolute -top-4 -right-4 p-4 rounded-full bg-violet-600 text-white shadow-2xl z-20 hover:scale-110 transition-transform active:scale-95"
              >
                <X size={20} />
              </button>
              <div className="rounded-[2.5rem] overflow-hidden bg-void">
                <img src={selectedProof} alt="Payment Proof" className="w-full h-auto" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for cleaner structure
function VerificationCard({ title, amount, user, txnId, proof, time, onApprove, onReject, onViewProof }) {
  return (
    <div className="p-6 rounded-3xl bg-void/40 border border-glass-border hover:border-violet-500/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-400/10 px-2.5 py-1 rounded-lg border border-violet-400/20">Payment Approval</span>
          <span className="text-[10px] font-bold text-ink-subtle italic flex items-center gap-1">
            <Clock size={10} /> {timeAgo(time || new Date())}
          </span>
        </div>
        <h3 className="text-base font-bold text-ink mb-1 group-hover:text-white transition-colors">{title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <p className="text-xs text-ink-muted">By: <span className="text-ink font-semibold">{user || 'Anonymous'}</span></p>
          <p className="text-xs text-ink-muted">Amount: <span className="text-gold-400 font-black">₹{amount}</span></p>
          <p className="text-xs text-ink-muted">Txn ID: <span className="text-sky-400 font-mono font-bold tracking-tight">{txnId || 'N/A'}</span></p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {proof && (
          <button 
            onClick={() => onViewProof(proof)}
            className="p-3 rounded-2xl bg-glass border border-glass-border text-ink-subtle hover:text-white hover:bg-glass transition-all h-12 w-12 flex items-center justify-center group/btn"
            title="View Proof"
          >
            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
        <button 
          onClick={onReject}
          className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all h-12 w-12 flex items-center justify-center group/btn"
          title="Reject Payment"
        >
          <ThumbsDown size={18} className="group-hover/btn:scale-110 transition-transform" />
        </button>
        <button 
          onClick={onApprove}
          className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:-translate-y-0.5 transition-all h-12 flex items-center gap-2"
        >
          <ThumbsUp size={16} />
          Approve Now
        </button>
      </div>
    </div>
  );
}

function EmptyQueue({ message }) {
  return (
    <div className="py-16 text-center bg-void/20 rounded-3xl border border-dashed border-glass-border">
      <div className="w-16 h-16 rounded-full bg-glass flex items-center justify-center mx-auto mb-4 border border-glass-border">
        <CheckCircle size={24} className="text-emerald-400/50" />
      </div>
      <p className="text-ink-muted text-sm font-semibold tracking-wide">{message}</p>
      <p className="text-[10px] text-ink-subtle uppercase tracking-widest mt-1">Status: All Clear</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, profile, isWriter, isAdmin } = useAuth();
  if (!user) return null;
  
  if (isAdmin) return <AdminDashboard user={profile} />;
  return isWriter ? <WriterDashboard user={profile} /> : <CustomerDashboard user={profile} />;
}
