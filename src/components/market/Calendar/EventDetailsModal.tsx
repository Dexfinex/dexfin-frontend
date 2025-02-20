import React from 'react';
import { Calendar, Clock, Tag, Globe, Trash2, Edit, X } from 'lucide-react';

interface EventDetailsModalProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    type: string;
    project?: string;
    location?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: any) => void;
  onDelete: (eventId: string) => void;
}

const EventDetailsModal = ({ event, isOpen, onClose, onEdit, onDelete }: EventDetailsModalProps) => {
  if (!event || !isOpen) return null;

  const [date, time] = event.date.split('T');
  const formattedTime = time.split('.')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-gray-900 border rounded-lg border-white/10">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="mb-4 text-xl font-semibold text-white">{event.title}</h2>
        
        <div className="space-y-4">
          {/* Event Type */}
          <div className={`inline-block px-2 py-1 text-sm rounded `}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </div>

          {/* Date and Time */}
          <div className="space-y-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/80">{event.description}</p>

          {/* Project and Location */}
          {(event.project || event.location) && (
            <div className="space-y-2 text-sm text-white/60">
              {event.project && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{event.project}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => onDelete(event.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-500 bg-red-500/10 rounded hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={() => onEdit(event)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white border border-white/10 rounded hover:bg-white/10"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;