"use client";

import { useAdminAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdminAuthenticated, loadingAdmin } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAdmin && !isAdminAuthenticated && window.location.pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, loadingAdmin, router]);

  if (loadingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <div className="text-gray-900">{children}</div>;
}
