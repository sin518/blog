import SignInForm from "@/components/signin-form";
import { requireNoAuth } from "@/lib/auth-utils";

export default async function signInPage() {
  await requireNoAuth();
  return <SignInForm />;
}
