'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

const MarketplaceContext = createContext(null);
const supabase = createClient();

export function MarketplaceProvider({ children }) {
  const [gigs, setGigs] = useState([]);
  const [appliedGigs, setAppliedGigs] = useState([]);
  const [filter, setFilter] = useState({ subject: 'all', urgency: 'all', status: 'open' });
  const [loading, setLoading] = useState(true);
  const [themeRequests, setThemeRequests] = useState([]);

  // Fetch Gigs
  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select(`
          *,
          profiles:customer_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = data.map(g => ({
        ...g,
        customerName: g.profiles?.name || 'User',
        postedAt: g.created_at,
      }));

      setGigs(formatted);
    } catch (err) {
      console.error('Error fetching gigs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Theme Requests
  const fetchThemeRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('theme_unlock_requests')
        .select(`
          *,
          profiles:user_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThemeRequests(data);
    } catch (err) {
      console.error('Error fetching theme requests:', err);
    }
  }, []);

  useEffect(() => {
    fetchGigs();
    fetchThemeRequests();
  }, [fetchGigs, fetchThemeRequests]);

  const postGig = useCallback(async (gigData, user) => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .insert([{
          title: gigData.title,
          subject: gigData.subject,
          description: gigData.description,
          pages: gigData.pages,
          price: gigData.price,
          deadline: gigData.deadline,
          urgency: gigData.urgency,
          customer_id: user.id,
          tags: [gigData.subject, ...(gigData.attachment ? ['📎 Attachment'] : [])],
          question: gigData.question,
          attachment_url: gigData.attachment_url || null,
          delivery_address: gigData.delivery_address,
          delivery_type: gigData.delivery_type || 'national',
          payment_status: 'pending_verification', // New field
          payment_proof_url: gigData.payment_proof_url || null, // New field
          transaction_id: gigData.transaction_id || null, // New field
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Assignment submitted for verification!');
      fetchGigs();
      return data;
    } catch (err) {
      toast.error('Failed to post assignment');
      console.error(err);
      return null;
    }
  }, [fetchGigs]);

  const uploadPaymentProof = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading proof:', err);
      toast.error('Failed to upload screenshot');
      return null;
    }
  };

  const verifyGigPayment = useCallback(async (gigId, status = 'paid') => {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({
          payment_status: status,
          status: status === 'paid' ? 'open' : 'rejected'
        })
        .eq('id', gigId);

      if (error) throw error;

      toast.success(status === 'paid' ? 'Payment Verified! Gig is now live.' : 'Payment Rejected.');
      fetchGigs();
    } catch (err) {
      toast.error('Verification failed');
    }
  }, [fetchGigs]);

  const verifyThemeUnlock = useCallback(async (requestId, userId, themeId, status = 'approved') => {
    try {
      const { error: reqError } = await supabase
        .from('theme_unlock_requests')
        .update({ status })
        .eq('id', requestId);

      if (reqError) throw reqError;

      if (status === 'approved') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('unlocked_themes')
          .eq('id', userId)
          .single();

        let newThemes = profile.unlocked_themes || [];
        if (themeId === 'bundle') {
          newThemes = [...new Set([...newThemes, '3d-glass', '3d-cyber'])];
        } else if (!newThemes.includes(themeId)) {
          newThemes.push(themeId);
        }

        await supabase
          .from('profiles')
          .update({ unlocked_themes: newThemes })
          .eq('id', userId);

        toast.success('Theme unlocked for user!');
      } else {
        toast.error('Theme request rejected');
      }

      fetchThemeRequests();
    } catch (err) {
      console.error(err);
      toast.error('Verification failed');
    }
  }, [fetchThemeRequests]);

  const applyToGig = useCallback(async (gigId, writerId) => {
    try {
      const { error } = await supabase
        .from('gig_applications')
        .insert([{ gig_id: gigId, writer_id: writerId }]);

      if (error) throw error;

      setAppliedGigs(prev => [...prev, gigId]);
      toast.success('Application submitted!');
      fetchGigs();
    } catch (err) {
      toast.error('already applied or error occurred');
    }
  }, [fetchGigs]);

  const assignWriter = useCallback(async (gigId, writerId) => {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({
          assigned_to: writerId,
          status: 'in-progress'
        })
        .eq('id', gigId);

      if (error) throw error;

      toast.success('Writer assigned! Work is now in-progress.');
      fetchGigs();
    } catch (err) {
      toast.error('Failed to assign writer');
    }
  }, [fetchGigs]);

  const submitDelivery = useCallback(async (gigId, deliveryData) => {
    try {
      // 1. Get Gig Details (Price & Writer ID)
      const { data: gig, error: fetchErr } = await supabase
        .from('gigs')
        .select('price, assigned_to')
        .eq('id', gigId)
        .single();

      if (fetchErr) throw fetchErr;

      const writerShare = Math.floor(gig.price * 0.9); // 90% to writer, 10% to admin

      // 2. Mark Gig as Completed
      const { error: gigErr } = await supabase
        .from('gigs')
        .update({
          status: 'completed',
          tracking_id: deliveryData.trackingId,
          delivery_proof_url: deliveryData.proofUrl,
        })
        .eq('id', gigId);

      if (gigErr) throw gigErr;

      // 3. Credit Writer's Wallet
      const { error: walletErr } = await supabase.rpc('increment_writer_balance', {
        writer_id: gig.assigned_to,
        amount: writerShare
      });

      // Fallback if RPC doesn't exist yet (manual update)
      if (walletErr) {
        const { data: profile } = await supabase.from('profiles').select('wallet_balance, total_earnings, completed_gigs').eq('id', gig.assigned_to).single();
        await supabase.from('profiles').update({
          wallet_balance: (profile.wallet_balance || 0) + writerShare,
          total_earnings: (profile.total_earnings || 0) + writerShare,
          completed_gigs: (profile.completed_gigs || 0) + 1
        }).eq('id', gig.assigned_to);
      }

      toast.success(`Work delivered! ₹${writerShare} credited to your wallet.`);
      fetchGigs();
    } catch (err) {
      toast.error('Failed to submit delivery');
      console.error(err);
    }
  }, [fetchGigs]);

  const requestPayout = useCallback(async (writerId, amount, payoutMethod) => {
    try {
      // 1. Check balance first
      const { data: profile, error: balErr } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', writerId)
        .single();

      if (balErr) throw balErr;
      if (profile.wallet_balance < amount) {
        toast.error('Insufficient balance');
        return false;
      }

      // 2. Create payout request
      const { error: reqErr } = await supabase
        .from('payout_requests')
        .insert([{
          writer_id: writerId,
          amount: amount,
          payout_method: payoutMethod,
          status: 'pending'
        }]);

      if (reqErr) throw reqErr;

      // 3. Deduct from wallet balance
      await supabase.from('profiles').update({
        wallet_balance: profile.wallet_balance - amount
      }).eq('id', writerId);

      toast.success('Withdrawal request submitted!');
      return true;
    } catch (err) {
      toast.error('Payout request failed');
      return false;
    }
  }, []);

  const updatePayoutInfo = useCallback(async (userId, info) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ payout_info: info })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Payout details saved!');
    } catch (err) {
      toast.error('Failed to save details');
    }
  }, []);

  const getMyGigs = useCallback((userId, role) => {
    if (role === 'customer') return gigs.filter(g => g.customer_id === userId);
    if (role === 'writer') return gigs.filter(g => g.assigned_to === userId);
    return [];
  }, [gigs]);

  const filteredGigs = gigs.filter(g => {
    // Only show "Verified & Paid" gigs to writers, unless filtering for specific status
    if (filter.status === 'open' && g.payment_status !== 'paid') return false;

    if (filter.subject !== 'all' && g.subject !== filter.subject) return false;
    if (filter.urgency !== 'all' && g.urgency !== filter.urgency) return false;
    if (filter.status !== 'all' && g.status !== filter.status) return false;
    return true;
  });

  return (
    <MarketplaceContext.Provider value={{
      gigs,
      filteredGigs,
      appliedGigs,
      filter,
      setFilter,
      postGig,
      uploadPaymentProof,
      verifyGigPayment,
      applyToGig,
      assignWriter,
      submitDelivery,
      getMyGigs,
      requestPayout,
      updatePayoutInfo,
      themeRequests,
      verifyThemeUnlock,
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return ctx;
}
