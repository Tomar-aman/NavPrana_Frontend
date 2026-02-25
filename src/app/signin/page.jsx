import AuthForm from "../auth/AuthForm";

export const metadata = {
  title: "Sign In | NavPrana Organics",
  description: "Sign in to your NavPrana account to access your orders, cart, and profile.",
  alternates: { canonical: "/signin" },
  robots: { index: false, follow: false },
};

const Page = () => <AuthForm initialTab="signin" />;
export default Page;
