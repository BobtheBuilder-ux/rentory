create type "public"."application_status" as enum ('pending', 'approved', 'rejected', 'withdrawn');

create type "public"."property_status" as enum ('available', 'rented', 'maintenance', 'draft');

create type "public"."property_type" as enum ('apartment', 'duplex', 'flat', 'villa', 'house', 'mansion', 'bungalow', 'penthouse', 'studio');

create type "public"."user_type" as enum ('renter', 'landlord', 'agent', 'admin');

create type "public"."verification_status" as enum ('pending', 'verified', 'rejected');

create table "public"."admin_users" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "profile_id" uuid,
    "admin_level" text default 'standard'::text,
    "permissions" jsonb default '[]'::jsonb,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."admin_users" enable row level security;

create table "public"."agent_assignments" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid,
    "landlord_id" uuid,
    "assigned_by" uuid,
    "assignment_type" text default 'full'::text,
    "permissions" jsonb default '["view", "edit", "create"]'::jsonb,
    "created_at" timestamp with time zone default now()
);


alter table "public"."agent_assignments" enable row level security;

create table "public"."agents" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "profile_id" uuid,
    "agent_code" text not null,
    "license_number" text,
    "agency_name" text,
    "commission_rate" numeric default 5.0,
    "territory" jsonb default '[]'::jsonb,
    "status" text default 'active'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."agents" enable row level security;

create table "public"."applications" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "applicant_id" uuid,
    "status" application_status default 'pending'::application_status,
    "move_in_date" date,
    "employment_status" text,
    "employer_name" text,
    "monthly_income" numeric,
    "previous_address" text,
    "emergency_contact_name" text,
    "emergency_contact_phone" text,
    "emergency_contact_relationship" text,
    "additional_notes" text,
    "documents" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."applications" enable row level security;

create table "public"."conversations" (
    "id" uuid not null default gen_random_uuid(),
    "participant_1" uuid,
    "participant_2" uuid,
    "property_id" uuid,
    "last_message_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
);


alter table "public"."conversations" enable row level security;

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "conversation_id" uuid,
    "sender_id" uuid,
    "content" text not null,
    "message_type" text default 'text'::text,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
);


alter table "public"."messages" enable row level security;

create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "email" text not null,
    "first_name" text not null,
    "last_name" text not null,
    "phone" text,
    "user_type" user_type not null default 'renter'::user_type,
    "avatar_url" text,
    "verification_status" verification_status default 'pending'::verification_status,
    "date_of_birth" date,
    "occupation" text,
    "monthly_income" numeric,
    "bio" text,
    "address" text,
    "city" text,
    "state" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."properties" (
    "id" uuid not null default gen_random_uuid(),
    "landlord_id" uuid,
    "title" text not null,
    "description" text not null,
    "property_type" property_type not null,
    "status" property_status default 'draft'::property_status,
    "price" numeric not null,
    "negotiable" boolean default false,
    "bedrooms" integer not null,
    "bathrooms" integer not null,
    "toilets" integer,
    "size_sqm" numeric,
    "furnished" boolean default false,
    "address" text not null,
    "city" text not null,
    "state" text not null,
    "landmark" text,
    "latitude" numeric,
    "longitude" numeric,
    "available_from" date,
    "minimum_stay" text,
    "maximum_stay" text,
    "caution_fee" numeric,
    "agent_fee" numeric,
    "legal_fee" numeric,
    "inspection_fee" numeric default 0,
    "views_count" integer default 0,
    "featured" boolean default false,
    "verification_status" verification_status default 'pending'::verification_status,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "agent_id" uuid
);


alter table "public"."properties" enable row level security;

create table "public"."property_amenities" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "amenity" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."property_amenities" enable row level security;

create table "public"."property_images" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "image_url" text not null,
    "alt_text" text,
    "is_primary" boolean default false,
    "display_order" integer default 0,
    "created_at" timestamp with time zone default now()
);


alter table "public"."property_images" enable row level security;

create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "property_id" uuid,
    "reviewer_id" uuid,
    "landlord_id" uuid,
    "rating" integer,
    "title" text,
    "content" text,
    "verified_stay" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."reviews" enable row level security;

create table "public"."saved_properties" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "property_id" uuid,
    "created_at" timestamp with time zone default now()
);


alter table "public"."saved_properties" enable row level security;

create table "public"."search_alerts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "location" text,
    "property_type" text,
    "min_price" integer,
    "max_price" integer,
    "bedrooms" text,
    "bathrooms" text,
    "keywords" text,
    "email_notifications" boolean not null default true,
    "push_notifications" boolean not null default true,
    "frequency" text not null default 'immediate'::text,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


CREATE UNIQUE INDEX admin_users_pkey ON public.admin_users USING btree (id);

CREATE UNIQUE INDEX admin_users_user_id_key ON public.admin_users USING btree (user_id);

CREATE UNIQUE INDEX agent_assignments_agent_id_landlord_id_key ON public.agent_assignments USING btree (agent_id, landlord_id);

CREATE UNIQUE INDEX agent_assignments_pkey ON public.agent_assignments USING btree (id);

CREATE UNIQUE INDEX agents_agent_code_key ON public.agents USING btree (agent_code);

CREATE UNIQUE INDEX agents_pkey ON public.agents USING btree (id);

CREATE UNIQUE INDEX agents_user_id_key ON public.agents USING btree (user_id);

CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id);

CREATE UNIQUE INDEX conversations_participant_1_participant_2_property_id_key ON public.conversations USING btree (participant_1, participant_2, property_id);

CREATE UNIQUE INDEX conversations_pkey ON public.conversations USING btree (id);

CREATE INDEX idx_admin_users_user_id ON public.admin_users USING btree (user_id);

CREATE INDEX idx_agent_assignments_agent_id ON public.agent_assignments USING btree (agent_id);

CREATE INDEX idx_agent_assignments_landlord_id ON public.agent_assignments USING btree (landlord_id);

CREATE INDEX idx_agents_agent_code ON public.agents USING btree (agent_code);

CREATE INDEX idx_agents_user_id ON public.agents USING btree (user_id);

CREATE INDEX idx_applications_applicant_id ON public.applications USING btree (applicant_id);

CREATE INDEX idx_applications_property_id ON public.applications USING btree (property_id);

CREATE INDEX idx_conversations_participants ON public.conversations USING btree (participant_1, participant_2);

CREATE INDEX idx_messages_conversation_id ON public.messages USING btree (conversation_id);

CREATE INDEX idx_properties_agent_id ON public.properties USING btree (agent_id);

CREATE INDEX idx_properties_city_state ON public.properties USING btree (city, state);

CREATE INDEX idx_properties_landlord_id ON public.properties USING btree (landlord_id);

CREATE INDEX idx_properties_price ON public.properties USING btree (price);

CREATE INDEX idx_properties_property_type ON public.properties USING btree (property_type);

CREATE INDEX idx_properties_status ON public.properties USING btree (status);

CREATE INDEX idx_reviews_property_id ON public.reviews USING btree (property_id);

CREATE INDEX idx_saved_properties_user_id ON public.saved_properties USING btree (user_id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX properties_pkey ON public.properties USING btree (id);

CREATE UNIQUE INDEX property_amenities_pkey ON public.property_amenities USING btree (id);

CREATE UNIQUE INDEX property_images_pkey ON public.property_images USING btree (id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX saved_properties_pkey ON public.saved_properties USING btree (id);

CREATE UNIQUE INDEX saved_properties_user_id_property_id_key ON public.saved_properties USING btree (user_id, property_id);

CREATE UNIQUE INDEX search_alerts_pkey ON public.search_alerts USING btree (id);

alter table "public"."admin_users" add constraint "admin_users_pkey" PRIMARY KEY using index "admin_users_pkey";

alter table "public"."agent_assignments" add constraint "agent_assignments_pkey" PRIMARY KEY using index "agent_assignments_pkey";

alter table "public"."agents" add constraint "agents_pkey" PRIMARY KEY using index "agents_pkey";

alter table "public"."applications" add constraint "applications_pkey" PRIMARY KEY using index "applications_pkey";

alter table "public"."conversations" add constraint "conversations_pkey" PRIMARY KEY using index "conversations_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."properties" add constraint "properties_pkey" PRIMARY KEY using index "properties_pkey";

alter table "public"."property_amenities" add constraint "property_amenities_pkey" PRIMARY KEY using index "property_amenities_pkey";

alter table "public"."property_images" add constraint "property_images_pkey" PRIMARY KEY using index "property_images_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."saved_properties" add constraint "saved_properties_pkey" PRIMARY KEY using index "saved_properties_pkey";

alter table "public"."search_alerts" add constraint "search_alerts_pkey" PRIMARY KEY using index "search_alerts_pkey";

alter table "public"."admin_users" add constraint "admin_users_admin_level_check" CHECK ((admin_level = ANY (ARRAY['super'::text, 'standard'::text]))) not valid;

alter table "public"."admin_users" validate constraint "admin_users_admin_level_check";

alter table "public"."admin_users" add constraint "admin_users_created_by_fkey" FOREIGN KEY (created_by) REFERENCES admin_users(id) not valid;

alter table "public"."admin_users" validate constraint "admin_users_created_by_fkey";

alter table "public"."admin_users" add constraint "admin_users_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."admin_users" validate constraint "admin_users_profile_id_fkey";

alter table "public"."admin_users" add constraint "admin_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."admin_users" validate constraint "admin_users_user_id_fkey";

alter table "public"."admin_users" add constraint "admin_users_user_id_key" UNIQUE using index "admin_users_user_id_key";

alter table "public"."agent_assignments" add constraint "agent_assignments_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE not valid;

alter table "public"."agent_assignments" validate constraint "agent_assignments_agent_id_fkey";

alter table "public"."agent_assignments" add constraint "agent_assignments_agent_id_landlord_id_key" UNIQUE using index "agent_assignments_agent_id_landlord_id_key";

alter table "public"."agent_assignments" add constraint "agent_assignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES admin_users(id) not valid;

alter table "public"."agent_assignments" validate constraint "agent_assignments_assigned_by_fkey";

alter table "public"."agent_assignments" add constraint "agent_assignments_assignment_type_check" CHECK ((assignment_type = ANY (ARRAY['full'::text, 'limited'::text]))) not valid;

alter table "public"."agent_assignments" validate constraint "agent_assignments_assignment_type_check";

alter table "public"."agent_assignments" add constraint "agent_assignments_landlord_id_fkey" FOREIGN KEY (landlord_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."agent_assignments" validate constraint "agent_assignments_landlord_id_fkey";

alter table "public"."agents" add constraint "agents_agent_code_key" UNIQUE using index "agents_agent_code_key";

alter table "public"."agents" add constraint "agents_created_by_fkey" FOREIGN KEY (created_by) REFERENCES admin_users(id) not valid;

alter table "public"."agents" validate constraint "agents_created_by_fkey";

alter table "public"."agents" add constraint "agents_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."agents" validate constraint "agents_profile_id_fkey";

alter table "public"."agents" add constraint "agents_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text]))) not valid;

alter table "public"."agents" validate constraint "agents_status_check";

alter table "public"."agents" add constraint "agents_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."agents" validate constraint "agents_user_id_fkey";

alter table "public"."agents" add constraint "agents_user_id_key" UNIQUE using index "agents_user_id_key";

alter table "public"."applications" add constraint "applications_applicant_id_fkey" FOREIGN KEY (applicant_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_applicant_id_fkey";

alter table "public"."applications" add constraint "applications_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."applications" validate constraint "applications_property_id_fkey";

alter table "public"."conversations" add constraint "conversations_participant_1_fkey" FOREIGN KEY (participant_1) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_participant_1_fkey";

alter table "public"."conversations" add constraint "conversations_participant_1_participant_2_property_id_key" UNIQUE using index "conversations_participant_1_participant_2_property_id_key";

alter table "public"."conversations" add constraint "conversations_participant_2_fkey" FOREIGN KEY (participant_2) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."conversations" validate constraint "conversations_participant_2_fkey";

alter table "public"."conversations" add constraint "conversations_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL not valid;

alter table "public"."conversations" validate constraint "conversations_property_id_fkey";

alter table "public"."messages" add constraint "messages_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_conversation_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."properties" add constraint "properties_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES agents(id) not valid;

alter table "public"."properties" validate constraint "properties_agent_id_fkey";

alter table "public"."properties" add constraint "properties_landlord_id_fkey" FOREIGN KEY (landlord_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."properties" validate constraint "properties_landlord_id_fkey";

alter table "public"."property_amenities" add constraint "property_amenities_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."property_amenities" validate constraint "property_amenities_property_id_fkey";

alter table "public"."property_images" add constraint "property_images_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."property_images" validate constraint "property_images_property_id_fkey";

alter table "public"."reviews" add constraint "reviews_landlord_id_fkey" FOREIGN KEY (landlord_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_landlord_id_fkey";

alter table "public"."reviews" add constraint "reviews_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_property_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."reviews" add constraint "reviews_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_reviewer_id_fkey";

alter table "public"."saved_properties" add constraint "saved_properties_property_id_fkey" FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE not valid;

alter table "public"."saved_properties" validate constraint "saved_properties_property_id_fkey";

alter table "public"."saved_properties" add constraint "saved_properties_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."saved_properties" validate constraint "saved_properties_user_id_fkey";

alter table "public"."saved_properties" add constraint "saved_properties_user_id_property_id_key" UNIQUE using index "saved_properties_user_id_property_id_key";

alter table "public"."search_alerts" add constraint "search_alerts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."search_alerts" validate constraint "search_alerts_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.assign_agent_to_landlord(p_agent_id uuid, p_landlord_id uuid, p_assignment_type text DEFAULT 'full'::text, p_permissions jsonb DEFAULT '["view", "edit", "create"]'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Check if caller is admin
  SELECT id INTO v_admin_id 
  FROM admin_users 
  WHERE user_id = auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only admins can assign agents';
  END IF;

  -- Create assignment
  INSERT INTO agent_assignments (
    agent_id, landlord_id, assigned_by, assignment_type, permissions
  ) VALUES (
    p_agent_id, p_landlord_id, v_admin_id, p_assignment_type, p_permissions
  )
  ON CONFLICT (agent_id, landlord_id) 
  DO UPDATE SET
    assignment_type = p_assignment_type,
    permissions = p_permissions,
    assigned_by = v_admin_id;

  RETURN jsonb_build_object('success', true);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_agent(p_email text, p_password text, p_first_name text, p_last_name text, p_phone text, p_agency_name text DEFAULT NULL::text, p_license_number text DEFAULT NULL::text, p_territory jsonb DEFAULT '[]'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid;
  v_profile_id uuid;
  v_agent_id uuid;
  v_agent_code text;
  v_admin_id uuid;
BEGIN
  -- Check if caller is admin
  SELECT id INTO v_admin_id 
  FROM admin_users 
  WHERE user_id = auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only admins can create agents';
  END IF;

  -- Generate unique agent code
  v_agent_code := 'AGT' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
  
  -- Check if agent code exists, regenerate if needed
  WHILE EXISTS (SELECT 1 FROM agents WHERE agent_code = v_agent_code) LOOP
    v_agent_code := 'AGT' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
  END LOOP;

  -- Create auth user (this would typically be done via Supabase Auth API)
  -- For now, we'll create the profile and agent record assuming user exists
  
  -- Create profile
  INSERT INTO profiles (
    email, first_name, last_name, phone, user_type
  ) VALUES (
    p_email, p_first_name, p_last_name, p_phone, 'agent'
  ) RETURNING id INTO v_profile_id;

  -- Create agent record
  INSERT INTO agents (
    profile_id, agent_code, agency_name, license_number, territory, created_by
  ) VALUES (
    v_profile_id, v_agent_code, p_agency_name, p_license_number, p_territory, v_admin_id
  ) RETURNING id INTO v_agent_id;

  RETURN jsonb_build_object(
    'success', true,
    'agent_id', v_agent_id,
    'agent_code', v_agent_code,
    'profile_id', v_profile_id
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_agent_dashboard(p_agent_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_agent_id uuid;
  v_result jsonb;
BEGIN
  -- If no agent_id provided, get current user's agent record
  IF p_agent_id IS NULL THEN
    SELECT id INTO v_agent_id 
    FROM agents 
    WHERE user_id = auth.uid();
  ELSE
    v_agent_id := p_agent_id;
  END IF;

  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Agent not found';
  END IF;

  -- Build dashboard data
  SELECT jsonb_build_object(
    'agent_info', (
      SELECT jsonb_build_object(
        'id', a.id,
        'agent_code', a.agent_code,
        'agency_name', a.agency_name,
        'status', a.status,
        'territory', a.territory
      )
      FROM agents a WHERE a.id = v_agent_id
    ),
    'assigned_landlords', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.first_name || ' ' || p.last_name,
          'email', p.email,
          'phone', p.phone
        )
      ), '[]'::jsonb)
      FROM agent_assignments aa
      JOIN profiles p ON aa.landlord_id = p.id
      WHERE aa.agent_id = v_agent_id
    ),
    'managed_properties', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', pr.id,
          'title', pr.title,
          'status', pr.status,
          'price', pr.price,
          'location', pr.city || ', ' || pr.state
        )
      ), '[]'::jsonb)
      FROM properties pr
      WHERE pr.agent_id = v_agent_id
         OR pr.landlord_id IN (
           SELECT aa.landlord_id FROM agent_assignments aa WHERE aa.agent_id = v_agent_id
         )
    ),
    'stats', (
      SELECT jsonb_build_object(
        'total_properties', COUNT(pr.id),
        'available_properties', COUNT(pr.id) FILTER (WHERE pr.status = 'available'),
        'rented_properties', COUNT(pr.id) FILTER (WHERE pr.status = 'rented'),
        'total_landlords', (
          SELECT COUNT(*) FROM agent_assignments aa WHERE aa.agent_id = v_agent_id
        )
      )
      FROM properties pr
      WHERE pr.agent_id = v_agent_id
         OR pr.landlord_id IN (
           SELECT aa.landlord_id FROM agent_assignments aa WHERE aa.agent_id = v_agent_id
         )
    )
  ) INTO v_result;

  RETURN v_result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.send_search_alert_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    alert record;
    user_email text;
    user_first_name text;
    listings_link text;
    update_preferences_link text;
    search_params jsonb;
BEGIN
    -- Loop through all active search alerts
    FOR alert IN
        SELECT sa.*, p.email as user_email, p.first_name as user_first_name
        FROM public.search_alerts sa
        JOIN public.profiles p ON sa.user_id = p.user_id
        WHERE sa.is_active = TRUE
          AND sa.email_notifications = TRUE
    LOOP
        -- Check if the new property matches the alert criteria
        IF (alert.location IS NULL OR NEW.city ILIKE '%' || alert.location || '%') AND
           (alert.property_type IS NULL OR NEW.property_type = alert.property_type) AND
           (alert.min_price IS NULL OR NEW.price >= alert.min_price) AND
           (alert.max_price IS NULL OR NEW.price <= alert.max_price) AND
           (alert.bedrooms IS NULL OR NEW.bedrooms >= alert.bedrooms::int) AND
           (alert.bathrooms IS NULL OR NEW.bathrooms >= alert.bathrooms::int) AND
           (alert.keywords IS NULL OR NEW.description ILIKE '%' || alert.keywords || '%' OR NEW.title ILIKE '%' || alert.keywords || '%')
        THEN
            -- Construct links
            listings_link := 'https://www.rentory.ng/search?city=' || COALESCE(alert.location, '') || '&min_price=' || COALESCE(alert.min_price::text, '') || '&max_price=' || COALESCE(alert.max_price::text, '') || '&bedrooms=' || COALESCE(alert.bedrooms, '') || '&bathrooms=' || COALESCE(alert.bathrooms, '') || '&keywords=' || COALESCE(alert.keywords, '');
            update_preferences_link := 'https://www.rentory.ng/dashboard/alerts';

            -- Prepare search parameters for the email template
            search_params := jsonb_build_object(
                'city', COALESCE(alert.location, 'Any'),
                'priceRange', COALESCE('₦' || alert.min_price::text || ' - ₦' || alert.max_price::text, 'Any'),
                'keywords', COALESCE(alert.keywords, 'Any')
            );

            -- Invoke the send-email Edge Function
            PERFORM net.http_post(
                'http://localhost:54321/functions/v1/send-email', -- Replace with your deployed Edge Function URL
                jsonb_build_object(
                    'to', alert.user_email,
                    'subject', 'New Homes That Match Your Search on Rentory 🏡',
                    'template', 'SearchAlertEmail',
                    'templateProps', jsonb_build_object(
                        'firstName', alert.user_first_name,
                        'searchParams', search_params,
                        'listingsLink', listings_link,
                        'updatePreferencesLink', update_preferences_link
                    )
                ),
                ARRAY[
                    jsonb_build_object('Content-Type', 'application/json'),
                    jsonb_build_object('Authorization', 'Bearer ' || 'YOUR_SUPABASE_SERVICE_ROLE_KEY') -- Replace with your Supabase Service Role Key
                ]::jsonb[]
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.send_user_verification_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_email text;
    user_first_name text;
    verification_link text;
BEGIN
    user_email := NEW.email;
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'User');

    -- Construct the verification link. This should match the emailRedirectTo in your client-side Supabase config.
    -- Supabase will append the necessary tokens to this URL.
    verification_link := 'https://www.rentory.ng/auth/callback'; -- Replace with your actual domain if different

    -- Invoke the send-email Edge Function
    PERFORM net.http_post(
        'http://localhost:54321/functions/v1/send-email', -- Replace with your deployed Edge Function URL
        jsonb_build_object(
            'to', user_email,
            'subject', 'Verify Your Rentory Account',
            'template', 'UserVerificationEmail',
            'templateProps', jsonb_build_object(
                'firstName', user_first_name,
                'verificationLink', verification_link
            )
        ),
        ARRAY[
            jsonb_build_object('Content-Type', 'application/json'),
            jsonb_build_object('Authorization', 'Bearer ' || 'YOUR_SUPABASE_SERVICE_ROLE_KEY') -- Replace with your Supabase Service Role Key
        ]::jsonb[]
    );

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."admin_users" to "anon";

grant insert on table "public"."admin_users" to "anon";

grant references on table "public"."admin_users" to "anon";

grant select on table "public"."admin_users" to "anon";

grant trigger on table "public"."admin_users" to "anon";

grant truncate on table "public"."admin_users" to "anon";

grant update on table "public"."admin_users" to "anon";

grant delete on table "public"."admin_users" to "authenticated";

grant insert on table "public"."admin_users" to "authenticated";

grant references on table "public"."admin_users" to "authenticated";

grant select on table "public"."admin_users" to "authenticated";

grant trigger on table "public"."admin_users" to "authenticated";

grant truncate on table "public"."admin_users" to "authenticated";

grant update on table "public"."admin_users" to "authenticated";

grant delete on table "public"."admin_users" to "service_role";

grant insert on table "public"."admin_users" to "service_role";

grant references on table "public"."admin_users" to "service_role";

grant select on table "public"."admin_users" to "service_role";

grant trigger on table "public"."admin_users" to "service_role";

grant truncate on table "public"."admin_users" to "service_role";

grant update on table "public"."admin_users" to "service_role";

grant delete on table "public"."agent_assignments" to "anon";

grant insert on table "public"."agent_assignments" to "anon";

grant references on table "public"."agent_assignments" to "anon";

grant select on table "public"."agent_assignments" to "anon";

grant trigger on table "public"."agent_assignments" to "anon";

grant truncate on table "public"."agent_assignments" to "anon";

grant update on table "public"."agent_assignments" to "anon";

grant delete on table "public"."agent_assignments" to "authenticated";

grant insert on table "public"."agent_assignments" to "authenticated";

grant references on table "public"."agent_assignments" to "authenticated";

grant select on table "public"."agent_assignments" to "authenticated";

grant trigger on table "public"."agent_assignments" to "authenticated";

grant truncate on table "public"."agent_assignments" to "authenticated";

grant update on table "public"."agent_assignments" to "authenticated";

grant delete on table "public"."agent_assignments" to "service_role";

grant insert on table "public"."agent_assignments" to "service_role";

grant references on table "public"."agent_assignments" to "service_role";

grant select on table "public"."agent_assignments" to "service_role";

grant trigger on table "public"."agent_assignments" to "service_role";

grant truncate on table "public"."agent_assignments" to "service_role";

grant update on table "public"."agent_assignments" to "service_role";

grant delete on table "public"."agents" to "anon";

grant insert on table "public"."agents" to "anon";

grant references on table "public"."agents" to "anon";

grant select on table "public"."agents" to "anon";

grant trigger on table "public"."agents" to "anon";

grant truncate on table "public"."agents" to "anon";

grant update on table "public"."agents" to "anon";

grant delete on table "public"."agents" to "authenticated";

grant insert on table "public"."agents" to "authenticated";

grant references on table "public"."agents" to "authenticated";

grant select on table "public"."agents" to "authenticated";

grant trigger on table "public"."agents" to "authenticated";

grant truncate on table "public"."agents" to "authenticated";

grant update on table "public"."agents" to "authenticated";

grant delete on table "public"."agents" to "service_role";

grant insert on table "public"."agents" to "service_role";

grant references on table "public"."agents" to "service_role";

grant select on table "public"."agents" to "service_role";

grant trigger on table "public"."agents" to "service_role";

grant truncate on table "public"."agents" to "service_role";

grant update on table "public"."agents" to "service_role";

grant delete on table "public"."applications" to "anon";

grant insert on table "public"."applications" to "anon";

grant references on table "public"."applications" to "anon";

grant select on table "public"."applications" to "anon";

grant trigger on table "public"."applications" to "anon";

grant truncate on table "public"."applications" to "anon";

grant update on table "public"."applications" to "anon";

grant delete on table "public"."applications" to "authenticated";

grant insert on table "public"."applications" to "authenticated";

grant references on table "public"."applications" to "authenticated";

grant select on table "public"."applications" to "authenticated";

grant trigger on table "public"."applications" to "authenticated";

grant truncate on table "public"."applications" to "authenticated";

grant update on table "public"."applications" to "authenticated";

grant delete on table "public"."applications" to "service_role";

grant insert on table "public"."applications" to "service_role";

grant references on table "public"."applications" to "service_role";

grant select on table "public"."applications" to "service_role";

grant trigger on table "public"."applications" to "service_role";

grant truncate on table "public"."applications" to "service_role";

grant update on table "public"."applications" to "service_role";

grant delete on table "public"."conversations" to "anon";

grant insert on table "public"."conversations" to "anon";

grant references on table "public"."conversations" to "anon";

grant select on table "public"."conversations" to "anon";

grant trigger on table "public"."conversations" to "anon";

grant truncate on table "public"."conversations" to "anon";

grant update on table "public"."conversations" to "anon";

grant delete on table "public"."conversations" to "authenticated";

grant insert on table "public"."conversations" to "authenticated";

grant references on table "public"."conversations" to "authenticated";

grant select on table "public"."conversations" to "authenticated";

grant trigger on table "public"."conversations" to "authenticated";

grant truncate on table "public"."conversations" to "authenticated";

grant update on table "public"."conversations" to "authenticated";

grant delete on table "public"."conversations" to "service_role";

grant insert on table "public"."conversations" to "service_role";

grant references on table "public"."conversations" to "service_role";

grant select on table "public"."conversations" to "service_role";

grant trigger on table "public"."conversations" to "service_role";

grant truncate on table "public"."conversations" to "service_role";

grant update on table "public"."conversations" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."properties" to "anon";

grant insert on table "public"."properties" to "anon";

grant references on table "public"."properties" to "anon";

grant select on table "public"."properties" to "anon";

grant trigger on table "public"."properties" to "anon";

grant truncate on table "public"."properties" to "anon";

grant update on table "public"."properties" to "anon";

grant delete on table "public"."properties" to "authenticated";

grant insert on table "public"."properties" to "authenticated";

grant references on table "public"."properties" to "authenticated";

grant select on table "public"."properties" to "authenticated";

grant trigger on table "public"."properties" to "authenticated";

grant truncate on table "public"."properties" to "authenticated";

grant update on table "public"."properties" to "authenticated";

grant delete on table "public"."properties" to "service_role";

grant insert on table "public"."properties" to "service_role";

grant references on table "public"."properties" to "service_role";

grant select on table "public"."properties" to "service_role";

grant trigger on table "public"."properties" to "service_role";

grant truncate on table "public"."properties" to "service_role";

grant update on table "public"."properties" to "service_role";

grant delete on table "public"."property_amenities" to "anon";

grant insert on table "public"."property_amenities" to "anon";

grant references on table "public"."property_amenities" to "anon";

grant select on table "public"."property_amenities" to "anon";

grant trigger on table "public"."property_amenities" to "anon";

grant truncate on table "public"."property_amenities" to "anon";

grant update on table "public"."property_amenities" to "anon";

grant delete on table "public"."property_amenities" to "authenticated";

grant insert on table "public"."property_amenities" to "authenticated";

grant references on table "public"."property_amenities" to "authenticated";

grant select on table "public"."property_amenities" to "authenticated";

grant trigger on table "public"."property_amenities" to "authenticated";

grant truncate on table "public"."property_amenities" to "authenticated";

grant update on table "public"."property_amenities" to "authenticated";

grant delete on table "public"."property_amenities" to "service_role";

grant insert on table "public"."property_amenities" to "service_role";

grant references on table "public"."property_amenities" to "service_role";

grant select on table "public"."property_amenities" to "service_role";

grant trigger on table "public"."property_amenities" to "service_role";

grant truncate on table "public"."property_amenities" to "service_role";

grant update on table "public"."property_amenities" to "service_role";

grant delete on table "public"."property_images" to "anon";

grant insert on table "public"."property_images" to "anon";

grant references on table "public"."property_images" to "anon";

grant select on table "public"."property_images" to "anon";

grant trigger on table "public"."property_images" to "anon";

grant truncate on table "public"."property_images" to "anon";

grant update on table "public"."property_images" to "anon";

grant delete on table "public"."property_images" to "authenticated";

grant insert on table "public"."property_images" to "authenticated";

grant references on table "public"."property_images" to "authenticated";

grant select on table "public"."property_images" to "authenticated";

grant trigger on table "public"."property_images" to "authenticated";

grant truncate on table "public"."property_images" to "authenticated";

grant update on table "public"."property_images" to "authenticated";

grant delete on table "public"."property_images" to "service_role";

grant insert on table "public"."property_images" to "service_role";

grant references on table "public"."property_images" to "service_role";

grant select on table "public"."property_images" to "service_role";

grant trigger on table "public"."property_images" to "service_role";

grant truncate on table "public"."property_images" to "service_role";

grant update on table "public"."property_images" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."saved_properties" to "anon";

grant insert on table "public"."saved_properties" to "anon";

grant references on table "public"."saved_properties" to "anon";

grant select on table "public"."saved_properties" to "anon";

grant trigger on table "public"."saved_properties" to "anon";

grant truncate on table "public"."saved_properties" to "anon";

grant update on table "public"."saved_properties" to "anon";

grant delete on table "public"."saved_properties" to "authenticated";

grant insert on table "public"."saved_properties" to "authenticated";

grant references on table "public"."saved_properties" to "authenticated";

grant select on table "public"."saved_properties" to "authenticated";

grant trigger on table "public"."saved_properties" to "authenticated";

grant truncate on table "public"."saved_properties" to "authenticated";

grant update on table "public"."saved_properties" to "authenticated";

grant delete on table "public"."saved_properties" to "service_role";

grant insert on table "public"."saved_properties" to "service_role";

grant references on table "public"."saved_properties" to "service_role";

grant select on table "public"."saved_properties" to "service_role";

grant trigger on table "public"."saved_properties" to "service_role";

grant truncate on table "public"."saved_properties" to "service_role";

grant update on table "public"."saved_properties" to "service_role";

grant delete on table "public"."search_alerts" to "anon";

grant insert on table "public"."search_alerts" to "anon";

grant references on table "public"."search_alerts" to "anon";

grant select on table "public"."search_alerts" to "anon";

grant trigger on table "public"."search_alerts" to "anon";

grant truncate on table "public"."search_alerts" to "anon";

grant update on table "public"."search_alerts" to "anon";

grant delete on table "public"."search_alerts" to "authenticated";

grant insert on table "public"."search_alerts" to "authenticated";

grant references on table "public"."search_alerts" to "authenticated";

grant select on table "public"."search_alerts" to "authenticated";

grant trigger on table "public"."search_alerts" to "authenticated";

grant truncate on table "public"."search_alerts" to "authenticated";

grant update on table "public"."search_alerts" to "authenticated";

grant delete on table "public"."search_alerts" to "service_role";

grant insert on table "public"."search_alerts" to "service_role";

grant references on table "public"."search_alerts" to "service_role";

grant select on table "public"."search_alerts" to "service_role";

grant trigger on table "public"."search_alerts" to "service_role";

grant truncate on table "public"."search_alerts" to "service_role";

grant update on table "public"."search_alerts" to "service_role";

create policy "Admins can view other admins"
on "public"."admin_users"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM admin_users au
  WHERE (au.user_id = auth.uid()))));


create policy "Super admins can manage all admin users"
on "public"."admin_users"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM admin_users au
  WHERE ((au.user_id = auth.uid()) AND (au.admin_level = 'super'::text)))));


create policy "Admins can manage agent assignments"
on "public"."agent_assignments"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM admin_users au
  WHERE (au.user_id = auth.uid()))));


create policy "Agents can view their assignments"
on "public"."agent_assignments"
as permissive
for select
to authenticated
using ((agent_id IN ( SELECT agents.id
   FROM agents
  WHERE (agents.user_id = auth.uid()))));


create policy "Admins can manage agents"
on "public"."agents"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM admin_users au
  WHERE (au.user_id = auth.uid()))));


create policy "Agents can update their own profile"
on "public"."agents"
as permissive
for update
to authenticated
using ((user_id = auth.uid()));


create policy "Agents can view their own profile"
on "public"."agents"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Renters can create applications"
on "public"."applications"
as permissive
for insert
to authenticated
with check ((applicant_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


create policy "Users can update own applications"
on "public"."applications"
as permissive
for update
to authenticated
using (((applicant_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))) OR (property_id IN ( SELECT properties.id
   FROM properties
  WHERE (properties.landlord_id IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid())))))));


create policy "Users can view own applications"
on "public"."applications"
as permissive
for select
to authenticated
using (((applicant_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))) OR (property_id IN ( SELECT properties.id
   FROM properties
  WHERE (properties.landlord_id IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid())))))));


create policy "Users can create conversations"
on "public"."conversations"
as permissive
for insert
to authenticated
with check (((participant_1 IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))) OR (participant_2 IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid())))));


create policy "Users can view own conversations"
on "public"."conversations"
as permissive
for select
to authenticated
using (((participant_1 IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))) OR (participant_2 IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid())))));


create policy "Users can send messages"
on "public"."messages"
as permissive
for insert
to authenticated
with check (((sender_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))) AND (conversation_id IN ( SELECT conversations.id
   FROM conversations
  WHERE ((conversations.participant_1 IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid()))) OR (conversations.participant_2 IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid()))))))));


create policy "Users can view messages in own conversations"
on "public"."messages"
as permissive
for select
to authenticated
using ((conversation_id IN ( SELECT conversations.id
   FROM conversations
  WHERE ((conversations.participant_1 IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid()))) OR (conversations.participant_2 IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid())))))));


create policy "Users can insert own profile"
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));


create policy "Users can view all profiles"
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Agents can manage assigned landlord properties"
on "public"."properties"
as permissive
for all
to authenticated
using (((agent_id IN ( SELECT agents.id
   FROM agents
  WHERE (agents.user_id = auth.uid()))) OR (landlord_id IN ( SELECT aa.landlord_id
   FROM (agent_assignments aa
     JOIN agents a ON ((aa.agent_id = a.id)))
  WHERE (a.user_id = auth.uid())))));


create policy "Anyone can view available properties"
on "public"."properties"
as permissive
for select
to public
using (((status = 'available'::property_status) OR (status = 'rented'::property_status)));


create policy "Landlords can insert properties"
on "public"."properties"
as permissive
for insert
to authenticated
with check ((landlord_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


create policy "Landlords can manage own properties"
on "public"."properties"
as permissive
for all
to authenticated
using ((landlord_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


create policy "Anyone can view amenities"
on "public"."property_amenities"
as permissive
for select
to public
using (true);


create policy "Property owners can manage amenities"
on "public"."property_amenities"
as permissive
for all
to authenticated
using ((property_id IN ( SELECT properties.id
   FROM properties
  WHERE (properties.landlord_id IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid()))))));


create policy "Anyone can view property images"
on "public"."property_images"
as permissive
for select
to public
using (true);


create policy "Property owners can manage images"
on "public"."property_images"
as permissive
for all
to authenticated
using ((property_id IN ( SELECT properties.id
   FROM properties
  WHERE (properties.landlord_id IN ( SELECT profiles.id
           FROM profiles
          WHERE (profiles.user_id = auth.uid()))))));


create policy "Anyone can view reviews"
on "public"."reviews"
as permissive
for select
to public
using (true);


create policy "Users can create reviews"
on "public"."reviews"
as permissive
for insert
to authenticated
with check ((reviewer_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


create policy "Users can update own reviews"
on "public"."reviews"
as permissive
for update
to authenticated
using ((reviewer_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


create policy "Users can manage own saved properties"
on "public"."saved_properties"
as permissive
for all
to authenticated
using ((user_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


create policy "Users can view own saved properties"
on "public"."saved_properties"
as permissive
for select
to authenticated
using ((user_id IN ( SELECT profiles.id
   FROM profiles
  WHERE (profiles.user_id = auth.uid()))));


CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_new_property_alert AFTER INSERT OR UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION send_search_alert_email();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


