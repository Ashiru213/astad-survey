
-- Allow public read of gallery + portfolio via signed URLs (SELECT policy still required for signed url endpoint)
CREATE POLICY "Public read portfolio objects" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Admins upload portfolio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update portfolio" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete portfolio" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio' AND has_role(auth.uid(), 'admin'));
