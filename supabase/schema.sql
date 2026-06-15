-- Create roadmaps table
CREATE TABLE public.roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  domain text NOT NULL,
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  edges jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

-- Create policies for roadmaps table
-- Users can read only their own roadmaps
CREATE POLICY "Users can view their own roadmaps" 
  ON public.roadmaps 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own roadmaps
CREATE POLICY "Users can insert their own roadmaps" 
  ON public.roadmaps 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own roadmaps
CREATE POLICY "Users can update their own roadmaps" 
  ON public.roadmaps 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own roadmaps
CREATE POLICY "Users can delete their own roadmaps" 
  ON public.roadmaps 
  FOR DELETE 
  USING (auth.uid() = user_id);
