-- Create table for feedback/requests
CREATE TABLE public.feedback_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback (insert)
CREATE POLICY "Anyone can submit feedback"
ON public.feedback_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only staff and admins can view feedback
CREATE POLICY "Staff and admins can view feedback"
ON public.feedback_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- Only staff and admins can update feedback (mark as read)
CREATE POLICY "Staff and admins can update feedback"
ON public.feedback_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

-- Only admins can delete feedback
CREATE POLICY "Admins can delete feedback"
ON public.feedback_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));