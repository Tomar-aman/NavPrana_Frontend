import AuthForm from "../auth/AuthForm";

export const metadata = {
  title: "Sign Up",
  description: "Create your NavPrana account and get access to pure bilona ghee delivered to your door.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: false },
};

const Page = () => <AuthForm initialTab="signup" />;
export default Page;
