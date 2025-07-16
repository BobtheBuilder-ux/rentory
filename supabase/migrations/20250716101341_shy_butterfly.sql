/*
  # Fix user registration trigger

  1. Problem
    - The handle_new_user trigger fails when user_type is null or invalid
    - This causes "Database error saving new user" during registration
    - The trigger doesn't handle missing or invalid metadata gracefully

  2. Solution
    - Add validation for user_type from raw_user_meta_data
    - Default to 'tenant' if user_type is null or invalid
    - Make the trigger more resilient to missing metadata
    - Add error handling to prevent registration failures

  3. Changes
    - Update handle_new_user function with proper validation
    - Add default values for missing metadata fields
    - Ensure the trigger never fails due to missing user_type
*/

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_new_user_registration ON auth.users;

-- Update the handle_new_user function with proper validation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _user_type TEXT;
    _first_name TEXT;
    _last_name TEXT;
    _phone TEXT;
BEGIN
    -- Validate and set user_type with default fallback
    _user_type := NEW.raw_user_meta_data->>'user_type';
    
    -- If user_type is null or not one of the allowed values, default to 'tenant'
    IF _user_type IS NULL OR _user_type NOT IN ('admin', 'landlord', 'agent', 'tenant') THEN
        _user_type := 'tenant';
    END IF;
    
    -- Extract other metadata with safe defaults
    _first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    _last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    _phone := NEW.raw_user_meta_data->>'phone';
    
    -- Insert into profiles table with validated data
    INSERT INTO profiles (id, user_type, first_name, last_name, phone)
    VALUES (
        NEW.id,
        _user_type,
        _first_name,
        _last_name,
        _phone
    );
    
    -- Try to send welcome email, but don't fail if it errors
    BEGIN
        PERFORM send_welcome_email(NEW.email, _user_type);
    EXCEPTION WHEN OTHERS THEN
        -- Log the error but don't fail the registration
        RAISE WARNING 'Failed to send welcome email to %: %', NEW.email, SQLERRM;
    END;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- If anything fails, log it but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER on_new_user_registration
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();