"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to send password reset link.');
        toast({
          title: 'Error',
          description: result.error || 'Failed to send password reset link.',
          variant: 'destructive',
        });
      } else {
        setMessage(result.message);
        toast({
          title: 'Success',
          description: result.message,
        });
      }
    } catch (err) {
      console.error('Client-side error during password reset request:', err);
      setError('An unexpected error occurred. Please try again.');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email to reset your password.
          </p>
        </div>

        {message && (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md dark:bg-green-900 dark:text-green-300">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div>
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:bg-white focus:ring-0 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
        <div className="text-sm text-center">
          <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
