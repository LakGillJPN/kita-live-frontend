interface Event {
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

import { getEventById } from "@/app/api/getEvent";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl text-gray-700">Event not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>

          <p className="text-gray-700 mb-6">{event.description}</p>

          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.startTime).toLocaleString()}
            </p>
            <p>
              <strong>Venue:</strong> {event.venue}
            </p>
            {event.category && (
              <p>
                <strong>Category:</strong> {event.category}
              </p>
            )}
            <p>
              <strong>Price:</strong>{" "}
              {event.price ? `${event.price} 円` : "Free"}
            </p>
            {event.maxAttendees && (
              <p>
                <strong>Max attendees:</strong> {event.maxAttendees}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
