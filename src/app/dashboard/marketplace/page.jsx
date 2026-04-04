'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Clock, Users, Zap, X, Plus,
  ChevronDown, Briefcase, BookOpen, AlertCircle, Check,
  IndianRupee, Calendar, Tag, Paperclip, FileText, MapPin,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { formatCurrency, timeAgo, SUBJECTS, calculateGigPrice, DELIVERY_RATES } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import UPIPaymentModal from '@/components/marketplace/UPIPaymentModal';

// GIG CARD
function GigCard({ gig, onApply, hasApplied, isWriter }) {
  const { user } = useAuth();
  const urgencyConfig = {
    express: { label: 'Express', class: 'bg-red-500/15 border-red-500/25 text-red-400' },
    urgent: { label: 'Urgent', class: 'bg-gold-500/15 border-gold-500/25 text-gold-400' },
    standard: { label: 'Standard', class: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' },
  };
  const urgency = urgencyConfig[gig.urgency] || urgencyConfig.standard;
  const deadline = new Date(gig.deadline);
  const hoursLeft = Math.max(0, Math.floor((deadline - Date.now()) / 3600000));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card rounded-3xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-600 text-base text-ink leading-snug mb-2 line-clamp-2">{gig.title}</h3>
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${urgency.class}`}>{urgency.label}</span>
            <span className="badge-violet text-xs px-2.5 py-0.5">{gig.subject}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-800 text-xl text-gold-400">₹{gig.price}</p>
          <p className="text-xs text-ink-subtle">{gig.pages} pages</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{gig.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {gig.tags?.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-lg bg-glass border border-glass-border text-ink-subtle">
            {tag}
          </span>
        ))}
      </div>

      {/* Assignment Question / Reference */}
      {gig.question && (
        <div className="bg-glass border border-glass-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={13} className="text-violet-400" />
            <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">Specific Question</span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 italic">
            "{gig.question}"
          </p>
        </div>
      )}

      {/* Delivery Address (Secret) */}
      {(user?.id === gig.customer_id || user?.id === gig.assigned_to) && gig.delivery_address && (
        <div className="bg-gold-500/5 border border-gold-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={13} className="text-gold-400" />
            <span className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider">Delivery Destination</span>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            {gig.delivery_address}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-glass-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <Users size={12} />
            <span>{gig.applicants} applied</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <Clock size={12} />
            <span>{hoursLeft}h left</span>
          </div>
        </div>

        {isWriter && (
          hasApplied ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <Check size={13} />
              Applied
            </div>
          ) : (
            <div className="flex gap-2">
              {gig.attachment && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="px-2.5" 
                  title={`View attachment: ${gig.attachment}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Opening attachment: ${gig.attachment}`);
                  }}
                >
                  <Paperclip size={13} />
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApply(gig.id)}
                className="text-xs"
              >
                Apply Now
              </Button>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

// POST GIG MODAL
function PostGigModal({ onClose, onSubmit }) {
  const { user, profile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [showUPIModal, setShowUPIModal] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    pages: 5,
    urgency: 'standard',
    deadline: '',
    question: '',
    delivery_address: '',
    delivery_type: 'digital',
    phone: '',
    attachment: null,
  });

  useEffect(() => {
    if (profile?.phone) {
      setForm(prev => ({ ...prev, phone: profile.phone }));
    }
  }, [profile]);

  const pricing = useMemo(() => {
    return calculateGigPrice(form.pages, form.urgency, form.delivery_type);
  }, [form.pages, form.urgency, form.delivery_type]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `assignments/${user?.id || 'temp'}/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('assignment-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('assignment-attachments')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.description || !form.deadline || !form.delivery_address) {
      toast.error('Please fill all required fields (including address)');
      return;
    }

    setLoading(true);
    try {
      // 1. Trigger UPI Payment Modal
      setShowUPIModal(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to initiate payment');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (proofUrl, transactionId, couponUsed) => {
    setLoading(true);
    try {
      // 2. Upload Assignment File if exists (Logic moved here)
      let attachmentUrl = null;
      if (form.attachment instanceof File) {
        attachmentUrl = await handleUpload(form.attachment);
      }

      // 3. Post to Database with Payment Info
      const isFree = couponUsed === 'FREEHUB';
      await onSubmit({ 
        ...form, 
        price: isFree ? 0 : pricing.total,
        base_price: isFree ? 0 : pricing.base,
        delivery_charge: isFree ? 0 : pricing.deliveryCharge,
        service_fee: isFree ? 0 : pricing.serviceFee,
        attachment_url: attachmentUrl,
        delivery_type: form.delivery_type,
        payment_proof_url: proofUrl,
        transaction_id: transactionId,
        coupon_used: couponUsed || null
      });

      setShowUPIModal(false);
      onClose();
    } catch (err) {
      toast.error('Submission failed after payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl glass-card rounded-3xl p-8 border border-glass-border shadow-premium max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-xl font-700 text-ink">Post an Assignment</h2>
            <p className="text-xs text-ink-muted mt-1">Find a skilled writer for your needs</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-glass text-ink-subtle hover:text-ink transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Assignment Title</label>
            <input
              className="input-field"
              placeholder="e.g. Calculus Assignment - Chapter 5 Integration"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Subject Name</label>
            <input
              className="input-field"
              placeholder="Type Subject (e.g. Mathematics, OS, etc.)"
              value={form.subject}
              onChange={e => handleChange('subject', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Assignment Overview</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Provide a general summary of the project..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              required
            />
          </div>

          {/* Specific Question / Content */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Specific Assignment Quest/Detail</label>
            <textarea
              className="input-field resize-none border-dashed border-violet-500/30 bg-violet-500/5 focus:bg-violet-500/10"
              rows={4}
              placeholder="Paste your questions or exact request here..."
              value={form.question}
              onChange={e => handleChange('question', e.target.value)}
              required
            />
          </div>

          {/* WhatsApp / Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-2">
              <Smartphone size={13} className="text-violet-400" />
              Your WhatsApp / Phone Number
            </label>
            <input
              className="input-field"
              placeholder="+91 00000 00000"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              required
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2 flex items-center gap-2">
              <MapPin size={13} className="text-violet-400" />
              {form.delivery_type === 'digital' ? 'Delivery Details (Email/WhatsApp)' : 'Physical Delivery Address'} (Visible only to assigned writer)
            </label>
            <textarea
              className="input-field resize-none bg-gold-400/5 focus:bg-gold-400/10"
              rows={3}
              placeholder={form.delivery_type === 'digital' ? 'Enter WhatsApp number or Email to receive the work...' : 'Enter complete address for handwritten assignment delivery...'}
              value={form.delivery_address}
              onChange={e => handleChange('delivery_address', e.target.value)}
              required
            />
          </div>

          {/* Delivery Zone */}
          <div className="bg-glass/50 rounded-2xl p-4 border border-glass-border">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3 flex items-center justify-between">
              Delivery Destination Zone
              <span className="text-[10px] lowercase font-normal italic opacity-60">*affects delivery charge</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'digital', label: 'Digital', desc: 'Email/PDF' },
                { id: 'local', label: 'Local', desc: 'Same City' },
                { id: 'regional', label: 'Regional', desc: 'Same State' },
                { id: 'national', label: 'National', desc: 'Pan India' },
              ].map(zone => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleChange('delivery_type', zone.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    form.delivery_type === zone.id 
                      ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10' 
                      : 'border-glass-border hover:border-violet-500/30 bg-glass/30 hover:bg-glass'
                  }`}
                >
                  <p className={`text-xs font-bold ${form.delivery_type === zone.id ? 'text-violet-400' : 'text-ink'}`}>{zone.label}</p>
                  <p className="text-[10px] text-ink-muted mt-0.5">{zone.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Reference PDF Attachment (Optional)</label>
            <div className="relative group/upload">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleChange('attachment', file);
                }}
              />
              <label
                htmlFor="pdf-upload"
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  form.attachment
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'
                }`}
              >
                {form.attachment ? (
                  <div className="flex flex-col items-center text-center">
                    <FileText className="text-emerald-400 mb-2" size={24} />
                    <span className="text-xs text-ink font-medium">{form.attachment.name}</span>
                    <button 
                      type="button" 
                      className="text-[10px] text-ink-muted hover:text-red-400 mt-2 flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleChange('attachment', null);
                      }}
                    >
                      <X size={10} /> Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <Paperclip className="text-ink-subtle mb-2 group-hover/upload:text-violet-400 transition-colors" size={20} />
                    <span className="text-xs text-ink-muted group-hover/upload:text-ink-subtle">Click to upload reference PDF</span>
                    <span className="text-[10px] text-ink-subtle mt-1">Maximum size: 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Pages & Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">
                Pages: <span className="text-violet-400 normal-case">{form.pages}</span>
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={form.pages}
                onChange={e => handleChange('pages', parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-[10px] text-ink-subtle mt-1.5 px-0.5">
                <span>1 Page</span>
                <span className="italic opacity-60">1 Page ≈ 250 words / 2-3 questions</span>
                <span>50</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Urgency</label>
              <div className="space-y-2">
                {[
                  { id: 'standard', label: 'Standard (1x)', desc: '5+ days' },
                  { id: 'urgent', label: 'Urgent (1.5x)', desc: '2–4 days' },
                  { id: 'express', label: 'Express (2x)', desc: '< 24 hours' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.id}
                      checked={form.urgency === opt.id}
                      onChange={() => handleChange('urgency', opt.id)}
                      className="accent-violet-500"
                    />
                    <span className="text-xs text-ink-muted">{opt.label}</span>
                    <span className="text-xs text-ink-subtle ml-auto">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-widest mb-2">Deadline</label>
            <input
              type="datetime-local"
              className="input-field"
              value={form.deadline}
              onChange={e => handleChange('deadline', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          {/* Price Preview */}
          <div className="glass-strong rounded-2xl p-5 border border-gold-400/20 shadow-lg">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-glass-border">
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">Payment Breakdown</p>
                <p className="text-[10px] text-ink-subtle mt-0.5">Secure direct UPI payment for verification</p>
              </div>
              <Zap size={16} className="text-gold-400 animate-pulse" />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted">Assignment Cost ({form.pages} pgs)</span>
                <span className="text-ink font-medium">₹{pricing.base}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted">{form.delivery_type === 'digital' ? 'Digital Handling Fee' : 'Courier & Logistics Fee'}</span>
                <span className="text-ink font-medium">₹{pricing.deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted">Platform Service Fee (10%)</span>
                <span className="text-gold-400 font-medium">+ ₹{pricing.serviceFee}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-glass-border">
              <p className="font-display text-xs font-700 text-ink">Final Amount</p>
              <p className="font-display text-3xl font-800 gradient-text-gold">₹{pricing.total}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1 justify-center">Cancel</Button>
            <Button variant="primary" type="submit" loading={loading} className="flex-1 justify-center gap-2">
              <Zap size={15} />
              Pay & Post Assignment
            </Button>
          </div>

          <p className="text-[10px] text-center text-ink-subtle mt-2">
            Funds will be held securely until the assignment is successfully completed.
          </p>
        </form>
      </motion.div>

      {/* UPI Payment Modal Integration */}
      <AnimatePresence>
        {showUPIModal && (
          <UPIPaymentModal
            key="upi-payment-modal"
            amount={pricing.total}
            gigTitle={form.title}
            onClose={() => setShowUPIModal(false)}
            onPaymentComplete={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// MAIN PAGE
export default function MarketplacePage() {
  const { user, isWriter, isCustomer } = useAuth();
  const { filteredGigs, appliedGigs, filter, setFilter, postGig, applyToGig } = useMarketplace();
  const [search, setSearch] = useState('');
  const [showPost, setShowPost] = useState(false);

  const displayedGigs = filteredGigs.filter(g =>
    !search || 
    g.title?.toLowerCase().includes(search.toLowerCase()) ||
    g.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePostGig = (gigData) => {
    postGig(gigData, user);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Assignment Marketplace</h1>
          <p className="text-sm text-ink-muted mt-1">
            {isWriter ? 'Browse and claim available assignments' : 'Post your assignment requirements'}
          </p>
        </div>
        {isCustomer && (
          <Button variant="primary" onClick={() => setShowPost(true)}>
            <Plus size={15} />
            Post Assignment
          </Button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            className="input-field pl-10 py-2.5"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Subject Filter */}
        <select
          className="input-field py-2.5 text-sm w-full sm:w-44"
          value={filter.subject}
          onChange={e => setFilter(prev => ({ ...prev, subject: e.target.value }))}
          style={{ appearance: 'none' }}
        >
          <option value="all">All Subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Urgency Filter */}
        <select
          className="input-field py-2.5 text-sm w-full sm:w-36"
          value={filter.urgency}
          onChange={e => setFilter(prev => ({ ...prev, urgency: e.target.value }))}
          style={{ appearance: 'none' }}
        >
          <option value="all">All Urgency</option>
          <option value="standard">Standard</option>
          <option value="urgent">Urgent</option>
          <option value="express">Express</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-ink-muted">
          <span className="text-ink font-medium">{displayedGigs.length}</span> assignments available
        </p>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="flex items-center gap-1 text-xs text-ink-subtle hover:text-ink-muted transition-colors"
          >
            <X size={11} /> Clear search
          </button>
        )}
      </div>

      {/* Gigs Grid */}
      {displayedGigs.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <Briefcase size={48} className="text-ink-subtle mx-auto mb-4" />
          <p className="font-display font-600 text-ink mb-2">No assignments found</p>
          <p className="text-sm text-ink-muted">
            {isCustomer ? 'Be the first to post an assignment!' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {displayedGigs.map(gig => (
              <GigCard
                key={gig.id}
                gig={gig}
                isWriter={isWriter}
                hasApplied={appliedGigs.includes(gig.id)}
                onApply={applyToGig}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Post Modal */}
      <AnimatePresence>
        {showPost && (
          <PostGigModal
            key="post-gig-modal"
            onClose={() => setShowPost(false)}
            onSubmit={handlePostGig}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
