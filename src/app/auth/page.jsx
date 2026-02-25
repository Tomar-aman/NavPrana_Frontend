import { redirect } from "next/navigation";

// /auth is the old route — redirect to /signin
export default function AuthPage() {
  redirect("/signin");
}
