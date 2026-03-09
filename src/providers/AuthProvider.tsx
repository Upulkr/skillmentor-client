import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useAuthStore } from "../store/useAuthStore";
import api from "../api/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          // 1. Resolve role from publicMetadata (matching SRS: roles array or role string)
          const metadata = user.publicMetadata as {
            roles?: string[];
            role?: string;
          };
          const resolvedRole =
            metadata.roles?.[0] || metadata.role || "STUDENT";

          // 2. Fetch token and update store
          const token = await getToken();
          setAuth(token, resolvedRole);

          // 3. Handshake: Sync this Clerk User with our PostgreSQL DB
          if (token) {
            await api.post("/users/sync", {
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              role: resolvedRole,
            });
            console.log(
              "Handshake success: User identity and permissions synchronized.",
            );
          }
        } catch (error) {
          console.error("Handshake fail:", error);
        }
      } else if (isLoaded && !isSignedIn) {
        clearAuth();
      }
    };

    syncWithBackend();
  }, [isLoaded, isSignedIn, user, getToken, setAuth, clearAuth]);

  return <>{children}</>;
}
