import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { QUERY_KEYS } from "../lib/queryKeys";
import { User } from "../types";

export function useCurrentUser() {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();

  const {
    data: user,
    isLoading: isBackendLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: async () => {
      const response = await api.get("/api/auth/me/");
      return response.data;
    },
    enabled: isClerkLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Do not infinite-retry on 401/403 allowlist denials
  });

  const isLoading = !isClerkLoaded || (isSignedIn && isBackendLoading);
  const role = user?.role || null;

  return {
    user,
    isLoading,
    isError,
    error,
    isSignedIn,
    role,
  };
}
