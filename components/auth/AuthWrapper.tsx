"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      router.push("/login");
      return;
    }

    // Verify token is still valid by making a test request
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/location', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          // Token is invalid
          localStorage.removeItem("authToken");
          router.push("/login");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}