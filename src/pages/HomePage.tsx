import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { LandingPage } from "../components/LandingPage";
import { CreateEventModal } from "../components/CreateEventForm";
import { AdminUrlModal } from "../components/AdminUrlModal";
import { useCreateEvent } from "../lib/hooks/useCreateEvent";
import type { Event } from "../lib/storage/types";

export function HomePage() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [adminUrl, setAdminUrl] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const navigate = useNavigate();
  const createEvent = useCreateEvent();

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
    const adminToken = nanoid(20);

    const newEvent: Event = {
      eventKey,
      adminToken,
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
      setShowCreateEvent(false);
      setAdminUrl(
        `${window.location.origin}/event/${eventKey}?admin=${adminToken}`
      );
      setShowAdminModal(true);
      // We'll navigate after they copy the admin URL
    } catch (error) {
      console.error("Failed to create event:", error);
      // TODO: Add toast notification
    }
  };

  return (
    <>
      <LandingPage onCreateGame={() => setShowCreateEvent(true)} />

      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onSubmit={handleCreateEvent}
          isSubmitting={createEvent.isPending}
        />
      )}

      {showAdminModal && adminUrl && (
        <AdminUrlModal
          adminUrl={adminUrl}
          onClose={() => {
            setShowAdminModal(false);
            // Navigate to event page after they've seen the admin URL
            navigate(new URL(adminUrl).pathname);
          }}
        />
      )}
    </>
  );
}
