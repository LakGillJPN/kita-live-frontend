import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseLoginProps {
  onClose: () => void;
}

export const useLogin = ({ onClose }: UseLoginProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        try {
          // Persist basic user session for client-side auth (role: user)
          localStorage.setItem(
            "authUser",
            JSON.stringify({ email, role: "user" })
          );
        } catch {
          // ignore storage errors
        }

        setTimeout(() => {
          router.replace("/");
          onClose();
        }, 1000);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
