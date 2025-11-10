"use client";

import { useEffect, useState } from 'react';

interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  venue?: string;
  category?: string;
  price?: number;
  maxAttendees?: number;
  capacity?: number;
  imageUrl?: string;
}

interface EventFormProps {
  event?: Event;
  onSave: (eventData: Event) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EventForm({ event, onSave, onCancel, isLoading = false }: EventFormProps) {
  const [formData, setFormData] = useState<Event>({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    startTime: event?.startTime || '',
    endTime: event?.endTime || '',
    time: event?.time || '',
    venue: event?.venue || '',
    category: event?.category || '',
    price: event?.price || 0,
    maxAttendees: event?.maxAttendees || event?.capacity || 0,
    capacity: event?.capacity || event?.maxAttendees || 0,
    imageUrl: event?.imageUrl || '',
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Initialize endTime if missing but startTime exists
  useEffect(() => {
    if (formData.endTime) return; // Already has endTime
    
    if (formData.startTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(startDate);
      endDate.setHours(22, 0, 0, 0); // Default to 22:00 same day
      setFormData(prev => ({
        ...prev,
        endTime: endDate.toISOString().slice(0, 19)
      }));
    } else if (formData.date && formData.time) {
      const endTime = `${formData.date}T22:00:00`;
      setFormData(prev => ({
        ...prev,
        endTime
      }));
    }
  }, [formData.startTime, formData.date, formData.time, formData.endTime]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle date/time changes that need to update startTime
    if (name === 'date' || name === 'time') {
      setFormData(prev => {
        const date = name === 'date' ? value : prev.date;
        const time = name === 'time' ? value : prev.time;
        const startTime = date && time ? `${date}T${time}:00` : prev.startTime;
        return {
          ...prev,
          [name]: value,
          startTime: startTime || prev.startTime
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'capacity' ? Number(value) || 0 : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Start date is required';
    if (!formData.time) newErrors.time = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End date/time is required';
    if (!formData.venue?.trim()) newErrors.venue = 'Venue is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Ensure startTime and endTime are properly formatted
    const startTime = formData.startTime || (formData.date && formData.time ? `${formData.date}T${formData.time}:00` : '');
    const endTime = formData.endTime || startTime;

    const apiData = {
      ...formData,
      startTime,
      endTime,
      capacity: formData.capacity || formData.maxAttendees || 0,
    };

    try {
      await onSave(apiData as Event);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 text-gray-900">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {event ? 'Edit Event' : 'Add New Event'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endTime ? new Date(formData.endTime).toISOString().split('T')[0] : formData.date}
              onChange={(e) => {
                const endDate = e.target.value;
                const endTime = formData.endTime ? new Date(formData.endTime).toTimeString().slice(0, 5) : formData.time || '22:00';
                setFormData(prev => ({
                  ...prev,
                  endTime: endDate && endTime ? `${endDate}T${endTime}:00` : prev.endTime
                }));
                if (errors.endTime) {
                  setErrors(prev => ({ ...prev, endTime: '' }));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
              End Time *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime ? new Date(formData.endTime).toTimeString().slice(0, 5) : '22:00'}
              onChange={(e) => {
                const endTime = e.target.value;
                const endDate = formData.endTime ? new Date(formData.endTime).toISOString().split('T')[0] : formData.date;
                setFormData(prev => ({
                  ...prev,
                  endTime: endDate && endTime ? `${endDate}T${endTime}:00` : prev.endTime
                }));
                if (errors.endTime) {
                  setErrors(prev => ({ ...prev, endTime: '' }));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.endTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
              Venue *
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.venue ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event venue"
            />
            {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a category</option>
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

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (円)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity || formData.maxAttendees || 0}
              onChange={(e) => {
                const value = Number(e.target.value) || 0;
                setFormData(prev => ({
                  ...prev,
                  capacity: value,
                  maxAttendees: value
                }));
              }}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (event ? 'Update Event' : 'Add Event')}
          </button>
        </div>
      </form>
    </div>
  );
}
