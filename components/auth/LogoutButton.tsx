'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // The AuthContext will handle redirecting to login
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
      <LogOut className="h-4 w-4" />
      <span>Log Out</span>
    </Button>
  );
}