ALTER TABLE profiles
ADD COLUMN email TEXT UNIQUE;

-- Optionally, update existing profiles with email from auth.users if they exist
UPDATE profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id AND profiles.email IS NULL;

-- Add RLS policy to allow users to update their own email
CREATE POLICY "Users can update their own email." ON profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
