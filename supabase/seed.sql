-- Clear existing data (optional, for development environments)
-- DELETE FROM properties;
-- DELETE FROM profiles;
-- DELETE FROM applications;
-- DELETE FROM conversations;
-- DELETE FROM messages;
-- DELETE FROM saved_properties;
-- DELETE FROM payments;
-- DELETE FROM escrow_transactions;

-- Insert dummy profiles (users)
INSERT INTO profiles (id, user_type, first_name, last_name, email, phone) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'landlord', 'Alice', 'Smith', 'alice.smith@example.com', '111-222-3333'),
('b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', 'tenant', 'Bob', 'Johnson', 'bob.johnson@example.com', '444-555-6666'),
('c2d3e4f5-a6b7-c8d9-e0f1-2a3b4c5d6e7f', 'landlord', 'Charlie', 'Brown', 'charlie.brown@example.com', '777-888-9999'),
('d3e4f5a6-b7c8-d9e0-f1a2-3b4c5d6e7f8a', 'tenant', 'Diana', 'Prince', 'diana.prince@example.com', '000-111-2222');

-- Insert 200 dummy properties
INSERT INTO properties (
    landlord_id, title, description, address, city, state, zip_code, country,
    price, bedrooms, bathrooms, property_type, status, amenities, images,
    latitude, longitude, year_built, lot_size, floor_area, parking_spaces,
    is_furnished, pet_friendly, has_balcony, has_garden, has_pool,
    lease_terms, available_from, created_at, updated_at
)
SELECT
    CASE WHEN (i % 2) = 0 THEN 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' ELSE 'c2d3e4f5-a6b7-c8d9-e0f1-2a3b4c5d6e7f' END,
    'Modern ' || CASE (i % 5) WHEN 0 THEN 'Apartment' WHEN 1 THEN 'House' WHEN 2 THEN 'Condo' WHEN 3 THEN 'Townhouse' ELSE 'Studio' END || ' ' || i,
    'Spacious ' || CASE (i % 5) WHEN 0 THEN 'apartment' WHEN 1 THEN 'house' WHEN 2 THEN 'condo' WHEN 3 THEN 'townhouse' ELSE 'studio' END || ' with great views and modern amenities. Perfect for families or young professionals.',
    (i * 10 + 100) || ' Main St',
    CASE (i % 3) WHEN 0 THEN 'Lagos' WHEN 1 THEN 'Abuja' ELSE 'Port Harcourt' END,
    CASE (i % 3) WHEN 0 THEN 'Lagos State' WHEN 1 THEN 'FCT' ELSE 'Rivers State' END,
    '1000' || (i % 100),
    'Nigeria',
    (500000 + (i * 10000))::NUMERIC(10, 2),
    (i % 4) + 1,
    (i % 3) + 1,
    CASE (i % 5) WHEN 0 THEN 'apartment' WHEN 1 THEN 'house' WHEN 2 THEN 'condo' WHEN 3 THEN 'townhouse' ELSE 'studio' END,
    CASE (i % 2) WHEN 0 THEN 'available' ELSE 'rented' END,
    ARRAY['wifi', 'parking', 'gym', 'pool'],
    ARRAY['https://example.com/image' || (i % 10) || '.jpg'],
    (6.45 + (i * 0.001))::NUMERIC(10, 7),
    (3.39 + (i * 0.001))::NUMERIC(10, 7),
    (1990 + (i % 30)),
    (5000 + (i * 10)),
    (1000 + (i * 5)),
    (i % 2) + 1,
    (i % 2) = 0,
    (i % 2) = 1,
    (i % 2) = 0,
    (i % 2) = 1,
    (i % 2) = 0,
    '12-month lease',
    NOW() + (i || ' days')::INTERVAL,
    NOW(),
    NOW()
FROM generate_series(1, 200) AS s(i);

-- Insert dummy applications
INSERT INTO applications (
    property_id, tenant_id, status, application_date, move_in_date, desired_lease_term,
    monthly_income, employment_status, credit_score, pets, notes, created_at, updated_at
)
SELECT
    p.id,
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', -- Bob Johnson
    CASE (i % 3) WHEN 0 THEN 'pending' WHEN 1 THEN 'approved' ELSE 'rejected' END,
    NOW() - (i || ' days')::INTERVAL,
    NOW() + (i || ' days')::INTERVAL,
    '12 months',
    (300000 + (i * 1000)),
    'employed',
    (700 + (i % 50)),
    (i % 2) = 0,
    'Application for property ' || p.title,
    NOW(),
    NOW()
FROM generate_series(1, 50) AS s(i)
JOIN properties p ON p.title LIKE '%Apartment%' AND p.title LIKE '%' || i || '%'
LIMIT 50;

-- Insert dummy payments
INSERT INTO payments (
    user_id, property_id, amount, currency, reference, status, payment_type, created_at, updated_at
)
SELECT
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', -- Bob Johnson
    p.id,
    (p.price / 12)::NUMERIC(10, 2),
    'NGN',
    'PAYREF_' || i || '_' || REPLACE(gen_random_uuid()::TEXT, '-', ''),
    CASE (i % 3) WHEN 0 THEN 'successful' WHEN 1 THEN 'pending' ELSE 'failed' END,
    'rent',
    NOW() - (i || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 100) AS s(i)
JOIN properties p ON p.title LIKE '%House%' AND p.title LIKE '%' || i || '%'
LIMIT 100;

-- Insert dummy escrow transactions
INSERT INTO escrow_transactions (
    amount, currency, sender_id, receiver_id, property_id, purpose, status, created_at, updated_at
)
SELECT
    (p.price * 0.1)::NUMERIC(10, 2), -- 10% of property price as deposit
    'NGN',
    'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', -- Bob Johnson
    p.landlord_id,
    p.id,
    'security_deposit',
    CASE (i % 3) WHEN 0 THEN 'held' WHEN 1 THEN 'released' ELSE 'disputed' END,
    NOW() - (i || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 30) AS s(i)
JOIN properties p ON p.title LIKE '%Condo%' AND p.title LIKE '%' || i || '%'
LIMIT 30;
