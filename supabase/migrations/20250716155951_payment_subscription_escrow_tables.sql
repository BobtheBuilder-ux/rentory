-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    reference TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'successful', 'failed', 'reversed'
    payment_type TEXT NOT NULL, -- 'rent', 'deposit', 'subscription'
    gateway_response JSONB,
    authorization_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Create escrow_transactions table
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    purpose TEXT NOT NULL, -- 'security_deposit', 'rent_payment'
    status TEXT NOT NULL DEFAULT 'held', -- 'held', 'released', 'refunded', 'disputed'
    transaction_reference TEXT UNIQUE, -- Optional: link to a payment gateway transaction
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments table
CREATE POLICY "Users can view their own payments." ON payments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments." ON payments
FOR INSERT WITH CHECK (auth.uid() = user_id);


-- RLS Policies for escrow_transactions table
CREATE POLICY "Users can view their own escrow transactions (sender or receiver)." ON escrow_transactions
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their own escrow transactions." ON escrow_transactions
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own escrow transactions (sender or receiver)." ON escrow_transactions
FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
