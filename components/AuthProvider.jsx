"use client";

import React from 'react';
import { AuthProvider as AuthProviderJS } from '../hooks/useAuth.js';

export function AuthProvider({ children }) {
  return <AuthProviderJS>{children}</AuthProviderJS>;
}
