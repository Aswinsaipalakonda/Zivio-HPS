import { redirect } from "next/navigation";

export default function SignUpPage() {
  // Since self-registration is disabled and all users must be pre-registered,
  // we redirect all sign-up attempts directly to the sign-in page.
  redirect("/sign-in");
}
