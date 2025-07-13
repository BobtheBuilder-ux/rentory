"use client";
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setMessage('Password reset link sent to your email!');
      toast({
        title: 'Success',
        description: 'Password reset link sent to your email!',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}
