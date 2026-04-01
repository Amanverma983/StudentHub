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
      
      // Format data to match UI expectations
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

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

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
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Assignment posted successfully!');
      fetchGigs(); // Refresh list
      return data;
    } catch (err) {
      toast.error('Failed to post assignment');
      console.error(err);
      return null;
    }
  }, [fetchGigs]);

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
      const { error } = await supabase
        .from('gigs')
        .update({
          status: 'completed',
          tracking_id: deliveryData.trackingId,
          delivery_proof_url: deliveryData.proofUrl,
        })
        .eq('id', gigId);

      if (error) throw error;

      toast.success('Work delivered successfully!');
      fetchGigs();
    } catch (err) {
      toast.error('Failed to submit delivery');
    }
  }, [fetchGigs]);

  const getMyGigs = useCallback((userId, role) => {
    if (role === 'customer') return gigs.filter(g => g.customer_id === userId);
    if (role === 'writer') return gigs.filter(g => g.assigned_to === userId);
    return [];
  }, [gigs]);

  const filteredGigs = gigs.filter(g => {
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
      applyToGig,
      assignWriter,
      submitDelivery,
      getMyGigs,
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
