import React, { useState } from 'react';
import { Calendar, Clock, Tag, Globe, Trash2, Edit, X, Save, XCircle } from 'lucide-react';

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

  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);
  const [date, time] = event.date.split('T');
  const formattedTime = time.split('.')[0];

  const handleSave = () => {
    onEdit(editedEvent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
  };

 // In EventDetailsModal.tsx, update the className for the main containers:

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="relative w-full max-w-md p-6 mx-4 rounded-lg glass">
      <button
        onClick={onClose}
        className="absolute transition-colors top-2 right-2 text-white/60 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="mb-4 text-xl font-semibold text-white">{event.title}</h2>

      <div className="space-y-4">
        {/* Event Type */}
        <div className={`inline-block px-2 py-1 text-sm rounded`}>
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
        <p className="text-sm text-white/60">{event.description}</p>

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
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white border border-white/10 rounded hover:bg-white/10"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md p-6 mx-4 rounded-lg glass">
            <button
              onClick={handleCancel}
              className="absolute transition-colors top-2 right-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <input
                type="text"
                value={editedEvent.title}
                onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                className="w-full px-3 py-2 text-xl font-semibold text-white border rounded bg-white/5 border-white/10 focus:outline-none focus:border-white/20"
              />

              <select
                value={editedEvent.type}
                onChange={(e) => setEditedEvent({ ...editedEvent, type: e.target.value })}
                className="w-full px-4 py-2 text-white border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
              >
                <option value="launch">Launch</option>
                <option value="airdrop">Airdrop</option>
                <option value="ama">AMA</option>
                <option value="governance">Governance</option>
                <option value="conference">Conference</option>
                <option value="partnership">Partnership</option>
                <option value="custom">Custom</option>
              </select>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <input
                    type="date"
                    value={editedEvent.date.split('T')[0]}
                    onChange={(e) => setEditedEvent({
                      ...editedEvent,
                      date: `${e.target.value}T${editedEvent.date.split('T')[1]}`
                    })}
                    className="px-2 py-1 text-white border rounded bg-white/5 border-white/10 focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <input
                    type="time"
                    value={editedEvent.date.split('T')[1].split('.')[0]}
                    onChange={(e) => setEditedEvent({
                      ...editedEvent,
                      date: `${editedEvent.date.split('T')[0]}T${e.target.value}`
                    })}
                    className="px-2 py-1 text-white border rounded bg-white/5 border-white/10 focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              <textarea
                value={editedEvent.description}
                onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                className="w-full h-24 px-3 py-2 text-sm text-white border rounded bg-white/5 border-white/10 focus:outline-none focus:border-white/20"
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={editedEvent.project || ''}
                    onChange={(e) => setEditedEvent({ ...editedEvent, project: e.target.value })}
                    placeholder="Project"
                    className="px-2 py-1 text-white border rounded bg-white/5 border-white/10 focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/60" />
                  <input
                    type="text"
                    value={editedEvent.location || ''}
                    onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                    placeholder="Location"
                    className="px-2 py-1 text-white border rounded bg-white/5 border-white/10 focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-400 bg-blue-500/10 rounded hover:bg-blue-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default EventDetailsModal;