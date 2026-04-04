-- Create necessary storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('payments', 'payments', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('assignment-attachments', 'assignment-attachments', true) ON CONFLICT DO NOTHING;

-- Set up policies for 'payments' bucket
CREATE POLICY "Allow authenticated uploads to payments" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payments');
CREATE POLICY "Allow public read from payments" ON storage.objects FOR SELECT TO public USING (bucket_id = 'payments');
CREATE POLICY "Allow authenticated updates to payments" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'payments');

-- Set up policies for 'assignment-attachments' bucket
CREATE POLICY "Allow authenticated uploads to assignment attachments" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'assignment-attachments');
CREATE POLICY "Allow public read from assignment attachments" ON storage.objects FOR SELECT TO public USING (bucket_id = 'assignment-attachments');
CREATE POLICY "Allow authenticated updates to assignment attachments" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'assignment-attachments');
