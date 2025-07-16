-- Schema: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'landlord', 'agent', 'tenant')),
    is_super_admin BOOLEAN DEFAULT FALSE,
    managed_by UUID REFERENCES profiles(id),
    verification_status TEXT DEFAULT 'pending',
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema: properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    property_type TEXT NOT NULL,
    price NUMERIC NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    status TEXT DEFAULT 'available',
    description TEXT,
    amenities TEXT[],
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema: applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES profiles(id),
    landlord_id UUID NOT NULL REFERENCES profiles(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    payment_made BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema: conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participants UUID[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ
);

-- Schema: messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema: saved_properties
CREATE TABLE saved_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Schema: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    type TEXT NOT NULL,
    property_id UUID REFERENCES properties(id),
    application_id UUID REFERENCES applications(id),
    status TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "All users can see properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Owners can update their own properties" ON properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their own properties" ON properties FOR DELETE USING (auth.uid() = owner_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own applications" ON applications FOR SELECT USING (auth.uid() = applicant_id OR auth.uid() = landlord_id);
CREATE POLICY "Users can create applications" ON applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Users can update their own applications" ON applications FOR UPDATE USING (auth.uid() = applicant_id OR auth.uid() = landlord_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see conversations they are in" ON conversations FOR SELECT USING (auth.uid() = ANY(participants));

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see messages in their conversations" ON messages FOR SELECT USING (auth.uid() IN (SELECT unnest(participants) FROM conversations WHERE id = conversation_id));
CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT WITH CHECK (auth.uid() IN (SELECT unnest(participants) FROM conversations WHERE id = conversation_id));

ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own saved properties" ON saved_properties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save properties" ON saved_properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave properties" ON saved_properties FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Function to get all properties with filters
CREATE OR REPLACE FUNCTION get_all_properties(filters JSONB)
RETURNS SETOF properties AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM properties
    WHERE
        (filters->>'city' IS NULL OR city ILIKE '%' || (filters->>'city') || '%') AND
        (filters->>'state' IS NULL OR state = filters->>'state') AND
        (filters->>'property_type' IS NULL OR property_type = filters->>'property_type') AND
        (filters->>'min_price' IS NULL OR price >= (filters->>'min_price')::NUMERIC) AND
        (filters->>'max_price' IS NULL OR price <= (filters->>'max_price')::NUMERIC) AND
        (filters->>'bedrooms' IS NULL OR bedrooms >= (filters->>'bedrooms')::INTEGER) AND
        (filters->>'bathrooms' IS NULL OR bathrooms >= (filters->>'bathrooms')::INTEGER);
END;
$$ LANGUAGE plpgsql;

-- Function to get a property by ID
CREATE OR REPLACE FUNCTION get_property_by_id(prop_id UUID)
RETURNS SETOF properties AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM properties WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create a property
CREATE OR REPLACE FUNCTION create_property(data JSONB)
RETURNS SETOF properties AS $$
DECLARE
    new_property properties;
BEGIN
    INSERT INTO properties (owner_id, city, state, property_type, price, bedrooms, bathrooms, description, amenities, images)
    VALUES (
        (data->>'owner_id')::UUID,
        data->>'city',
        data->>'state',
        data->>'property_type',
        (data->>'price')::NUMERIC,
        (data->>'bedrooms')::INTEGER,
        (data->>'bathrooms')::INTEGER,
        data->>'description',
        ARRAY(SELECT jsonb_array_elements_text(data->'amenities')),
        ARRAY(SELECT jsonb_array_elements_text(data->'images'))
    ) RETURNING * INTO new_property;
    RETURN NEXT new_property;
END;
$$ LANGUAGE plpgsql;

-- Function to update a property
CREATE OR REPLACE FUNCTION update_property(prop_id UUID, data JSONB)
RETURNS SETOF properties AS $$
DECLARE
    updated_property properties;
BEGIN
    UPDATE properties
    SET
        city = COALESCE(data->>'city', city),
        state = COALESCE(data->>'state', state),
        property_type = COALESCE(data->>'property_type', property_type),
        price = COALESCE((data->>'price')::NUMERIC, price),
        bedrooms = COALESCE((data->>'bedrooms')::INTEGER, bedrooms),
        bathrooms = COALESCE((data->>'bathrooms')::INTEGER, bathrooms),
        status = COALESCE(data->>'status', status),
        description = COALESCE(data->>'description', description),
        amenities = COALESCE(ARRAY(SELECT jsonb_array_elements_text(data->'amenities')), amenities),
        images = COALESCE(ARRAY(SELECT jsonb_array_elements_text(data->'images')), images),
        updated_at = NOW()
    WHERE id = prop_id
    RETURNING * INTO updated_property;
    RETURN NEXT updated_property;
END;
$$ LANGUAGE plpgsql;

-- Function to delete a property
CREATE OR REPLACE FUNCTION delete_property(prop_id UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM properties WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get a user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS SETOF profiles AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM profiles WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update a user profile
CREATE OR REPLACE FUNCTION update_user_profile(user_id UUID, data JSONB)
RETURNS SETOF profiles AS $$
DECLARE
    updated_profile profiles;
BEGIN
    UPDATE profiles
    SET
        first_name = COALESCE(data->>'first_name', first_name),
        last_name = COALESCE(data->>'last_name', last_name),
        phone = COALESCE(data->>'phone', phone),
        avatar_url = COALESCE(data->>'avatar_url', avatar_url),
        updated_at = NOW()
    WHERE id = user_id
    RETURNING * INTO updated_profile;
    RETURN NEXT updated_profile;
END;
$$ LANGUAGE plpgsql;

-- Function to create an agent (admin only)
CREATE OR REPLACE FUNCTION create_agent(data JSONB)
RETURNS SETOF profiles AS $$
DECLARE
    new_agent profiles;
BEGIN
    -- Add logic to check if the caller is an admin
    INSERT INTO profiles (id, user_type, first_name, last_name, phone)
    VALUES (
        (data->>'user_id')::UUID,
        'agent',
        data->>'first_name',
        data->>'last_name',
        data->>'phone'
    ) RETURNING * INTO new_agent;
    RETURN NEXT new_agent;
END;
$$ LANGUAGE plpgsql;

-- Function to register a landlord (agent only)
CREATE OR REPLACE FUNCTION register_landlord_by_agent(data JSONB, agent_id UUID)
RETURNS SETOF profiles AS $$
DECLARE
    new_landlord profiles;
BEGIN
    -- Add logic to check if the caller is an agent
    INSERT INTO profiles (id, user_type, managed_by, first_name, last_name, phone)
    VALUES (
        (data->>'user_id')::UUID,
        'landlord',
        agent_id,
        data->>'first_name',
        data->>'last_name',
        data->>'phone'
    ) RETURNING * INTO new_landlord;
    RETURN NEXT new_landlord;
END;
$$ LANGUAGE plpgsql;

-- Function to get landlords by agent
CREATE OR REPLACE FUNCTION get_landlords_by_agent(agent_id UUID)
RETURNS SETOF profiles AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM profiles WHERE user_type = 'landlord' AND managed_by = agent_id;
END;
$$ LANGUAGE plpgsql;

-- Function to register a renter
CREATE OR REPLACE FUNCTION register_renter(data JSONB)
RETURNS SETOF profiles AS $$
DECLARE
    new_renter profiles;
BEGIN
    INSERT INTO profiles (id, user_type, first_name, last_name, phone)
    VALUES (
        (data->>'user_id')::UUID,
        'tenant',
        data->>'first_name',
        data->>'last_name',
        data->>'phone'
    ) RETURNING * INTO new_renter;
    RETURN NEXT new_renter;
END;
$$ LANGUAGE plpgsql;

-- Function to register a landlord
CREATE OR REPLACE FUNCTION register_landlord(data JSONB)
RETURNS SETOF profiles AS $$
DECLARE
    new_landlord profiles;
BEGIN
    INSERT INTO profiles (id, user_type, first_name, last_name, phone)
    VALUES (
        (data->>'user_id')::UUID,
        'landlord',
        data->>'first_name',
        data->>'last_name',
        data->>'phone'
    ) RETURNING * INTO new_landlord;
    RETURN NEXT new_landlord;
END;
$$ LANGUAGE plpgsql;

-- Function to send a welcome email
CREATE OR REPLACE FUNCTION send_welcome_email(email TEXT, user_type TEXT)
RETURNS VOID AS $$
BEGIN
    -- This is a placeholder. In a real application, you would use an extension like http or a trigger to call an external service.
    RAISE NOTICE 'Sending welcome email to % as %', email, user_type;
END;
$$ LANGUAGE plpgsql;

-- Function to send a password reset email
CREATE OR REPLACE FUNCTION send_password_reset_email(email TEXT, reset_link TEXT)
RETURNS VOID AS $$
BEGIN
    -- Placeholder
    RAISE NOTICE 'Sending password reset email to % with link %', email, reset_link;
END;
$$ LANGUAGE plpgsql;

-- Function to send an application notification email
CREATE OR REPLACE FUNCTION send_application_notification_email(email TEXT, application_data JSONB)
RETURNS VOID AS $$
BEGIN
    -- Placeholder
    RAISE NOTICE 'Sending application notification to % with data %', email, application_data;
END;
$$ LANGUAGE plpgsql;

-- Function to get all applications for a user
CREATE OR REPLACE FUNCTION get_all_applications(user_id UUID, user_type TEXT)
RETURNS SETOF applications AS $$
BEGIN
    IF user_type = 'tenant' THEN
        RETURN QUERY
        SELECT * FROM applications WHERE applicant_id = user_id;
    ELSE
        RETURN QUERY
        SELECT * FROM applications WHERE landlord_id = user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create an application
CREATE OR REPLACE FUNCTION create_application(data JSONB)
RETURNS SETOF applications AS $$
DECLARE
    new_application applications;
BEGIN
    INSERT INTO applications (applicant_id, landlord_id, property_id, message)
    VALUES (
        (data->>'applicant_id')::UUID,
        (data->>'landlord_id')::UUID,
        (data->>'property_id')::UUID,
        data->>'message'
    ) RETURNING * INTO new_application;
    RETURN NEXT new_application;
END;
$$ LANGUAGE plpgsql;

-- Function to update an application
CREATE OR REPLACE FUNCTION update_application(app_id UUID, data JSONB)
RETURNS SETOF applications AS $$
DECLARE
    updated_application applications;
BEGIN
    UPDATE applications
    SET
        status = COALESCE(data->>'status', status),
        payment_made = COALESCE((data->>'payment_made')::BOOLEAN, payment_made),
        updated_at = NOW()
    WHERE id = app_id
    RETURNING * INTO updated_application;
    RETURN NEXT updated_application;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, user_type, first_name, last_name, phone)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'user_type',
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'phone'
    );
    PERFORM send_welcome_email(NEW.email, NEW.raw_user_meta_data->>'user_type');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_new_user_registration
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger function for new application
CREATE OR REPLACE FUNCTION handle_new_application()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_email TEXT;
BEGIN
    SELECT email INTO super_admin_email FROM auth.users u JOIN profiles p ON u.id = p.id WHERE p.is_super_admin = TRUE LIMIT 1;
    IF super_admin_email IS NOT NULL THEN
        PERFORM send_application_notification_email(super_admin_email, row_to_json(NEW));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_new_application
AFTER INSERT ON applications
FOR EACH ROW EXECUTE FUNCTION handle_new_application();

-- Trigger function for application status change
CREATE OR REPLACE FUNCTION handle_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
    applicant_email TEXT;
BEGIN
    SELECT email INTO applicant_email FROM auth.users WHERE id = NEW.applicant_id;
    IF applicant_email IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, application_id, status)
        VALUES (NEW.applicant_id, 'application_status_change', NEW.id, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_application_status_change
AFTER UPDATE OF status ON applications
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION handle_application_status_change();

-- Trigger function to notify landlord on payment
CREATE OR REPLACE FUNCTION notify_landlord_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, type, application_id, status)
    VALUES (NEW.landlord_id, 'payment_made', NEW.id, 'paid');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_payment_made
AFTER UPDATE OF payment_made ON applications
FOR EACH ROW
WHEN (NEW.payment_made = TRUE AND OLD.payment_made = FALSE)
EXECUTE FUNCTION notify_landlord_on_payment();

-- Function to cleanup old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS VOID AS $$
BEGIN
    DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule the cleanup function to run daily
-- SELECT cron.schedule('daily-notification-cleanup', '0 0 * * *', 'SELECT cleanup_old_notifications()');
