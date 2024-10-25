import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EventPage } from "./components/EventPage";
import { CreateEventModal } from "./components/CreateEventForm";
import { LandingPage } from "./components/LandingPage";
import { initializeStorage } from "./lib/storage";
import { useCreateEvent } from "./lib/hooks/useCreateEvent";
import { Event } from "./lib/storage/types";

// Initialize React Query client
const queryClient = new QueryClient();

// Google API configuration
// const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // We'll get this from Google Cloud Console
// const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID as string;
// const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;

// Initialize storage with localStorage provider
initializeStorage("localStorage");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
}

function Routes() {
  const [eventKey, setEventKey] = useState<string | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const createEvent = useCreateEvent();

  useEffect(() => {
    // Get eventKey from URL
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("event");
    if (key) {
      setEventKey(key);
    }
  }, []);

  const handleCreateEvent = async (formData: {
    name: string;
    date: string;
    time: string;
    location: string;
    maxPlayers: string;
    priceTotal: string;
    creator: string;
  }) => {
    const eventKey = nanoid(10);

    const newEvent: Event = {
      eventKey,
      name: formData.name,
      date: `${formData.date}T${formData.time}`,
      location: formData.location,
      maxPlayers: parseInt(formData.maxPlayers),
      priceTotal: parseFloat(formData.priceTotal),
      creator: formData.creator,
      players: [
        {
          name: formData.creator,
          hasPaid: false,
          team: null,
        },
      ],
    };

    try {
      await createEvent.mutateAsync(newEvent);
      // Close modal and navigate to the new event page
      // setIsModalOpen(false);
      setShowCreateEvent(false);
      // navigate(`/event/${eventKey}`);
      setEventKey(eventKey);
    } catch (error) {
      console.error("Failed to create event:", error);
      // You might want to show a toast notification here
    }
  };

  return eventKey ? (
    <EventPage
      eventKey={eventKey}
      // spreadsheetId={SPREADSHEET_ID}
      // apiKey={API_KEY}
    />
  ) : (
    <>
      <LandingPage onCreateGame={() => setShowCreateEvent(true)} />

      {/* Create Event Modal */}
      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onSubmit={handleCreateEvent}
          isSubmitting={createEvent.isPending}
        />
      )}
    </>
  );
}

export default App;
