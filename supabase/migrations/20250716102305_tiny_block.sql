/*
  # Email Templates with Professional Design
  
  1. New Functions
    - send_verification_email: User email verification
    - send_search_alert_email: Property search alerts
    - send_password_reset_email: Password reset functionality
    - send_welcome_email: Welcome new users
    - send_application_notification_email: Notify about new applications
    
  2. Design Features
    - Professional HTML/CSS styling
    - Green color scheme (avoiding blue)
    - Responsive design
    - Button-style CTAs
    - Consistent branding
*/

-- Drop existing email functions to recreate with new templates
DROP FUNCTION IF EXISTS send_verification_email(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS send_search_alert_email(TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS send_password_reset_email(TEXT, TEXT);
DROP FUNCTION IF EXISTS send_welcome_email(TEXT, TEXT);
DROP FUNCTION IF EXISTS send_application_notification_email(TEXT, JSONB);

-- 1. User Verification Email
CREATE OR REPLACE FUNCTION send_verification_email(
    to_email TEXT,
    user_first_name TEXT,
    verification_link TEXT
)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'Verify Your Rentory Account';
    html_body TEXT := '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Rentory Account</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f0fdf4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-subtitle {
            color: #dcfce7;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px -3px rgba(22, 163, 74, 0.4);
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 30px;
            line-height: 1.6;
        }
        .brand-link {
            color: #16a34a;
            text-decoration: none;
            font-weight: 500;
        }
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">🏠 Rentory</div>
                <p class="header-subtitle">Nigeria''s Digital-First Rental Platform</p>
            </div>
            <div class="content">
                <div class="greeting">Hi ' || user_first_name || ',</div>
                <div class="message">
                    Welcome to Rentory — your smarter way to find or lease a home in Nigeria. To activate your account and start exploring verified listings, please confirm your email address.
                </div>
                <div style="text-align: center;">
                    <a href="' || verification_link || '" class="cta-button">Verify My Email</a>
                </div>
                <div class="divider"></div>
                <div class="footer-text">
                    If you didn''t sign up for Rentory, please ignore this message.
                    <br><br>
                    Thank you,<br>
                    The Rentory Team<br>
                    <a href="https://www.rentory.ng" class="brand-link">www.rentory.ng</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
BEGIN
    PERFORM send_email(to_email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- 2. Search Alert Email
CREATE OR REPLACE FUNCTION send_search_alert_email(
    to_email TEXT,
    user_first_name TEXT,
    search_filters JSONB
)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'New Homes That Match Your Search on Rentory 🏡';
    html_body TEXT := '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Properties Match Your Search</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f0fdf4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-subtitle {
            color: #dcfce7;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        .search-details {
            background: #f9fafb;
            border-left: 4px solid #16a34a;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .search-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .search-icon {
            margin-right: 10px;
            font-size: 16px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
        }
        .secondary-link {
            color: #16a34a;
            text-decoration: none;
            font-weight: 500;
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 30px;
            line-height: 1.6;
        }
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">🏠 Rentory</div>
                <p class="header-subtitle">New Properties Available</p>
            </div>
            <div class="content">
                <div class="greeting">Hi ' || user_first_name || ',</div>
                <div class="message">
                    Good news! We found new listings that match your search:
                </div>
                <div class="search-details">
                    <div class="search-item">
                        <span class="search-icon">📍</span>
                        <strong>Location:</strong> ' || COALESCE(search_filters->>'city', 'Any City') || ', ' || COALESCE(search_filters->>'state', 'Nigeria') || '
                    </div>
                    <div class="search-item">
                        <span class="search-icon">💰</span>
                        <strong>Price Range:</strong> ₦' || COALESCE(search_filters->>'min_price', '0') || ' - ₦' || COALESCE(search_filters->>'max_price', '∞') || '
                    </div>
                    <div class="search-item">
                        <span class="search-icon">🏠</span>
                        <strong>Details:</strong> ' || COALESCE(search_filters->>'bedrooms', 'Any') || ' beds • ' || COALESCE(search_filters->>'bathrooms', 'Any') || ' baths
                    </div>
                </div>
                <div style="text-align: center;">
                    <a href="https://www.rentory.ng/search" class="cta-button">View New Listings</a>
                </div>
                <div class="message">
                    You''ll continue to receive updates as new homes become available.
                </div>
                <div class="message">
                    Need to adjust your search filters? 
                    <a href="https://www.rentory.ng/dashboard/alerts" class="secondary-link">Update Search Preferences</a>
                </div>
                <div class="divider"></div>
                <div class="footer-text">
                    Happy house hunting,<br>
                    The Rentory Team
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
BEGIN
    PERFORM send_email(to_email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- 3. Password Reset Email
CREATE OR REPLACE FUNCTION send_password_reset_email(
    to_email TEXT,
    reset_link TEXT
)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'Reset Your Rentory Password';
    html_body TEXT := '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f0fdf4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-subtitle {
            color: #fecaca;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
            font-size: 14px;
            color: #92400e;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 30px;
            line-height: 1.6;
        }
        .brand-link {
            color: #16a34a;
            text-decoration: none;
            font-weight: 500;
        }
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">🔐 Rentory</div>
                <p class="header-subtitle">Password Reset Request</p>
            </div>
            <div class="content">
                <div class="greeting">Hi,</div>
                <div class="message">
                    We received a request to reset your password for your Rentory account. If this was you, please click the button below to create a new password:
                </div>
                <div style="text-align: center;">
                    <a href="' || reset_link || '" class="cta-button">Reset My Password</a>
                </div>
                <div class="warning-box">
                    ⏰ This link is valid for the next 30 minutes for security reasons.
                </div>
                <div class="message">
                    If you didn''t request this password reset, you can safely ignore this message.
                </div>
                <div class="message">
                    Need help? Contact <a href="mailto:support@rentory.ng" class="brand-link">support@rentory.ng</a>
                </div>
                <div class="divider"></div>
                <div class="footer-text">
                    Stay safe,<br>
                    The Rentory Team<br>
                    <a href="https://www.rentory.ng" class="brand-link">www.rentory.ng</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
BEGIN
    PERFORM send_email(to_email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- 4. Welcome Email (Updated)
CREATE OR REPLACE FUNCTION send_welcome_email(
    to_email TEXT,
    user_type TEXT
)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'Welcome to Rentory – Let''s Get Started!';
    html_body TEXT := '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Rentory</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f0fdf4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-subtitle {
            color: #dcfce7;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        .feature-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 30px;
            line-height: 1.6;
        }
        .brand-link {
            color: #16a34a;
            text-decoration: none;
            font-weight: 500;
        }
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">🏠 Rentory</div>
                <p class="header-subtitle">Welcome to Nigeria''s Digital-First Rental Platform</p>
            </div>
            <div class="content">
                <div class="greeting">Hi there,</div>
                <div class="message">
                    Welcome to Rentory! We''re excited to have you onboard.
                </div>
                <div class="message">
                    As a new <strong>' || INITCAP(user_type) || '</strong>, you now have access to a smarter, faster, and more transparent rental experience in Nigeria. Whether you''re here to find your next home or lease one out, Rentory gives you the tools to do it all — with no agent stress.
                </div>
                <div class="feature-box">
                    <strong>🚀 What you can do now:</strong><br>
                    • Browse verified properties<br>
                    • Connect directly with landlords<br>
                    • Apply for rentals online<br>
                    • Save on agent fees
                </div>
                <div style="text-align: center;">
                    <a href="https://www.rentory.ng/login" class="cta-button">Log In to Get Started</a>
                </div>
                <div class="message">
                    Need help setting up your profile or listing a property? Just reply to this email — we''re here to help.
                </div>
                <div class="divider"></div>
                <div class="footer-text">
                    Cheers,<br>
                    The Rentory Team<br>
                    <a href="https://www.rentory.ng" class="brand-link">www.rentory.ng</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
BEGIN
    PERFORM send_email(to_email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- 5. Application Notification Email
CREATE OR REPLACE FUNCTION send_application_notification_email(
    to_email TEXT,
    application_data JSONB
)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'New Rental Application Received';
    html_body TEXT := '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Application Received</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f0fdf4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-subtitle {
            color: #e9d5ff;
            font-size: 16px;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        .application-details {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .detail-row {
            display: flex;
            margin-bottom: 12px;
            font-size: 15px;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 120px;
        }
        .detail-value {
            color: #6b7280;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.3);
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-top: 30px;
            line-height: 1.6;
        }
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-card">
            <div class="header">
                <div class="logo">📋 Rentory</div>
                <p class="header-subtitle">New Application Alert</p>
            </div>
            <div class="content">
                <div class="greeting">Hello,</div>
                <div class="message">
                    A new rental application has been submitted on Rentory. Here are the details:
                </div>
                <div class="application-details">
                    <div class="detail-row">
                        <span class="detail-label">Applicant Name:</span>
                        <span class="detail-value">' || COALESCE(application_data->>'name', 'Not provided') || '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">' || COALESCE(application_data->>'email', 'Not provided') || '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">' || COALESCE(application_data->>'phone', 'Not provided') || '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Property ID:</span>
                        <span class="detail-value">' || COALESCE(application_data->>'propertyId', 'Not provided') || '</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Message:</span>
                        <span class="detail-value">' || COALESCE(application_data->>'message', 'No message provided') || '</span>
                    </div>
                </div>
                <div style="text-align: center;">
                    <a href="https://www.rentory.ng/admin" class="cta-button">View Application</a>
                </div>
                <div class="message">
                    Please review the application and take necessary action through your admin dashboard.
                </div>
                <div class="divider"></div>
                <div class="footer-text">
                    Best regards,<br>
                    Rentory Notification System
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
BEGIN
    PERFORM send_email(to_email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- Update the handle_new_user trigger to use the new welcome email function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_first_name TEXT;
    user_last_name TEXT;
    user_type_value TEXT;
    user_phone TEXT;
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
    
    -- Send welcome email (non-blocking)
    BEGIN
        PERFORM send_welcome_email(NEW.email, user_type_value);
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