"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const token = useAppSelector((state) => state.auth.token);
    const profileStatus = useAppSelector((state) => state.profile.status);

    useEffect(() => {
        // If no token or profile failed to load, redirect to home
        if (!token || profileStatus === "failed") {
            router.replace("/");
        }
    }, [token, profileStatus, router]);

    // Don't render protected content if not authenticated
    if (!token || profileStatus === "failed") {
        return null;
    }

    // Show loading state while profile is being fetched
    if (profileStatus === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
