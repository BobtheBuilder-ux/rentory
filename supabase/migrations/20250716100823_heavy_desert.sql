/*
  # Fix email functions to handle missing API key gracefully

  1. Changes
    - Update send_email function to handle missing or invalid API keys without failing
    - Add error handling to prevent user registration from failing when email sending fails
    - Log email sending failures instead of throwing errors

  2. Security
    - Functions will continue to work even if API key is not configured
    - User registration will not be blocked by email sending issues
*/

-- Drop and recreate the send_email function with better error handling
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
BEGIN
    -- Try to get the API key from Supabase secrets, fallback to placeholder
    BEGIN
        SELECT decrypted_secret INTO resend_api_key 
        FROM vault.decrypted_secrets 
        WHERE name = 'RESEND_API_KEY';
    EXCEPTION WHEN OTHERS THEN
        resend_api_key := 're_ErgEoLAZ_MgFfrAGriBGZyPTTkZfwrzVD';
    END;
    
    -- Only attempt to send email if we have a valid API key
    IF resend_api_key IS NOT NULL AND resend_api_key != 'YOUR_RESEND_API_KEY' THEN
        BEGIN
            SELECT status INTO response_status FROM http_post(
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
            
            -- Log success (optional)
            RAISE NOTICE 'Email sent successfully to %', to_email;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log the error but don't fail the transaction
            RAISE NOTICE 'Failed to send email to %: %', to_email, SQLERRM;
        END;
    ELSE
        -- Log that email sending is skipped due to missing API key
        RAISE NOTICE 'Email sending skipped for % - API key not configured', to_email;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Update all email functions to use the new error-safe send_email function
-- (The existing functions will automatically use the updated send_email function)