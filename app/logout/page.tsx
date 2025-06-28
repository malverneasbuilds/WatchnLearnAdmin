'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    performLogout();
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <LogOut className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Logging you out...
          </h2>
          <p className="text-gray-600">
            Please wait while we sign you out of the system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}