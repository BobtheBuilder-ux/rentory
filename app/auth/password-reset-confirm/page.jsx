"use client";
import Link from 'next/link';

export default function PasswordResetConfirm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Reset Successful</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your password has been updated. You can now log in with your new password.
        </p>
        <Link href="/auth/login">
          <a className="inline-block px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Go to Login
          </a>
        </Link>
      </div>
    </div>
  );
}
