"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEventById } from "../../../api/getEvent";
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

function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fullEventData = await getEventById(id);
        const startTime = fullEventData.startTime || "";
        const endTime = fullEventData.endTime || startTime;
        const mappedEvent: Event = {
          id: fullEventData.id,
          title: fullEventData.title || "",
          description: fullEventData.description || "",
          date: startTime
            ? new Date(startTime).toISOString().split("T")[0]
            : "",
          time: startTime
            ? new Date(startTime).toTimeString().slice(0, 5)
            : "",
          startTime: startTime,
          endTime: endTime,
          venue: fullEventData.venue || "",
          location: fullEventData.venue || "",
          category: fullEventData.category || "",
          price: fullEventData.price || 0,
          maxAttendees: fullEventData.capacity || 0,
          capacity: fullEventData.capacity || 0,
          imageUrl: fullEventData.imageUrl || "",
        };
        setEvent(mappedEvent);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const handleSave = async (eventData: Event) => {
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      
      // Transform form data to API format
      const apiPayload = {
        title: eventData.title,
        description: eventData.description,
        venue: eventData.venue || eventData.location,
        startTime: eventData.startTime || (eventData.date && eventData.time ? `${eventData.date}T${eventData.time}:00` : ''),
        endTime: eventData.endTime || eventData.startTime || (eventData.date && eventData.time ? `${eventData.date}T${eventData.time}:00` : ''),
        capacity: eventData.capacity || eventData.maxAttendees || 0,
        category: eventData.category || '',
        price: eventData.price || 0,
        imageUrl: eventData.imageUrl || '',
      };

      const response = await fetch(`${baseUrl}/api/v1/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update event");
      }

      router.push("/admin"); // Go back to admin dashboard
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading event...</div>;
  if (error)
    return (
      <div className="p-8 text-red-500">
        Error: {error} <button onClick={() => router.push("/admin")}>Back</button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
        {event && (
          <EventForm
            event={event}
            onSave={handleSave}
            onCancel={() => router.push("/admin")}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default function ProtectedEditPage() {
  return (
    <ProtectedRoute>
      <EditEventPage />
    </ProtectedRoute>
  );
}
