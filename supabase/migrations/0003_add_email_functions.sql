-- Enable the http extension
CREATE EXTENSION IF NOT EXISTS http;

-- Function to send an email using Resend
CREATE OR REPLACE FUNCTION send_email(
    to_email TEXT,
    subject TEXT,
    html_body TEXT
)
RETURNS VOID AS $$
DECLARE
    resend_api_key TEXT := 'YOUR_RESEND_API_KEY'; -- Replace with your Resend API key from Supabase secrets
    resend_url TEXT := 'https://api.resend.com/emails';
BEGIN
    PERFORM http_post(
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
END;
$$ LANGUAGE plpgsql;

-- Function to send a welcome email
CREATE OR REPLACE FUNCTION send_welcome_email(email TEXT, user_type TEXT)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'Welcome to Rentory – Let’s Get Started!';
    html_body TEXT := '<!DOCTYPE html>
<html>
<head>
<style>
  /* Tailwind CSS styles */
  .bg-green-50 { background-color: #f0fdf4; }
  .text-gray-900 { color: #111827; }
  .font-bold { font-weight: 700; }
  .text-3xl { font-size: 1.875rem; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-600 { color: #4b5563; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-2 { margin-top: 0.5rem; }
  .p-6 { padding: 1.5rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .bg-white { background-color: #ffffff; }
  .text-center { text-align: center; }
  .text-green-600 { color: #16a34a; }
  .hover\:text-green-500:hover { color: #22c55e; }
  .inline-block { display: inline-block; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .bg-green-600 { background-color: #16a34a; }
  .hover\:bg-green-700:hover { background-color: #15803d; }
  .text-white { color: #ffffff; }
  .no-underline { text-decoration: none; }
</style>
</head>
<body class="bg-green-50" style="font-family: sans-serif;">
  <div class="p-6">
    <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Welcome to Rentory!</h1>
        <p class="mt-2 text-sm text-gray-600">Let’s Get Started!</p>
      </div>
      <div class="mt-6">
        <p class="text-sm text-gray-600">Hi there,</p>
        <p class="mt-2 text-sm text-gray-600">Welcome to Rentory! We''re excited to have you onboard.</p>
        <p class="mt-2 text-sm text-gray-600">As a new ' || user_type || ', you now have access to a smarter, faster, and more transparent rental experience in Nigeria. Whether you''re here to find your next home or lease one out, Rentory gives you the tools to do it all — with no agent stress.</p>
        <div class="mt-6 text-center">
          <a href="https://www.rentory.ng/login" class="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg no-underline hover:bg-green-700">Log in to get started</a>
        </div>
        <p class="mt-6 text-sm text-gray-600">Need help setting up your profile or listing a property? Just reply to this email — we’re here to help.</p>
        <p class="mt-2 text-sm text-gray-600">Cheers,<br>The Rentory Team<br><a href="https://www.rentory.ng" class="text-green-600 hover:text-green-500">www.rentory.ng</a></p>
      </div>
    </div>
  </div>
</body>
</html>';
BEGIN
    PERFORM send_email(email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- Function to send a password reset email
CREATE OR REPLACE FUNCTION send_password_reset_email(email TEXT, reset_link TEXT)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'Reset Your Rentory Password';
    html_body TEXT := '<!DOCTYPE html>
<html>
<head>
<style>
  /* Tailwind CSS styles */
  .bg-green-50 { background-color: #f0fdf4; }
  .text-gray-900 { color: #111827; }
  .font-bold { font-weight: 700; }
  .text-3xl { font-size: 1.875rem; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-600 { color: #4b5563; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-2 { margin-top: 0.5rem; }
  .p-6 { padding: 1.5rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .bg-white { background-color: #ffffff; }
  .text-center { text-align: center; }
  .text-green-600 { color: #16a34a; }
  .hover\:text-green-500:hover { color: #22c55e; }
  .inline-block { display: inline-block; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .bg-green-600 { background-color: #16a34a; }
  .hover\:bg-green-700:hover { background-color: #15803d; }
  .text-white { color: #ffffff; }
  .no-underline { text-decoration: none; }
</style>
</head>
<body class="bg-green-50" style="font-family: sans-serif;">
  <div class="p-6">
    <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Reset Your Password</h1>
      </div>
      <div class="mt-6">
        <p class="text-sm text-gray-600">Hi,</p>
        <p class="mt-2 text-sm text-gray-600">We received a request to reset your password for your Rentory account. If this was you, please click the button below to create a new password:</p>
        <div class="mt-6 text-center">
          <a href="' || reset_link || '" class="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg no-underline hover:bg-green-700">Reset Password</a>
        </div>
        <p class="mt-6 text-sm text-gray-600">This link is valid for the next 30 minutes. If you did not make this request, you can safely ignore this message.</p>
        <p class="mt-2 text-sm text-gray-600">Stay secure,<br>The Rentory Team<br><a href="https://www.rentory.ng" class="text-green-600 hover:text-green-500">www.rentory.ng</a></p>
      </div>
    </div>
  </div>
</body>
</html>';
BEGIN
    PERFORM send_email(email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- Function to send an application notification email
CREATE OR REPLACE FUNCTION send_application_notification_email(email TEXT, application_data JSONB)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'New Rental Application Received';
    html_body TEXT := '<!DOCTYPE html>
<html>
<head>
<style>
  /* Tailwind CSS styles */
  .bg-green-50 { background-color: #f0fdf4; }
  .text-gray-900 { color: #111827; }
  .font-bold { font-weight: 700; }
  .text-3xl { font-size: 1.875rem; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-600 { color: #4b5563; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-2 { margin-top: 0.5rem; }
  .p-6 { padding: 1.5rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .bg-white { background-color: #ffffff; }
  .text-center { text-align: center; }
  .text-green-600 { color: #16a34a; }
  .hover\:text-green-500:hover { color: #22c55e; }
  .inline-block { display: inline-block; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .bg-green-600 { background-color: #16a34a; }
  .hover\:bg-green-700:hover { background-color: #15803d; }
  .text-white { color: #ffffff; }
  .no-underline { text-decoration: none; }
</style>
</head>
<body class="bg-green-50" style="font-family: sans-serif;">
  <div class="p-6">
    <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">New Rental Application</h1>
      </div>
      <div class="mt-6">
        <p class="text-sm text-gray-600">Hello,</p>
        <p class="mt-2 text-sm text-gray-600">A new rental application has been submitted on Rentory.</p>
        <p class="mt-6 text-sm text-gray-600"><strong>Applicant Name:</strong> ' || (application_data->>'name') || '</p>
        <p class="mt-2 text-sm text-gray-600"><strong>Email:</strong> ' || (application_data->>'email') || '</p>
        <p class="mt-2 text-sm text-gray-600"><strong>Phone:</strong> ' || (application_data->>'phone') || '</p>
        <p class="mt-2 text-sm text-gray-600"><strong>Property ID:</strong> ' || (application_data->>'propertyId') || '</p>
        <p class="mt-2 text-sm text-gray-600"><strong>Message:</strong> ' || (application_data->>'message') || '</p>
        <div class="mt-6 text-center">
          <a href="https://www.rentory.ng/admin" class="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg no-underline hover:bg-green-700">View Application</a>
        </div>
        <p class="mt-6 text-sm text-gray-600">Best regards,<br>Rentory Notification System</p>
      </div>
    </div>
  </div>
</body>
</html>';
BEGIN
    PERFORM send_email(email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- Function to send a search alert email
CREATE OR REPLACE FUNCTION send_search_alert_email(email TEXT, user_first_name TEXT, search_filters JSONB)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'New Homes That Match Your Search on Rentory 🏡';
    html_body TEXT := '<!DOCTYPE html>
<html>
<head>
<style>
  /* Tailwind CSS styles */
  .bg-green-50 { background-color: #f0fdf4; }
  .text-gray-900 { color: #111827; }
  .font-bold { font-weight: 700; }
  .text-3xl { font-size: 1.875rem; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-600 { color: #4b5563; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-2 { margin-top: 0.5rem; }
  .p-6 { padding: 1.5rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .bg-white { background-color: #ffffff; }
  .text-center { text-align: center; }
  .text-green-600 { color: #16a34a; }
  .hover\:text-green-500:hover { color: #22c55e; }
  .inline-block { display: inline-block; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .bg-green-600 { background-color: #16a34a; }
  .hover\:bg-green-700:hover { background-color: #15803d; }
  .text-white { color: #ffffff; }
  .no-underline { text-decoration: none; }
</style>
</head>
<body class="bg-green-50" style="font-family: sans-serif;">
  <div class="p-6">
    <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">New Homes That Match Your Search</h1>
      </div>
      <div class="mt-6">
        <p class="text-sm text-gray-600">Hi ' || user_first_name || ',</p>
        <p class="mt-2 text-sm text-gray-600">Good news! We found new listings that match your search:</p>
        <p class="mt-6 text-sm text-gray-600"><strong>Location:</strong> ' || (search_filters->>'city') || '/' || (search_filters->>'state') || '</p>
        <p class="mt-2 text-sm text-gray-600"><strong>Price Range:</strong> ' || (search_filters->>'min_price') || ' - ' || (search_filters->>'max_price') || '</p>
        <p class="mt-2 text-sm text-gray-600"><strong>Details:</strong> ' || (search_filters->>'bedrooms') || ' beds / ' || (search_filters->>'bathrooms') || ' baths</p>
        <div class="mt-6 text-center">
          <a href="https://www.rentory.ng/search?filters=' || search_filters::text || '" class="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg no-underline hover:bg-green-700">View Listings</a>
        </div>
        <p class="mt-6 text-sm text-gray-600">You’ll continue to receive updates as new homes become available.</p>
        <p class="mt-2 text-sm text-gray-600">Need to adjust your search filters? <a href="https://www.rentory.ng/dashboard/alerts" class="text-green-600 hover:text-green-500">Update Search Preferences</a></p>
        <p class="mt-6 text-sm text-gray-600">Happy house hunting,<br>The Rentory Team</p>
      </div>
    </div>
  </div>
</body>
</html>';
BEGIN
    PERFORM send_email(email, subject, html_body);
END;
$$ LANGUAGE plpgsql;

-- Function to send a verification email
CREATE OR REPLACE FUNCTION send_verification_email(email TEXT, user_first_name TEXT, verification_link TEXT)
RETURNS VOID AS $$
DECLARE
    subject TEXT := 'Verify Your Rentory Account';
    html_body TEXT := '<!DOCTYPE html>
<html>
<head>
<style>
  /* Tailwind CSS styles */
  .bg-green-50 { background-color: #f0fdf4; }
  .text-gray-900 { color: #111827; }
  .font-bold { font-weight: 700; }
  .text-3xl { font-size: 1.875rem; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-600 { color: #4b5563; }
  .mt-6 { margin-top: 1.5rem; }
  .mt-2 { margin-top: 0.5rem; }
  .p-6 { padding: 1.5rem; }
  .rounded-lg { border-radius: 0.5rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .bg-white { background-color: #ffffff; }
  .text-center { text-align: center; }
  .text-green-600 { color: #16a34a; }
  .hover\:text-green-500:hover { color: #22c55e; }
  .inline-block { display: inline-block; }
  .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .bg-green-600 { background-color: #16a34a; }
  .hover\:bg-green-700:hover { background-color: #15803d; }
  .text-white { color: #ffffff; }
  .no-underline { text-decoration: none; }
</style>
</head>
<body class="bg-green-50" style="font-family: sans-serif;">
  <div class="p-6">
    <div class="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Verify Your Account</h1>
      </div>
      <div class="mt-6">
        <p class="text-sm text-gray-600">Hi ' || user_first_name || ',</p>
        <p class="mt-2 text-sm text-gray-600">Welcome to Rentory — your smarter way to find or lease a home in Nigeria. To activate your account and start exploring verified listings, please confirm your email address.</p>
        <div class="mt-6 text-center">
          <a href="' || verification_link || '" class="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg no-underline hover:bg-green-700">Verify My Email</a>
        </div>
        <p class="mt-6 text-sm text-gray-600">If you didn’t sign up for Rentory, please ignore this message.</p>
        <p class="mt-2 text-sm text-gray-600">Thank you,<br>The Rentory Team<br><a href="https://www.rentory.ng" class="text-green-600 hover:text-green-500">www.rentory.ng</a></p>
      </div>
    </div>
  </div>
</body>
</html>';
BEGIN
    PERFORM send_email(email, subject, html_body);
END;
$$ LANGUAGE plpgsql;
