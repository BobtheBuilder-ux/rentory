-- Create a function to send user verification email
CREATE OR REPLACE FUNCTION public.send_user_verification_email()
RETURNS TRIGGER AS $$
DECLARE
    user_email text;
    user_first_name text;
    verification_link text;
BEGIN
    user_email := NEW.email;
    user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'User');

    -- Construct the verification link. This should match the emailRedirectTo in your client-side Supabase config.
    -- Supabase will append the necessary tokens to this URL.
    verification_link := 'http://localhost:3000/auth/callback'; -- For local development. Replace with your deployed domain (e.g., 'https://www.rentory.ng/auth/callback') for production.

    -- Invoke the send-email Edge Function
    PERFORM net.http_post(
        'https://imitoplbhekjoumdlhfq.supabase.co/functions/v1/send-email', -- Replace 'imitoplbhekjoumdlhfq' with your actual Supabase project reference
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
            jsonb_build_object('Authorization', 'Bearer ' || 'YOUR_SUPABASE_SERVICE_ROLE_KEY') -- IMPORTANT: Replace 'YOUR_SUPABASE_SERVICE_ROLE_KEY' with your actual Supabase Service Role Key
        ]::jsonb[]
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function after a new user is inserted into auth.users
CREATE TRIGGER trg_new_user_verification
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.send_user_verification_email();
