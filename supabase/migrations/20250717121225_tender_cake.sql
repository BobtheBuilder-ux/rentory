/*
  # Create Admin User and Profile
  
  1. Creates admin user in auth.users table
  2. Creates corresponding profile with admin privileges
  3. Handles existing user scenario
*/

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'admin@rentory.ng';
    admin_password TEXT := 'AdminRentory2024!';
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    -- If user doesn't exist, create them
    IF admin_user_id IS NULL THEN
        -- Insert into auth.users table directly
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            admin_email,
            crypt(admin_password, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"user_type": "admin", "first_name": "Admin", "last_name": "Rentory"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO admin_user_id;
        
        RAISE NOTICE 'Created admin user with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;
    
    -- Create or update profile
    INSERT INTO profiles (
        id, 
        user_type, 
        is_super_admin, 
        first_name, 
        last_name, 
        email, 
        phone, 
        verification_status,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin',
        TRUE,
        'Admin',
        'Rentory',
        admin_email,
        '123-456-7890',
        'verified',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        user_type = EXCLUDED.user_type,
        is_super_admin = EXCLUDED.is_super_admin,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        verification_status = EXCLUDED.verification_status,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin profile created/updated successfully';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating admin user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create admin user
SELECT create_admin_user();

-- Drop the function after use
DROP FUNCTION create_admin_user();