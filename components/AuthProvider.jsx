"use client";

import { AuthProvider as AuthProviderJS } from '@/hooks/useAuth';

export function AuthProvider({ children }) {
  return <AuthProviderJS>{children}</AuthProviderJS>;
}
