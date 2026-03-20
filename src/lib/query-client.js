// @ts-nocheck
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from '../hooks/use-toast';

export const queryClientInstance = new QueryClient({
  // Global Query Error Handling (GET requests)
  queryCache: new QueryCache({
    onError: (error) => {
      const message = error.detail || error.message || "Could not fetch data";
      toast({
        variant: "destructive",
        title: "Connection Issue",
        description: message,
      });
    },
  }),

  // Global Mutation Error Handling (POST/PUT/DELETE requests)
  mutationCache: new MutationCache({
    onError: (error) => {
      const message = error.detail || "Failed to save changes. Please try again.";
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: message,
      });
    },
  }),

  defaultOptions: {
    queries: {
      // 1. Disable refetching on window focus to save Django server resources
      refetchOnWindowFocus: false,
      
      // 2. Retry once if the network blips (common in rural/field areas)
      retry: 1,
      
      // 3. Keep data "fresh" for 30 seconds before re-fetching in the background
      staleTime: 1000 * 30,
    },
  },
});