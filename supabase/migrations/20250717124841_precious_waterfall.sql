/*
  # Initial Database Schema for Rentory Platform

  This migration creates the complete database schema for the Rentory rental platform,
  including all tables, functions, triggers, and Row Level Security (RLS) policies.

  ## Tables Created:
  1. profiles - User profiles with role-based access
  2. properties - Property listings
  3. applications - Rental applications
  4. conversations - Message conversations
  5. messages - Individual messages
  6. saved_properties - User saved properties
  7. notifications - System notifications
  8. admins - Admin-specific data
  9. agents - Agent-specific data

  ## Security:
  - RLS enabled on all tables
  - Role-based access policies
  - Automatic user profile creation on registration
  - Email notification triggers
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('admin', 'landlord', 'agent', 'tenant');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE property_status_enum AS ENUM ('available', 'rented', 'maintenance', 'draft');
CREATE TYPE application_status_enum AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
CREATE TYPE notification_type_enum AS ENUM ('application', 'message', 'property_update', 'system');

-- =============================================
-- TABLES
-- =============================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type user_type_enum NOT NULL DEFAULT 'tenant',
    is_super_admin BOOLEAN DEFAULT FALSE,
    managed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    verification_status verification_status_enum DEFAULT 'pending',
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    email TEXT, -- Cached from auth.users for easier queries
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_super_admin CHECK (
        (is_super_admin = TRUE AND user_type = 'admin') OR 
        (is_super_admin = FALSE)
    ),
    CONSTRAINT valid_managed_by CHECK (
        (managed_by IS NULL) OR 
        (user_type = 'landlord' AND managed_by IS NOT NULL)
    )
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    country TEXT DEFAULT 'Nigeria',
    property_type TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price > 0),
    bedrooms INTEGER CHECK (bedrooms >= 0),
    bathrooms INTEGER CHECK (bathrooms >= 0),
    status property_status_enum DEFAULT 'available',
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    year_built INTEGER CHECK (year_built > 1800 AND year_built <= EXTRACT(YEAR FROM NOW())),
    lot_size NUMERIC(10,2), -- in square meters
    floor_area NUMERIC(10,2), -- in square meters
    parking_spaces INTEGER DEFAULT 0,
    is_furnished BOOLEAN DEFAULT FALSE,
    pet_friendly BOOLEAN DEFAULT FALSE,
    has_balcony BOOLEAN DEFAULT FALSE,
    has_garden BOOLEAN DEFAULT FALSE,
    has_pool BOOLEAN DEFAULT FALSE,
    lease_terms TEXT,
    available_from DATE,
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    status application_status_enum DEFAULT 'pending',
    payment_made BOOLEAN DEFAULT FALSE,
    message TEXT,
    application_date TIMESTAMPTZ DEFAULT NOW(),
    move_in_date DATE,
    desired_lease_term TEXT,
    monthly_income NUMERIC(12,2),
    employment_status TEXT,
    credit_score INTEGER CHECK (credit_score >= 300 AND credit_score <= 850),
    pets BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_application_per_property UNIQUE(applicant_id, property_id),
    CONSTRAINT different_applicant_landlord CHECK (applicant_id != landlord_id)
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participants UUID[] NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_participants CHECK (array_length(participants, 1) = 2),
    CONSTRAINT unique_conversation UNIQUE(participants, property_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_by UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT non_empty_content CHECK (length(trim(content)) > 0)
);

-- Saved properties table
CREATE TABLE saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_saved_property UNIQUE(user_id, property_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table (extends profiles)
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    permissions TEXT[] DEFAULT '{}',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT admin_user_type CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = admins.id 
            AND profiles.user_type = 'admin'
        )
    )
);

-- Agents table (extends profiles)
CREATE TABLE agents (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    agent_code TEXT UNIQUE NOT NULL,
    agency_name TEXT,
    license_number TEXT,
    territory TEXT[] DEFAULT '{}',
    commission_rate NUMERIC(5,2) DEFAULT 5.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT agent_user_type CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = agents.id 
            AND profiles.user_type = 'agent'
        )
    )
);

-- Agent assignments table (for agent-landlord relationships)
CREATE TABLE agent_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assignment_type TEXT DEFAULT 'full' CHECK (assignment_type IN ('full', 'property_specific', 'limited')),
    permissions TEXT[] DEFAULT ARRAY['view', 'edit', 'create'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_agent_landlord UNIQUE(agent_id, landlord_id),
    CONSTRAINT landlord_user_type CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = agent_assignments.landlord_id 
            AND profiles.user_type = 'landlord'
        )
    )
);

-- Search alerts table
CREATE TABLE search_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    property_type TEXT,
    min_price NUMERIC(12,2) DEFAULT 0,
    max_price NUMERIC(12,2) DEFAULT 50000000,
    bedrooms INTEGER,
    bathrooms INTEGER,
    keywords TEXT,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_verification_status ON profiles(verification_status);
CREATE INDEX idx_profiles_managed_by ON profiles(managed_by);

-- Properties indexes
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_bathrooms ON properties(bathrooms);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_location ON properties USING GIST(ll_to_earth(latitude, longitude)) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Applications indexes
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_landlord_id ON applications(landlord_id);
CREATE INDEX idx_applications_property_id ON applications(property_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- Conversations indexes
CREATE INDEX idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX idx_conversations_property_id ON conversations(property_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to generate agent code
CREATE OR REPLACE FUNCTION generate_agent_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := 'AG' || LPAD(floor(random() * 999999)::TEXT, 6, '0');
        SELECT EXISTS(SELECT 1 FROM agents WHERE agent_code = code) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to get all properties with filters
CREATE OR REPLACE FUNCTION get_all_properties(filters JSONB DEFAULT '{}')
RETURNS TABLE (
    id UUID,
    owner_id UUID,
    title TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    property_type TEXT,
    price NUMERIC,
    bedrooms INTEGER,
    bathrooms INTEGER,
    status property_status_enum,
    amenities TEXT[],
    images TEXT[],
    created_at TIMESTAMPTZ,
    owner_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.owner_id,
        p.title,
        p.description,
        p.address,
        p.city,
        p.state,
        p.property_type,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.status,
        p.amenities,
        p.images,
        p.created_at,
        CONCAT(pr.first_name, ' ', pr.last_name) as owner_name
    FROM properties p
    JOIN profiles pr ON p.owner_id = pr.id
    WHERE 
        (filters->>'city' IS NULL OR p.city ILIKE '%' || (filters->>'city') || '%')
        AND (filters->>'state' IS NULL OR p.state = (filters->>'state'))
        AND (filters->>'property_type' IS NULL OR p.property_type = (filters->>'property_type'))
        AND (filters->>'min_price' IS NULL OR p.price >= (filters->>'min_price')::NUMERIC)
        AND (filters->>'max_price' IS NULL OR p.price <= (filters->>'max_price')::NUMERIC)
        AND (filters->>'bedrooms' IS NULL OR p.bedrooms >= (filters->>'bedrooms')::INTEGER)
        AND (filters->>'bathrooms' IS NULL OR p.bathrooms >= (filters->>'bathrooms')::INTEGER)
        AND p.status = 'available'
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get property by ID
CREATE OR REPLACE FUNCTION get_property_by_id(prop_id UUID)
RETURNS TABLE (
    id UUID,
    owner_id UUID,
    title TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    property_type TEXT,
    price NUMERIC,
    bedrooms INTEGER,
    bathrooms INTEGER,
    status property_status_enum,
    amenities TEXT[],
    images TEXT[],
    created_at TIMESTAMPTZ,
    owner_name TEXT,
    owner_phone TEXT,
    owner_email TEXT
) AS $$
BEGIN
    -- Increment view count
    UPDATE properties SET view_count = view_count + 1 WHERE properties.id = prop_id;
    
    RETURN QUERY
    SELECT 
        p.id,
        p.owner_id,
        p.title,
        p.description,
        p.address,
        p.city,
        p.state,
        p.property_type,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.status,
        p.amenities,
        p.images,
        p.created_at,
        CONCAT(pr.first_name, ' ', pr.last_name) as owner_name,
        pr.phone as owner_phone,
        pr.email as owner_email
    FROM properties p
    JOIN profiles pr ON p.owner_id = pr.id
    WHERE p.id = prop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create property
CREATE OR REPLACE FUNCTION create_property(data JSONB)
RETURNS UUID AS $$
DECLARE
    new_property_id UUID;
BEGIN
    INSERT INTO properties (
        owner_id, title, description, address, city, state, property_type,
        price, bedrooms, bathrooms, amenities, images
    ) VALUES (
        (data->>'owner_id')::UUID,
        data->>'title',
        data->>'description',
        data->>'address',
        data->>'city',
        data->>'state',
        data->>'property_type',
        (data->>'price')::NUMERIC,
        (data->>'bedrooms')::INTEGER,
        (data->>'bathrooms')::INTEGER,
        CASE WHEN data->'amenities' IS NOT NULL THEN 
            ARRAY(SELECT jsonb_array_elements_text(data->'amenities'))
        ELSE '{}' END,
        CASE WHEN data->'images' IS NOT NULL THEN 
            ARRAY(SELECT jsonb_array_elements_text(data->'images'))
        ELSE '{}' END
    ) RETURNING id INTO new_property_id;
    
    RETURN new_property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update property
CREATE OR REPLACE FUNCTION update_property(prop_id UUID, data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE properties SET
        title = COALESCE(data->>'title', title),
        description = COALESCE(data->>'description', description),
        address = COALESCE(data->>'address', address),
        city = COALESCE(data->>'city', city),
        state = COALESCE(data->>'state', state),
        property_type = COALESCE(data->>'property_type', property_type),
        price = COALESCE((data->>'price')::NUMERIC, price),
        bedrooms = COALESCE((data->>'bedrooms')::INTEGER, bedrooms),
        bathrooms = COALESCE((data->>'bathrooms')::INTEGER, bathrooms),
        status = COALESCE((data->>'status')::property_status_enum, status),
        amenities = CASE WHEN data->'amenities' IS NOT NULL THEN 
            ARRAY(SELECT jsonb_array_elements_text(data->'amenities'))
        ELSE amenities END,
        images = CASE WHEN data->'images' IS NOT NULL THEN 
            ARRAY(SELECT jsonb_array_elements_text(data->'images'))
        ELSE images END,
        updated_at = NOW()
    WHERE id = prop_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete property
CREATE OR REPLACE FUNCTION delete_property(prop_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM properties WHERE id = prop_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS TABLE (
    id UUID,
    user_type user_type_enum,
    is_super_admin BOOLEAN,
    verification_status verification_status_enum,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.user_type,
        p.is_super_admin,
        p.verification_status,
        p.first_name,
        p.last_name,
        p.phone,
        p.avatar_url,
        p.email,
        p.created_at
    FROM profiles p
    WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(user_id UUID, data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE profiles SET
        first_name = COALESCE(data->>'first_name', first_name),
        last_name = COALESCE(data->>'last_name', last_name),
        phone = COALESCE(data->>'phone', phone),
        avatar_url = COALESCE(data->>'avatar_url', avatar_url),
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create agent (admin only)
CREATE OR REPLACE FUNCTION create_agent(data JSONB)
RETURNS UUID AS $$
DECLARE
    new_agent_id UUID;
    agent_code_val TEXT;
BEGIN
    -- Generate unique agent code
    agent_code_val := generate_agent_code();
    
    -- Insert into profiles
    INSERT INTO profiles (
        id, user_type, first_name, last_name, phone, email
    ) VALUES (
        (data->>'id')::UUID,
        'agent',
        data->>'first_name',
        data->>'last_name',
        data->>'phone',
        data->>'email'
    ) RETURNING id INTO new_agent_id;
    
    -- Insert into agents
    INSERT INTO agents (
        id, agent_code, agency_name, license_number
    ) VALUES (
        new_agent_id,
        agent_code_val,
        data->>'agency_name',
        data->>'license_number'
    );
    
    RETURN new_agent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to register landlord by agent
CREATE OR REPLACE FUNCTION register_landlord_by_agent(data JSONB, agent_id UUID)
RETURNS UUID AS $$
DECLARE
    new_landlord_id UUID;
BEGIN
    -- Insert into profiles
    INSERT INTO profiles (
        id, user_type, managed_by, first_name, last_name, phone, email
    ) VALUES (
        (data->>'id')::UUID,
        'landlord',
        agent_id,
        data->>'first_name',
        data->>'last_name',
        data->>'phone',
        data->>'email'
    ) RETURNING id INTO new_landlord_id;
    
    -- Create agent assignment
    INSERT INTO agent_assignments (agent_id, landlord_id) 
    VALUES (agent_id, new_landlord_id);
    
    RETURN new_landlord_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get landlords by agent
CREATE OR REPLACE FUNCTION get_landlords_by_agent(agent_id UUID)
RETURNS TABLE (
    id UUID,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    email TEXT,
    verification_status verification_status_enum,
    created_at TIMESTAMPTZ,
    property_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.phone,
        p.email,
        p.verification_status,
        p.created_at,
        COUNT(pr.id) as property_count
    FROM profiles p
    JOIN agent_assignments aa ON p.id = aa.landlord_id
    LEFT JOIN properties pr ON p.id = pr.owner_id
    WHERE aa.agent_id = get_landlords_by_agent.agent_id
    GROUP BY p.id, p.first_name, p.last_name, p.phone, p.email, p.verification_status, p.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to register renter
CREATE OR REPLACE FUNCTION register_renter(data JSONB)
RETURNS UUID AS $$
DECLARE
    new_renter_id UUID;
BEGIN
    INSERT INTO profiles (
        id, user_type, first_name, last_name, phone, email
    ) VALUES (
        (data->>'id')::UUID,
        'tenant',
        data->>'first_name',
        data->>'last_name',
        data->>'phone',
        data->>'email'
    ) RETURNING id INTO new_renter_id;
    
    RETURN new_renter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to register landlord
CREATE OR REPLACE FUNCTION register_landlord(data JSONB)
RETURNS UUID AS $$
DECLARE
    new_landlord_id UUID;
BEGIN
    INSERT INTO profiles (
        id, user_type, first_name, last_name, phone, email
    ) VALUES (
        (data->>'id')::UUID,
        'landlord',
        data->>'first_name',
        data->>'last_name',
        data->>'phone',
        data->>'email'
    ) RETURNING id INTO new_landlord_id;
    
    RETURN new_landlord_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Placeholder email functions (to be implemented with actual email service)
CREATE OR REPLACE FUNCTION send_welcome_email(email TEXT, user_type TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- TODO: Implement actual email sending logic
    RAISE NOTICE 'Welcome email sent to % for user type %', email, user_type;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION send_password_reset_email(email TEXT, reset_link TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- TODO: Implement actual email sending logic
    RAISE NOTICE 'Password reset email sent to % with link %', email, reset_link;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION send_application_notification_email(email TEXT, application_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- TODO: Implement actual email sending logic
    RAISE NOTICE 'Application notification email sent to %', email;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get all applications
CREATE OR REPLACE FUNCTION get_all_applications(user_id UUID, user_type TEXT)
RETURNS TABLE (
    id UUID,
    applicant_id UUID,
    landlord_id UUID,
    property_id UUID,
    status application_status_enum,
    payment_made BOOLEAN,
    message TEXT,
    created_at TIMESTAMPTZ,
    property_title TEXT,
    property_address TEXT,
    applicant_name TEXT,
    landlord_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.applicant_id,
        a.landlord_id,
        a.property_id,
        a.status,
        a.payment_made,
        a.message,
        a.created_at,
        p.title as property_title,
        p.address as property_address,
        CONCAT(ap.first_name, ' ', ap.last_name) as applicant_name,
        CONCAT(lp.first_name, ' ', lp.last_name) as landlord_name
    FROM applications a
    JOIN properties p ON a.property_id = p.id
    JOIN profiles ap ON a.applicant_id = ap.id
    JOIN profiles lp ON a.landlord_id = lp.id
    WHERE 
        CASE 
            WHEN user_type = 'tenant' THEN a.applicant_id = get_all_applications.user_id
            WHEN user_type = 'landlord' THEN a.landlord_id = get_all_applications.user_id
            ELSE FALSE
        END
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create application
CREATE OR REPLACE FUNCTION create_application(data JSONB)
RETURNS UUID AS $$
DECLARE
    new_application_id UUID;
    landlord_id_val UUID;
BEGIN
    -- Get landlord ID from property
    SELECT owner_id INTO landlord_id_val 
    FROM properties 
    WHERE id = (data->>'property_id')::UUID;
    
    INSERT INTO applications (
        applicant_id, landlord_id, property_id, message,
        move_in_date, desired_lease_term, monthly_income, 
        employment_status, credit_score, pets, notes
    ) VALUES (
        (data->>'applicant_id')::UUID,
        landlord_id_val,
        (data->>'property_id')::UUID,
        data->>'message',
        (data->>'move_in_date')::DATE,
        data->>'desired_lease_term',
        (data->>'monthly_income')::NUMERIC,
        data->>'employment_status',
        (data->>'credit_score')::INTEGER,
        (data->>'pets')::BOOLEAN,
        data->>'notes'
    ) RETURNING id INTO new_application_id;
    
    RETURN new_application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update application
CREATE OR REPLACE FUNCTION update_application(app_id UUID, data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE applications SET
        status = COALESCE((data->>'status')::application_status_enum, status),
        payment_made = COALESCE((data->>'payment_made')::BOOLEAN, payment_made),
        message = COALESCE(data->>'message', message),
        updated_at = NOW()
    WHERE id = app_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_metadata JSONB;
    user_type_val user_type_enum;
BEGIN
    user_metadata := NEW.raw_user_meta_data;
    user_type_val := COALESCE((user_metadata->>'user_type')::user_type_enum, 'tenant');
    
    INSERT INTO profiles (
        id, 
        user_type, 
        first_name, 
        last_name, 
        phone, 
        email
    ) VALUES (
        NEW.id,
        user_type_val,
        user_metadata->>'first_name',
        user_metadata->>'last_name',
        user_metadata->>'phone',
        NEW.email
    );
    
    -- Send welcome email
    PERFORM send_welcome_email(NEW.email, user_type_val::TEXT);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_new_user_registration
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to handle new application
CREATE OR REPLACE FUNCTION handle_new_application()
RETURNS TRIGGER AS $$
DECLARE
    admin_email TEXT;
BEGIN
    -- Get super admin email for notification
    SELECT email INTO admin_email 
    FROM profiles 
    WHERE is_super_admin = TRUE 
    LIMIT 1;
    
    IF admin_email IS NOT NULL THEN
        PERFORM send_application_notification_email(
            admin_email, 
            jsonb_build_object(
                'application_id', NEW.id,
                'property_id', NEW.property_id,
                'applicant_id', NEW.applicant_id
            )
        );
    END IF;
    
    -- Create notification for landlord
    INSERT INTO notifications (
        user_id, type, title, message, application_id
    ) VALUES (
        NEW.landlord_id,
        'application',
        'New Rental Application',
        'You have received a new rental application for your property.',
        NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new application
CREATE TRIGGER on_new_application
    AFTER INSERT ON applications
    FOR EACH ROW EXECUTE FUNCTION handle_new_application();

-- Function to handle application status change
CREATE OR REPLACE FUNCTION handle_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO notifications (
            user_id, type, title, message, application_id
        ) VALUES (
            NEW.applicant_id,
            'application',
            'Application Status Update',
            'Your rental application status has been updated to: ' || NEW.status,
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for application status change
CREATE TRIGGER on_application_status_change
    AFTER UPDATE OF status ON applications
    FOR EACH ROW EXECUTE FUNCTION handle_application_status_change();

-- Function to handle payment made
CREATE OR REPLACE FUNCTION handle_payment_made()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.payment_made = FALSE AND NEW.payment_made = TRUE THEN
        INSERT INTO notifications (
            user_id, type, title, message, application_id
        ) VALUES (
            NEW.landlord_id,
            'application',
            'Payment Received',
            'Payment has been made for the rental application.',
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for payment made
CREATE TRIGGER on_payment_made
    AFTER UPDATE OF payment_made ON applications
    FOR EACH ROW EXECUTE FUNCTION handle_payment_made();

-- Function to update conversation last message time
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations 
    SET 
        last_message_at = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation last message time
CREATE TRIGGER on_new_message
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

CREATE POLICY "Agents can view their managed landlords" ON profiles
    FOR SELECT USING (
        user_type = 'landlord' AND
        EXISTS (
            SELECT 1 FROM agent_assignments aa
            JOIN profiles p ON aa.agent_id = p.id
            WHERE aa.landlord_id = profiles.id
            AND p.id = auth.uid()
            AND p.user_type = 'agent'
        )
    );

-- Properties policies
CREATE POLICY "Anyone can view available properties" ON properties
    FOR SELECT USING (status = 'available');

CREATE POLICY "Property owners can view their properties" ON properties
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Property owners can insert properties" ON properties
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Property owners can update their properties" ON properties
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Property owners can delete their properties" ON properties
    FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Agents can manage properties for their landlords" ON properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM agent_assignments aa
            JOIN profiles p ON aa.agent_id = p.id
            WHERE aa.landlord_id = properties.owner_id
            AND p.id = auth.uid()
            AND p.user_type = 'agent'
            AND 'edit' = ANY(aa.permissions)
        )
    );

-- Applications policies
CREATE POLICY "Applicants can view their applications" ON applications
    FOR SELECT USING (applicant_id = auth.uid());

CREATE POLICY "Landlords can view applications for their properties" ON applications
    FOR SELECT USING (landlord_id = auth.uid());

CREATE POLICY "Users can create applications" ON applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Applicants can update their applications" ON applications
    FOR UPDATE USING (applicant_id = auth.uid());

CREATE POLICY "Landlords can update applications for their properties" ON applications
    FOR UPDATE USING (landlord_id = auth.uid());

-- Conversations policies
CREATE POLICY "Users can view conversations they participate in" ON conversations
    FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT WITH CHECK (auth.uid() = ANY(participants));

CREATE POLICY "Users can update conversations they participate in" ON conversations
    FOR UPDATE USING (auth.uid() = ANY(participants));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = messages.conversation_id 
            AND auth.uid() = ANY(participants)
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversations 
            WHERE id = conversation_id 
            AND auth.uid() = ANY(participants)
        )
    );

-- Saved properties policies
CREATE POLICY "Users can view their saved properties" ON saved_properties
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can save properties" ON saved_properties
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave their properties" ON saved_properties
    FOR DELETE USING (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Admins policies
CREATE POLICY "Admins can view all admin records" ON admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Agents policies
CREATE POLICY "Agents can view all agent records" ON agents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type IN ('admin', 'agent')
        )
    );

CREATE POLICY "Admins can manage agents" ON agents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Agent assignments policies
CREATE POLICY "Agents can view their assignments" ON agent_assignments
    FOR SELECT USING (
        agent_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can manage agent assignments" ON agent_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Search alerts policies
CREATE POLICY "Users can manage their search alerts" ON search_alerts
    FOR ALL USING (user_id = auth.uid());

-- =============================================
-- INITIAL DATA
-- =============================================

-- Create a super admin user (this should be done manually after user registration)
-- The super admin user must first register through the normal auth flow
-- Then run: UPDATE profiles SET user_type = 'admin', is_super_admin = TRUE WHERE email = 'admin@rentory.ng';

-- =============================================
-- SCHEDULED FUNCTIONS
-- =============================================

-- Note: These would typically be set up as cron jobs or scheduled functions
-- For now, they are just functions that can be called manually

-- Function to run daily cleanup
CREATE OR REPLACE FUNCTION daily_cleanup()
RETURNS TEXT AS $$
DECLARE
    notification_count INTEGER;
BEGIN
    -- Clean up old notifications
    SELECT cleanup_old_notifications() INTO notification_count;
    
    RETURN 'Cleaned up ' || notification_count || ' old notifications';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant specific permissions for auth schema
GRANT SELECT ON auth.users TO authenticated;