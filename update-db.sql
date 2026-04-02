-- 1. Update Gigs Table for Manual UPI Payments
ALTER TABLE public.gigs 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending_verification' CHECK (payment_status IN ('pending_verification', 'paid', 'rejected')),
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS delivery_address text,
ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'national' CHECK (delivery_type IN ('local', 'regional', 'national')),
ADD COLUMN IF NOT EXISTS delivery_proof_url text,
ADD COLUMN IF NOT EXISTS tracking_id text;

-- 2. Update Status Constraint to allow 'rejected'
ALTER TABLE public.gigs DROP CONSTRAINT IF EXISTS gigs_status_check;
ALTER TABLE public.gigs ADD CONSTRAINT gigs_status_check CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled', 'rejected'));

-- 3. Update Profiles Table for Wallet System
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS wallet_balance integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earnings integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS payout_info jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 4. Create Payout Requests Table
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  writer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  payout_method text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Writers can view own payout requests" ON public.payout_requests FOR SELECT USING (auth.uid() = writer_id);
CREATE POLICY "Writers can insert own payout requests" ON public.payout_requests FOR INSERT WITH CHECK (auth.uid() = writer_id);

-- 5. Atomic Balance Increment RPC (Safe Payouts)
CREATE OR REPLACE FUNCTION public.increment_writer_balance(writer_id uuid, amount integer)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    wallet_balance = COALESCE(wallet_balance, 0) + amount,
    total_earnings = COALESCE(total_earnings, 0) + amount,
    completed_gigs = COALESCE(completed_gigs, 0) + 1
  WHERE id = writer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
