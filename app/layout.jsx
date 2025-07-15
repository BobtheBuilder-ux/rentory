import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import LiveChat from '@/components/LiveChat';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rentory - Find Your Perfect Home in Nigeria',
  description: 'Nigeria\'s leading digital-first rental platform. Find verified properties, connect directly with landlords, and rent without agent fees.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
