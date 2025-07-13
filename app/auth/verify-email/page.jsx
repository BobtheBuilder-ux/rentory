"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleVerification = async () => {
      const { error } = await verifyEmail();
      if (error) {
        setError(error.message);
        setMessage('');
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setMessage('Email verified successfully! Redirecting to dashboard...');
        toast({
          title: 'Success',
          description: 'Email verified successfully!',
        });
        router.push('/dashboard');
      }
    };

    handleVerification();
  }, [verifyEmail, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
