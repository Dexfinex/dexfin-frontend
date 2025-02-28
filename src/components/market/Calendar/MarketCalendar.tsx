import React, { useState, useEffect, useContext } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Tag, Clock, Globe, Plus, X } from 'lucide-react';
import AddEventModal from './AddEventModal.tsx'
import { getLoadEvents, deleteEvent, editEvent } from './api/Calendar-api.ts';
import EventDetailsModal from './EventDetailsModal.tsx';
import { Web3AuthContext } from '../../../providers/Web3AuthContext.tsx';

export interface DayEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  type: 'launch' | 'airdrop' | 'ama' | 'governance' | 'conference' | 'partnership' | 'custom';
  project?: string;
  location?: string;
  userId?: string;
}

const getEventTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'launch':
      return 'bg-purple-500/20 text-purple-400';
    case 'airdrop':
      return 'bg-orange-500/20 text-orange-400';
    case 'ama':
      return 'bg-blue-500/20 text-blue-400';
    case 'governance':
      return 'bg-green-500/20 text-green-400';
    case 'conference':
      return 'bg-red-500/20 text-red-400';
    case 'partnership':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'custom':
      return 'bg-gray-500/20 text-gray-400';
  }
};

export const MarketCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');
  const [events, setEvents] = useState<DayEvent[]>();
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userData, fetchUserData, address, isConnected, walletType } = useContext(Web3AuthContext);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  useEffect(() => {
    if (isConnected && !userData) {
      fetchUserData();
    }
    

    if (userData?.accessToken) {
      loadEvents();
    }
  }, [userData, isConnected]);

  useEffect(() => {
    console.log(`Current wallet type: ${walletType}`);
    if (walletType === 'EOA') {
      console.log('Using external wallet(MetaMask, etc)');
    } else if (walletType === 'EMBEDDED') {
      console.log('Using embedded wallet');
    }
  }, [walletType]);

  const loadEvents = async () => {
    try {
      if (!userData?.accessToken) {
        console.log("No access token available");
        return;
      }
      console.log(userData.accessToken);
      const response = await getLoadEvents(userData.accessToken);
      console.log(response.userId);
      setEvents(response)
      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      setEvents(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditEvent = async (event: any) => {
    try {
      if (!userData?.accessToken) {
        console.log("No access token available");
        return;
      }
      const response = await editEvent(userData.accessToken, event);
      console.log(response)
      loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: any) => {
    try {
      if (!userData?.accessToken) {
        console.log("No access token available");
        return;
      }
      const response = await deleteEvent(userData.accessToken, eventId);
      console.log(response)
      loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
    setIsModalOpen(false);
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);

    // Add empty cells for the days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-24" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1);
      const dateString = currentDate.toISOString().slice(0, 10);
      
      if (!events || events.length == 0) {
        days.push(
          <div key={day} className="p-1 sm:p-2 border min-h-16 sm:min-h-24 border-white/10">
            <div className="mb-1 sm:mb-2 text-sm sm:text-base font-medium">{day}</div>
          </div>
        );
      } else {
        const currentDayEvents = events?.filter(event => {
          const eventDate = event.date.split('T')[0];
          return eventDate === dateString;
        });

        days.push(
          <div key={day} className="p-1 sm:p-2 border min-h-16 sm:min-h-24 border-white/10 overflow-hidden">
            <div className="mb-1 sm:mb-2 text-sm sm:text-base font-medium">{day}</div>
            <div className="space-y-0.5 overflow-y-auto max-h-12 sm:max-h-full">
              {currentDayEvents && currentDayEvents.length > 0 ?
                currentDayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-0.5 sm:p-1 rounded truncate ${getEventTypeColor(event.type)} cursor-pointer hover:opacity-80`}
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </div>
                ))
                : <></>
              }
            </div>
          </div>
        );
      }
    }

    return (
      <>
        {days}
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </>
    );
  };

  const renderListView = () => {
    if (!events) {
      return;
    }
    
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth()
      );
    });

    return (
      <div className="space-y-3">
        {filteredEvents
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map(event => {
            // Split the datetime string to separate date and time
            const [date, time] = event.date.split('T');
            // Format time to remove the '.000Z' part
            const formattedTime = time.split('.')[0];

            return (
              <div
                key={event.id}
                className="p-3 sm:p-4 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                onClick={() => handleEventClick(event)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className={`px-2 py-1 rounded text-xs sm:text-sm w-fit ${getEventTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>

                <h3 className="mb-1 text-base sm:text-lg font-medium">{event.title}</h3>
                <p className="mb-3 text-sm text-white/60 line-clamp-2 sm:line-clamp-none">{event.description}</p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  {event.project && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{event.project}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        {/* Month/Year and Navigation */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="p-1 transition-colors rounded-lg hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="p-1 transition-colors rounded-lg hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add Event</span>
          </button>
          <div className="flex items-center">
            <button
              onClick={() => setView('month')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors text-sm sm:text-base ${
                view === 'month' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors text-sm sm:text-base ${
                view === 'list' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'month' ? (
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-1 sm:p-2 font-medium text-center text-xs sm:text-sm text-white/60">
              {window.innerWidth < 640 ? day.substr(0, 1) : day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      ) : (
        renderListView()
      )}

      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onEventAdded={() => loadEvents()}
        userId={userData?.accessToken || ''}
      />
    </div>
  );
};