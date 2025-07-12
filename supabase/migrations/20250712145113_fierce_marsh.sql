/*
  # Initial Schema for Rentory Platform

  1. New Tables
    - `profiles` - User profiles for both renters and landlords
    - `properties` - Property listings
    - `property_images` - Property image storage
    - `property_amenities` - Property amenities junction table
    - `applications` - Rental applications
    - `messages` - Real-time messaging between users
    - `conversations` - Message conversation threads
    - `saved_properties` - User saved/favorited properties
    - `reviews` - Property and landlord reviews

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Functions
    - Auto-create profile on user signup
    - Update timestamps automatically
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_type AS ENUM ('renter', 'landlord', 'agent');
CREATE TYPE property_type AS ENUM ('apartment', 'duplex', 'flat', 'villa', 'house', 'mansion', 'bungalow', 'penthouse', 'studio');
CREATE TYPE property_status AS ENUM ('available', 'rented', 'maintenance', 'draft');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  user_type user_type NOT NULL DEFAULT 'renter',
  avatar_url text,
  verification_status verification_status DEFAULT 'pending',
  date_of_birth date,
  occupation text,
  monthly_income numeric,
  bio text,
  address text,
  city text,
  state text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  property_type property_type NOT NULL,
  status property_status DEFAULT 'draft',
  price numeric NOT NULL,
  negotiable boolean DEFAULT false,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  toilets integer,
  size_sqm numeric,
  furnished boolean DEFAULT false,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  landmark text,
  latitude numeric,
  longitude numeric,
  available_from date,
  minimum_stay text,
  maximum_stay text,
  caution_fee numeric,
  agent_fee numeric,
  legal_fee numeric,
  inspection_fee numeric DEFAULT 0,
  views_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  verification_status verification_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Property amenities table
CREATE TABLE IF NOT EXISTS property_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  amenity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status application_status DEFAULT 'pending',
  move_in_date date,
  employment_status text,
  employer_name text,
  monthly_income numeric,
  previous_address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  additional_notes text,
  documents jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 uuid REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 uuid REFERENCES profiles(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_1, participant_2, property_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text',
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Saved properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  landlord_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  verified_stay boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Anyone can view available properties" ON properties FOR SELECT USING (status = 'available' OR status = 'rented');
CREATE POLICY "Landlords can manage own properties" ON properties FOR ALL TO authenticated USING (landlord_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Landlords can insert properties" ON properties FOR INSERT TO authenticated WITH CHECK (landlord_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Property images policies
CREATE POLICY "Anyone can view property images" ON property_images FOR SELECT USING (true);
CREATE POLICY "Property owners can manage images" ON property_images FOR ALL TO authenticated USING (
  property_id IN (SELECT id FROM properties WHERE landlord_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);

-- Property amenities policies
CREATE POLICY "Anyone can view amenities" ON property_amenities FOR SELECT USING (true);
CREATE POLICY "Property owners can manage amenities" ON property_amenities FOR ALL TO authenticated USING (
  property_id IN (SELECT id FROM properties WHERE landlord_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications FOR SELECT TO authenticated USING (
  applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  property_id IN (SELECT id FROM properties WHERE landlord_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Renters can create applications" ON applications FOR INSERT TO authenticated WITH CHECK (
  applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE TO authenticated USING (
  applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  property_id IN (SELECT id FROM properties WHERE landlord_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT TO authenticated USING (
  participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (
  participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
  participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Messages policies
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT TO authenticated USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE 
    participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated WITH CHECK (
  sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) AND
  conversation_id IN (
    SELECT id FROM conversations WHERE 
    participant_1 IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    participant_2 IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
);

-- Saved properties policies
CREATE POLICY "Users can view own saved properties" ON saved_properties FOR SELECT TO authenticated USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can manage own saved properties" ON saved_properties FOR ALL TO authenticated USING (
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (
  reviewer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE TO authenticated USING (
  reviewer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city_state ON properties(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_landlord_id ON properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_applications_property_id ON applications(property_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);