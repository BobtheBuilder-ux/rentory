"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase'; // Import the configured Supabase client

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // First, initiate the Supabase password reset flow to generate the token
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (supabaseError) {
      setError(supabaseError.message);
      toast({
        title: 'Error',
        description: supabaseError.message,
        variant: 'destructive',
      });
    } else {
      // If Supabase successfully initiated the reset, send the custom email
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        const firstName = user?.user_metadata?.first_name || 'User';

        const { data, error: sendEmailError } = await supabase.functions.invoke('send-email', {
          body: {
            to: email,
            subject: 'Reset Your Rentory Password',
            template: 'PasswordResetEmail',
            templateProps: {
              firstName: firstName,
              resetLink: `${window.location.origin}/auth/reset-password`, // Supabase will append tokens to this
            },
          },
        });

        if (sendEmailError) {
          console.error('Error sending custom password reset email:', sendEmailError);
          toast({
            title: 'Error',
            description: 'Failed to send custom password reset email. Please try again.',
            variant: 'destructive',
          });
        } else {
          setMessage('Password reset link sent to your email!');
          toast({
            title: 'Success',
            description: 'Password reset link sent to your email!',
          });
        }
      } catch (err) {
        console.error('Unexpected error during password reset email sending:', err);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
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
