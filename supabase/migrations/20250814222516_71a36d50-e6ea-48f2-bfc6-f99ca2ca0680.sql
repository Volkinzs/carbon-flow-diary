-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'BR',
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create carbon estimates table
CREATE TABLE public.carbon_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  estimate_type TEXT NOT NULL, -- electricity, flight, vehicle, shipping, fuel_combustion
  estimate_data JSONB NOT NULL, -- store the original request data
  carbon_g DECIMAL NOT NULL,
  carbon_kg DECIMAL NOT NULL,
  carbon_mt DECIMAL NOT NULL,
  estimated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user habits table (expanded)
CREATE TABLE public.user_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transportation JSONB,
  energy JSONB,
  diet JSONB,
  consumption JSONB,
  travel JSONB,
  housing JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for carbon estimates
CREATE POLICY "Users can view their own estimates" ON public.carbon_estimates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own estimates" ON public.carbon_estimates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for user habits
CREATE POLICY "Users can view their own habits" ON public.user_habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON public.user_habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON public.user_habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public policies for ranking (anonymized data)
CREATE POLICY "Everyone can view profile names for ranking" ON public.profiles
  FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_habits_updated_at
  BEFORE UPDATE ON public.user_habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();