import SignUpForm from "@/components/signup-form";
import { requireNoAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function signUpPage() {
  await requireNoAuth();
  return <SignUpForm />;
}
