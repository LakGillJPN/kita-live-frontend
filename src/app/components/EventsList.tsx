"use client";

import { useEffect, useState } from "react";
import { getAllEvents } from "../api/getEvent";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description?: string;
  venue: string;
  startTime: string;
  endTime: string;
  category: string;
  price: number; // add type property
  imageUrl?: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    getAllEvents()
      .then((responseData) => {
        const allEvents = Array.isArray(responseData) ? responseData : [];
        setEvents(allEvents);
        setFilteredEvents(allEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load events");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedType) {
      setFilteredEvents(
        events.filter((event) => event.category === selectedType)
      );
    } else {
      setFilteredEvents(events);
    }
  }, [selectedType, events]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Food">Food & Drink</option>
          <option value="Art">Art & Culture</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Community">Community</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Event list or empty message */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No events available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/events/${event.id}`}>
                {/* Event Image */}
                {event.imageUrl && (
                  <div className="w-full h-48 overflow-hidden bg-gray-200">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {event.venue && (
                      <div className="flex justify-between items-center text-sm text-gray-500 rounded-md p-2">
                        {/* Venue (left) */}
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.venue}
                        </div>

                        {/* Start Time (right) */}
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {event.startTime.slice(0, 10)}
                        </div>
                      </div>
                    )}

                    {event.category && (
                      <div className="text-sm text-gray-500 font-medium">
                        {event.category}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
