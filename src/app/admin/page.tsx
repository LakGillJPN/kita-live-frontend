"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllEvents } from "../api/getEvent";
import { useAdminAuth } from "../components/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import EventList from "../components/AdminEventList";

interface AdminEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  time?: string;
  venue: string;
  category?: string;
  price?: number;
  maxAttendees?: number;
  imageUrl?: string;
}

function AdminDashboard() {
  const router = useRouter();
  const { admin, logoutAdmin } = useAdminAuth();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const responseData = await getAllEvents();
      setEvents(responseData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load events data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
  };

  // Navigate to "Add Event" page
  const handleAddEvent = () => {
    router.push("/admin/events/new");
  };

  // Navigate to "Edit Event" page
  const handleEditEvent = (event: AdminEvent) => {
    router.push(`/admin/events/${event.id}`);
  };

  // Delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/v1/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete event");
      }

      await fetchEvents(); // Refresh list
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {admin?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Event Management */}
        <div className="space-y-6">
          {/* Events Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Event Management</h2>
            <button
              onClick={handleAddEvent}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add New Event
            </button>
          </div>

          {/* Events List */}
          <EventList
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
