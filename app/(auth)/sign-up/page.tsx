import SignUpForm from "@/components/signup-form";
import { requireNoAuth } from "@/lib/auth-utils";

export default async function signUpPage() {
  await requireNoAuth();
  return <SignUpForm />;
}
