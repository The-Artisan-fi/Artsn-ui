// waitlistHook.ts

import { useState, useCallback } from 'react';

// Define the user type options
type UserType = 'Seller' | 'Investor' | 'Both';

// Define the structure for waitlist entry
interface WaitlistEntry {
  name?: string;
  email?: string;
  userType?: UserType;
  interest?: string;
  vipAccess?: boolean;
  referOthers?: boolean;
  updatePreference?: string;
  blockchainFamiliarity?: string;
}

// Custom hook for adding to waitlist
export const useAddToWaitlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToWaitlist = useCallback(async (entry: WaitlistEntry) => {
    setIsLoading(true);
    setError(null);
  
    try {
        console.log('entry:', entry);
      const response = await fetch('/api/waitlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add to waitlist');
      }
  
      const data = await response.json();
      console.log('Waitlist response:', data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error adding to waitlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addToWaitlist, isLoading, error };
};