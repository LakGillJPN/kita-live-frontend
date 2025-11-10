"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import EventForm from "../../../components/EventForm";

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  location?: string;
  category?: string;
  price?: number;
  maxAttendees?: number;
  capacity?: number;
  imageUrl?: string;
}

function AddEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (eventData: Event) => {
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      
      // Transform form data to API format
      const apiPayload = {
        title: eventData.title,
        description: eventData.description,
        venue: eventData.venue || eventData.location || '',
        startTime: eventData.startTime || (eventData.date && eventData.time ? `${eventData.date}T${eventData.time}:00` : ''),
        endTime: eventData.endTime || eventData.startTime || (eventData.date && eventData.time ? `${eventData.date}T${eventData.time}:00` : ''),
        capacity: eventData.capacity || eventData.maxAttendees || 0,
        category: eventData.category || '',
        price: eventData.price || 0,
        imageUrl: eventData.imageUrl || '',
      };

      const response = await fetch(`${baseUrl}/api/v1/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      router.push("/admin"); // Go back to dashboard after success
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Event</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <EventForm
          onSave={handleSave}
          onCancel={() => router.push("/admin")}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}

export default function ProtectedAddEventPage() {
  return (
    <ProtectedRoute>
      <AddEventPage />
    </ProtectedRoute>
  );
}
