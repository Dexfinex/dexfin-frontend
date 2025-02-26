import React, { useState, useEffect, useContext } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Tag, Clock, Globe, Plus, X } from 'lucide-react';
import AddEventModal from './AddEventModal.tsx'
import { getLoadEvents, deleteEvent, editEvent } from '../../../hooks/useCalendar';
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
    // TODO: temporal code until we have concrete implementation of fetching access token
    if (isConnected && !userData) {
      fetchUserData();
    }

    if (userData?.accessToken) {
      loadEvents();
    }


  }, [userData, isConnected]);

  useEffect(()=>{
    console.log(`Current wallet type: ${walletType}`);
    if(walletType==='EOA'){
      console.log('Using external wallet(MetaMask, etc)');
    } else if(walletType=== 'EMBEDDED'){
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
      console.log(response);
      setEvents(response)
      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      setEvents(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1);
      const dateString = currentDate.toISOString().slice(0, 10);
      if (!events || events.length == 0) {
        days.push(
          <div key={day} className="p-2 border min-h-24 border-white/10">
            <div className="mb-2 font-medium">{day}</div>
          </div>
        );
      }
      else {
        const currentDayEvents = events?.filter(event => {
          const eventDate = event.date.split('T')[0];
          return eventDate === dateString;
        });

        days.push(
          <div key={day} className="p-2 border min-h-24 border-white/10">
            <div className="mb-2 font-medium">{day}</div>
            {currentDayEvents && currentDayEvents.length > 0 ?
              currentDayEvents.map(event => (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded mb-1 ${getEventTypeColor(event.type)} cursor-pointer hover:opacity-80`}
                  onClick={() => handleEventClick(event)}
                >
                  {event.title}
                </div>
              ))
              : <></>
            }
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
    // if(events)
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
                className="p-4 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`px-2 py-1 rounded text-sm ${getEventTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>

                <h3 className="mb-1 text-lg font-medium">{event.title}</h3>
                <p className="mb-3 text-white/60">{event.description}</p>

                <div className="flex items-center gap-4 text-sm">
                  {event.project && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Tag className="w-4 h-4" />
                      <span>{event.project}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Globe className="w-4 h-4" />
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
              className="p-1 transition-colors rounded-lg hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
              className="p-1 transition-colors rounded-lg hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${view === 'month' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
          >
            List
          </button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 font-medium text-center text-white/60">
              {day}
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