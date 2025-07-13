"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Invalid reset link. Please request a new one.');
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setMessage('Password updated successfully!');
      toast({
        title: 'Success',
        description: 'Password updated successfully!',
      });
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your new password"
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
