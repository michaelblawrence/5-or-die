import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  PoundSterling,
  CheckCircle,
  XCircle,
  Trophy,
  ChevronDown,
  Shield,
  ChevronUp,
} from "lucide-react";
import { useEvent } from "@/lib/hooks/useEvent";
import { useEventAdmin } from "@/lib/hooks/useEventAdmin";
import { CreateEventModal } from "./CreateEventForm";
import { Event } from "@/lib/storage/types";
import { TeamsSection } from "./TeamsSection";

export const EventPage = ({ eventKey }: { eventKey: string }) => {
  const {
    event,
    isLoading,
    isError,
    // togglePaymentStatus, // You can use this for payment status updates
    updateEvent,
  } = useEvent(eventKey);
  const { isAdmin } = useEventAdmin(event);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTeamsSectionOpen, setTeamsSectionOpen] = useState(false);
  const teamsSectionRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <LoadingState />;
  if (isError || !event) return <ErrorState />;

  const handleAddPlayer = () => {
    if (
      newPlayerName.trim() &&
      event.players.length < event.maxPlayers &&
      !event.players.some((p) => p.name === newPlayerName.trim())
    ) {
      const updatedEvent = {
        ...event,
        players: [
          ...event.players,
          { name: newPlayerName.trim(), hasPaid: false, team: null },
        ],
      };
      updateEvent(updatedEvent);
      setNewPlayerName("");
    }
  };

  const togglePaymentStatus = (playerName: string) => {
    const updatedEvent = {
      ...event,
      players: event.players.map((player) =>
        player.name === playerName
          ? { ...player, hasPaid: !player.hasPaid }
          : player
      ),
    };
    updateEvent(updatedEvent);
  };

  const handleTeamsClick = () => {
    setTeamsSectionOpen((prev) => !prev);

    // If we're opening the section, scroll to it after it's rendered
    if (!isTeamsSectionOpen) {
      setTimeout(() => {
        teamsSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300); // Small delay to ensure the section has rendered
    }
  };

  const totalPaid = event.players.filter((p) => p.hasPaid).length;
  const pricePerPerson = event.priceTotal / event.maxPlayers;
  const totalCollected = totalPaid * pricePerPerson;
  const percentagePaid = (totalCollected / event.priceTotal) * 100;

  const QuickInfoCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Location Card */}
      <motion.div
        className="bg-[#1A1A1A] p-4 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-[#FF2E00]" />
          <h2 className="font-bold">Location</h2>
        </div>
        <p className="text-gray-300">{event.location}</p>
      </motion.div>

      {/* Teams Card */}
      <motion.button
        onClick={handleTeamsClick}
        className="bg-[#1A1A1A] p-4 rounded-lg transition-colors hover:bg-[#252525] relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-[#FF8C00]" />
          <h2 className="font-bold">Teams</h2>
        </div>
        <p className="text-gray-300 text-left">
          {event.teams?.team1Name || "Team 1"} vs{" "}
          {event.teams?.team2Name || "Team 2"}
        </p>
        {event.teamsLocked ? (
          <span className="absolute top-2 right-2 px-2 py-1 bg-green-900/50 rounded-full text-xs">
            Locked
          </span>
        ) : (
          <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-900/50 rounded-full text-xs">
            Not Set
          </span>
        )}
        <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-[#FF8C00] transition-colors" />
        <div className="absolute bottom-2 right-2 text-gray-500 group-hover:text-[#FF8C00] transition-colors">
          {isTeamsSectionOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </motion.button>

      {/* Captain Card */}
      <motion.div
        className="bg-[#1A1A1A] p-4 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-[#FFD600]" />
          <h2 className="font-bold">Captain</h2>
        </div>
        <p className="text-gray-300">{event.creator}</p>
      </motion.div>
    </div>
  );

  // Teams section with collapse animation
  const CollapsibleTeamsSection = () => (
    <AnimatePresence>
      {isTeamsSectionOpen && (
        <motion.div
          ref={teamsSectionRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: "auto",
            opacity: 1,
            transition: { duration: 0.3 },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: { duration: 0.2 },
          }}
          className="overflow-hidden"
        >
          <div className="border-t border-[#333] mt-8 pt-8">
            <TeamsSection
              event={event}
              isAdmin={isAdmin}
              onUpdateEvent={updateEvent}
              onClose={() => setTeamsSectionOpen(false)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-black text-white" data-event-key={eventKey}>
      {/* Captain Mode Banner */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FF2E00] to-[#FFD600] py-2"
        >
          <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">
                <span className="font-extrabold">Captain Mode</span>{" "}
                <span className="text-red-200">enabled</span>
              </span>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Edit Event
            </button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="relative bg-gradient-to-r from-[#FF2E00] via-[#FF8C00] to-[#FFD600] py-8">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern
              id="pinstripe"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pinstripe)" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-black mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {event.name}
          </motion.h1>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date(event.date).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Quick Info Cards */}
        <QuickInfoCards />

        {/* Payment Progress */}
        <motion.div
          className="bg-[#1A1A1A] p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PoundSterling className="w-6 h-6 text-[#FF2E00]" />
              Payment Status
            </h2>
            <div className="text-right">
              <p className="text-2xl font-bold">
                £{totalCollected.toFixed(2)}{" "}
                <span className="text-gray-500 text-sm">
                  / £{event.priceTotal.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                £{pricePerPerson.toFixed(2)} per player
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-[#333] rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF2E00] to-[#FFD600]"
              initial={{ width: 0 }}
              animate={{ width: `${percentagePaid}%` }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </div>

          <p className="text-sm text-gray-400 mb-6">
            {totalPaid} out of {event.players.length} players have paid
          </p>

          {/* Add Player Form */}
          {event.players.length < event.maxPlayers && (
            <motion.div
              className="bg-[#1A1A1A] py-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Who are we missing?"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#2D2D2D] border-2 border-[#333] 
                       focus:border-[#FF2E00] outline-none transition-colors text-white"
                />
                <button
                  onClick={handleAddPlayer}
                  disabled={!newPlayerName.trim()}
                  className="px-6 py-2 bg-[#FF2E00] text-white rounded-lg font-bold text-nowrap
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-[#FF4D00] transition-colors"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}

          {/* Players List */}
          <div className="grid gap-2">
            <AnimatePresence>
              {event.players.map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg 
                    ${player.hasPaid ? "bg-[#1F2937]" : "bg-[#2D2D2D]"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF2E00] to-[#FF8C00] 
                                  flex items-center justify-center font-bold"
                    >
                      {player.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {player.name}
                      {player.name === event.creator && (
                        <span className="ml-2 text-xs bg-[#FF2E00] px-2 py-0.5 rounded-full">
                          Captain
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePaymentStatus(player.name)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                         transition-colors hover:bg-[#2D2D2D]"
                  >
                    {player.hasPaid ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400">
                        <XCircle className="w-5 h-5" />
                        Unpaid
                      </span>
                    )}
                  </button>
                  {isAdmin && player.name !== event.creator && (
                    <button
                      onClick={() => {
                        const updatedEvent = {
                          ...event,
                          players: event.players.filter(
                            (p) => p.name !== player.name
                          ),
                        };
                        updateEvent(updatedEvent);
                      }}
                      className="text-[#FF2E00] hover:text-[#FF4D00] transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Collapsible Teams Section at the bottom */}
          {event.players.length >= 2 && <CollapsibleTeamsSection />}
        </motion.div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <CreateEventModal
          initialData={event}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={async (formData) => {
            const updatedEvent: Event = {
              ...event,
              name: formData.name,
              date: `${formData.date}T${formData.time}`,
              location: formData.location,
              maxPlayers: parseInt(formData.maxPlayers),
              priceTotal: parseFloat(formData.priceTotal),
              creator: formData.creator,
            };
            await updateEvent(updatedEvent);
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div
      className="text-8xl"
      animate={{
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      ⚽
    </motion.div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
      <p className="text-gray-400">
        This game might have been cancelled or doesn't exist.
      </p>
    </div>
  </div>
);
