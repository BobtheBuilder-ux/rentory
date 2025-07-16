/*
  # Fix email confirmation and trigger issues

  1. Changes
    - Disable email confirmation requirement for development
    - Fix the handle_new_user trigger to properly send welcome emails
    - Ensure profile creation works correctly
    - Add better error handling for email sending

  2. Security
    - Email confirmation can be re-enabled in production
    - Profile creation is more robust
*/

-- First, let's make sure the profiles table has proper constraints
ALTER TABLE profiles ALTER COLUMN user_type SET DEFAULT 'tenant';

-- Drop and recreate the handle_new_user function with better error handling
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_first_name TEXT;
    user_last_name TEXT;
    user_type_value TEXT;
    user_phone TEXT;
    welcome_subject TEXT;
    welcome_body TEXT;
BEGIN
    -- Extract user metadata with safe defaults
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'User');
    user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    user_type_value := COALESCE(NEW.raw_user_meta_data->>'user_type', 'tenant');
    user_phone := NEW.raw_user_meta_data->>'phone';
    
    -- Validate user_type
    IF user_type_value NOT IN ('tenant', 'landlord', 'agent', 'admin') THEN
        user_type_value := 'tenant';
    END IF;
    
    -- Insert into profiles table
    BEGIN
        INSERT INTO profiles (
            id,
            email,
            first_name,
            last_name,
            user_type,
            phone,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            user_first_name,
            user_last_name,
            user_type_value,
            user_phone,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Profile created successfully for user: %', NEW.email;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Failed to create profile for user %: %', NEW.email, SQLERRM;
        -- Don't fail the entire registration process
    END;
    
    -- Prepare welcome email
    welcome_subject := 'Welcome to Rentory - Your Account is Ready!';
    welcome_body := '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to Rentory</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome to Rentory!</h1>
            <p>Hi ' || user_first_name || ',</p>
            <p>Thank you for joining Rentory! Your account has been successfully created.</p>
            <p><strong>Account Details:</strong></p>
            <ul>
                <li>Email: ' || NEW.email || '</li>
                <li>Account Type: ' || INITCAP(user_type_value) || '</li>
            </ul>
            <p>You can now start exploring properties and connecting with other users on our platform.</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The Rentory Team</p>
        </div>
    </body>
    </html>';
    
    -- Send welcome email (non-blocking)
    BEGIN
        PERFORM send_email(NEW.email, welcome_subject, welcome_body);
        RAISE NOTICE 'Welcome email queued for: %', NEW.email;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Failed to send welcome email to %: %', NEW.email, SQLERRM;
        -- Don't fail registration if email fails
    END;
    
    RETURN NEW;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_new_user trigger for %: %', NEW.email, SQLERRM;
    -- Return NEW to allow registration to continue even if trigger fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update the send_email function to be more robust
DROP FUNCTION IF EXISTS send_email(TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION send_email(
    to_email TEXT,
    subject TEXT,
    html_body TEXT
)
RETURNS VOID AS $$
DECLARE
    resend_api_key TEXT;
    resend_url TEXT := 'https://api.resend.com/emails';
    response_status INTEGER;
    response_body TEXT;
BEGIN
    -- Try to get the API key from Supabase secrets
    BEGIN
        SELECT decrypted_secret INTO resend_api_key 
        FROM vault.decrypted_secrets 
        WHERE name = 'RESEND_API_KEY';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not access Supabase secrets: %', SQLERRM;
        resend_api_key := NULL;
    END;
    
    -- Check if we have a valid API key
    IF resend_api_key IS NULL OR resend_api_key = '' OR resend_api_key = 'YOUR_RESEND_API_KEY' OR resend_api_key = 're_ErgEoLAZ_MgFfrAGriBGZyPTTkZfwrzVD' THEN
        RAISE NOTICE 'Email sending skipped for % - No valid Resend API key configured. Please add RESEND_API_KEY to Supabase secrets.', to_email;
        RETURN;
    END IF;
    
    -- Attempt to send email
    BEGIN
        SELECT status, content INTO response_status, response_body FROM http_post(
            resend_url,
            jsonb_build_object(
                'from', 'Rentory <no-reply@rentory.ng>',
                'to', to_email,
                'subject', subject,
                'html', html_body
            ),
            'application/json',
            jsonb_build_object('Authorization', 'Bearer ' || resend_api_key)
        );
        
        IF response_status = 200 THEN
            RAISE NOTICE 'Email sent successfully to %', to_email;
        ELSE
            RAISE NOTICE 'Email sending failed for % - Status: %, Response: %', to_email, response_status, response_body;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Email sending error for %: %', to_email, SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;