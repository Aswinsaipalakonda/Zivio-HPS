import { usePathname } from "next/navigation";
import { User, UserRole } from "../types";

export function useCurrentUser() {
  const pathname = usePathname();

  // Dynamically determine the active preview role based on URL path namespaces
  let role: UserRole = "EMPLOYEE";
  let department = "Software Engineering";

  if (pathname?.startsWith("/manager")) {
    role = "MANAGER";
    department = "Delivery & Operations";
  } else if (pathname?.startsWith("/director")) {
    role = "DIRECTOR";
    department = "Executive Board";
  }

  const mockUser: User = {
    id: "mock-user-uuid-12345",
    clerk_user_id: "mock-clerk-id-12345",
    email: "aswinedu1@gmail.com",
    full_name: "Aswin",
    role: role,
    department: department,
    profile_picture_url: null,
    is_active: true,
    date_joined: "2026-05-25",
    created_at: "2026-05-25T00:00:00Z",
    updated_at: "2026-05-25T00:00:00Z",
  };

  return {
    user: mockUser,
    isLoading: false,
    isError: false,
    error: null,
    isSignedIn: true,
    role: role,
  };
}
