"use client";

import { useState } from "react";
import EventsList from "./components/EventsList";
import LoginModal from "./components/LoginModal";
import { useUserAuth } from "./components/AuthContext";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logoutUser } = useUserAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            KitaLive
          </h1>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {user?.email ? (
              <>
                <span className="text-sm text-gray-700 bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-gray-200">
                  Signed in as {user.email}
                </span>
                <button
                  onClick={logoutUser}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            Discover amazing events happening around you. Join the community and
            never miss out on exciting experiences.
          </p>
        </div>

        {/* Events List Component */}
        <EventsList />

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            © 2025 KitaLive. Bringing communities together.
          </p>
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
