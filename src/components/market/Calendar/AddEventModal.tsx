import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addEvent } from './api/Calendar-api';
import { DayEvent } from './MarketCalendar';
import { requiredChakraThemeKeys, ToastProvider } from '@chakra-ui/react';
 
  
  interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEventAdded?: () => void;
    userId: string;
  }
  
  const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onEventAdded, isOpen , userId }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'launch' as DayEvent['type'],
      project: '',
      location: ''
    });
  

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const addEventSubmit = async (e: React.FormEvent) => {
      if (!userId) {
        console.log("No access token available");
        
        return;
      }
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      try {
        const dataTosend = {
          title: formData.title,
          description: formData.description,
          date: formData.date + "T" + formData.time+ "Z",
          type: formData.type,
          project: formData.project,
          location: formData.location
        };
        console.log(userId)
        
        const response = await addEvent(userId, dataTosend)

  
        if (!response.ok) {
          throw new Error('Failed to create event');
        }
  
        const data = await response.json();
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
        if (onEventAdded) {
          onEventAdded();
        }
        onClose();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add New Event</h3>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
  
          <form onSubmit={addEventSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-white/60">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
                required
              />
            </div>
  
            <div>
              <label className="block mb-1 text-sm text-white/60">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-24 px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
                required
              />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-white/60">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-white/60">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
                  required
                />
              </div>
            </div>
  
            <div>
              <label className="block mb-1 text-sm text-white/60">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DayEvent['type'] }))}
                className="w-full px-4 py-2 text-white border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20 glass"
                required
              >
  
                <option value="launch">Token Launch</option>
                <option value="airdrop">Airdrop</option>
                <option value="ama">AMA (Ask Me Anything) </option>
                <option value="governance">Governance Vote</option>
                <option value="conference">Conference</option>
                <option value="partnership">Partnership Announcement</option>
                <option value="custom">Custom Event</option>
              </select>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-white/60">Project (Optional)</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-white/60">Location (Optional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg outline-none bg-white/5 border-white/10 focus:border-white/20"
                  required
                />
              </div>
            </div>
  
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 transition-colors rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {/* Add Event */}
                {isSubmitting ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default AddEventModal;