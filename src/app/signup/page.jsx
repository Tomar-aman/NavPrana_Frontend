import AuthForm from "../auth/AuthForm";

export const metadata = {
  title: "Sign Up | NavPrana Organics",
  description: "Create your NavPrana account and get access to premium organic ghee delivered to your door.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: false },
};

const Page = () => <AuthForm initialTab="signup" />;
export default Page;
