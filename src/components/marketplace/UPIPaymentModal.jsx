'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Smartphone, Link as LinkIcon, 
  Copy, Image as ImageIcon, Loader2, AlertCircle,
  QrCode, Info, ShieldCheck, IndianRupee
} from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const ADMIN_UPI = process.env.NEXT_PUBLIC_ADMIN_UPI_ID || '9838807489@ptyes';

export default function UPIPaymentModal({ amount, gigTitle, note, onClose, onPaymentComplete }) {
  const { user, profile } = useAuth();
  const { uploadPaymentProof } = useMarketplace();
  const [proof, setProof] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Coupon Logic
  const [coupon, setCoupon] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const checkCoupon = () => {
    if (coupon.toUpperCase() === 'FREEHUB') {
      const used = profile?.used_coupons || [];
      if (used.includes('FREEHUB')) {
        toast.error('You have already used this coupon!');
        setIsCouponApplied(false);
      } else {
        toast.success('Coupon FREEHUB applied! Assignment is now FREE.');
        setIsCouponApplied(true);
      }
    } else {
      toast.error('Invalid coupon code');
      setIsCouponApplied(false);
    }
  };

  // Generate UPI URI
  const finalAmount = isCouponApplied ? 0 : amount;
  const paymentNote = note || `Payment for ${gigTitle?.slice(0, 20) || 'StudentHub'}`;
  const upiUri = `upi://pay?pa=${ADMIN_UPI}&pn=StudentHub&am=${finalAmount}&tn=${encodeURIComponent(paymentNote)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(ADMIN_UPI);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('UPI ID copied!');
  };

  const handleSubmitProof = async () => {
    setIsUploading(true);
    try {
      if (isCouponApplied) {
        await onPaymentComplete('FREE_COUPON', 'FREEHUB-' + Date.now(), 'FREEHUB');
        return;
      }

      if (!proof) return toast.error('Please upload payment screenshot');
      if (!transactionId) return toast.error('Please enter Transaction ID');

      const publicUrl = await uploadPaymentProof(proof);
      if (publicUrl) {
        await onPaymentComplete(publicUrl, transactionId);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to complete action');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-void/90 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg glass-card rounded-[2.5rem] p-6 border border-glass-border shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 p-12 bg-violet-600/10 blur-[100px] rounded-full" />
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl bg-glass border border-glass-border text-ink-subtle hover:text-ink transition-all">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-800 text-ink">{isCouponApplied ? '🎁 Coupon Applied' : 'Free Checkout'}</h3>
            <p className="text-xs text-ink-muted">{isCouponApplied ? 'You are posting for FREE' : 'Scan & Pay via UPI (No Gateway Fees)'}</p>
          </div>
        </div>

        {/* Coupon Input */}
        <div className="mb-6 p-4 rounded-3xl bg-violet-500/5 border border-violet-500/20">
          <label className="block text-[10px] font-black uppercase text-violet-400 tracking-widest mb-2">Have a Coupon?</label>
          <div className="flex gap-2">
            <input 
              className="input-field py-2 text-xs" 
              placeholder="Enter code (e.g. FREEHUB)" 
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              disabled={isCouponApplied}
            />
            <Button size="sm" onClick={checkCoupon} disabled={isCouponApplied || !coupon}>
              {isCouponApplied ? <Check size={14} className="text-emerald-400" /> : 'Apply'}
            </Button>
          </div>
        </div>

        {!isCouponApplied && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-3xl shadow-xl shadow-black/20">
                <img src={qrUrl} alt="UPI QR" className="w-40 h-40" />
              </div>
              <div className="mt-4 flex flex-col items-center">
                <p className="text-[10px] text-ink-subtle uppercase tracking-widest font-bold mb-1">Amount to Pay</p>
                <h4 className="text-3xl font-display font-900 text-gold-400">₹{amount}</h4>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-void/40 border border-glass-border">
                <p className="text-[10px] font-black uppercase text-violet-400 tracking-widest mb-1">Direct UPI ID</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">{ADMIN_UPI}</span>
                  <button onClick={handleCopyUPI} className="p-1.5 hover:bg-glass rounded-lg text-ink-subtle hover:text-white transition-all">
                    {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-ink">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>100% Secure Transfer</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-subtle">
                  <Info size={14} className="text-violet-400" />
                  <span>Screenshots are for verification only</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="pt-8 border-t border-glass-border space-y-5">
           <div className={`${isCouponApplied ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
            <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">Upload Payment Screenshot</label>
            <div className="relative group/upload">
              <input 
                type="file" 
                className="hidden" 
                id="proof-upload" 
                accept="image/*"
                onChange={e => setProof(e.target.files?.[0])}
              />
              <label 
                htmlFor="proof-upload"
                className={`flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  proof ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${proof ? 'bg-emerald-500/20 text-emerald-400' : 'bg-glass text-ink-subtle'}`}>
                  <ImageIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{proof ? proof.name : 'Choose payment screenshot'}</p>
                  <p className="text-[10px] text-ink-subtle">Click to browse gallery</p>
                </div>
                {proof && <Check size={16} className="text-emerald-400 shrink-0" />}
              </label>
            </div>
          </div>

          <div className={`${isCouponApplied ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
            <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">Transaction/Ref ID</label>
            <input 
              className="input-field py-4 font-mono font-bold tracking-widest" 
              placeholder="e.g. 3456781290" 
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
              required
            />
          </div>

          <Button 
            variant="gold" 
            size="lg" 
            className="w-full justify-center py-4"
            disabled={(!isCouponApplied && (!proof || !transactionId)) || isUploading}
            onClick={handleSubmitProof}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                {isCouponApplied ? 'Applying Coupon...' : 'Submitting Proof...'}
              </>
            ) : (
              isCouponApplied ? '🎁 Claim Free Assignment' : 'Submit Payment Proof'
            )}
          </Button>
          {!isCouponApplied && (
            <p className="text-center text-[10px] text-ink-subtle">Admin will verify this payment within 15-30 minutes.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
