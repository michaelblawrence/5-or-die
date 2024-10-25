import { useState } from "react";
import { Shuffle, Edit2, Lock, Unlock, Save, ChevronUp } from "lucide-react";
import type { Event } from "../lib/storage/schema";

type TeamsProps = {
  event: Event;
  isAdmin: boolean;
  onUpdateEvent: (event: Event) => void;
  onClose: () => void;
};

export function TeamsSection({
  event,
  isAdmin,
  onUpdateEvent,
  onClose,
}: TeamsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [team1Name, setTeam1Name] = useState(
    event.teams?.team1Name || "Team 1"
  );
  const [team2Name, setTeam2Name] = useState(
    event.teams?.team2Name || "Team 2"
  );

  const team1Players = event.players.filter((p) => p.team === 1);
  const team2Players = event.players.filter((p) => p.team === 2);
  const unassignedPlayers = event.players.filter((p) => p.team === null);

  const shuffleTeams = async () => {
    // Shuffle all players
    const allPlayers = [...event.players];
    for (let i = allPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
    }

    // Split into two teams
    const updatedPlayers = allPlayers.map((player, index) => ({
      ...player,
      team: index < allPlayers.length / 2 ? 1 : 2,
    }));

    const updatedEvent = {
      ...event,
      players: updatedPlayers,
    };

    await onUpdateEvent(updatedEvent);
  };

  const toggleTeamsLock = async () => {
    const updatedEvent = {
      ...event,
      teamsLocked: !event.teamsLocked,
    };
    await onUpdateEvent(updatedEvent);
  };

  const saveTeamNames = async () => {
    const updatedEvent = {
      ...event,
      teams: {
        team1Name,
        team2Name,
      },
    };
    await onUpdateEvent(updatedEvent);
    setIsEditing(false);
  };

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Teams</h2>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              {!event.teamsLocked && (
                <button
                  onClick={shuffleTeams}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF2E00] text-white rounded-lg 
                         hover:bg-[#FF4D00] transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  Randomise Teams
                </button>
              )}
              <button
                onClick={toggleTeamsLock}
                className="flex items-center gap-2 px-4 py-2 bg-[#333] text-white rounded-lg 
                       hover:bg-[#444] transition-colors"
              >
                {event.teamsLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Teams Locked
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Lock Teams
                  </>
                )}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] 
                     text-white rounded-lg transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>

      {unassignedPlayers.length > 0 && (
        <div className="bg-[#222] p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-400 mb-2">
            Unassigned Players
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassignedPlayers.map((player) => (
              <span
                key={player.name}
                className="px-3 py-1 bg-[#333] rounded-full text-sm"
              >
                {player.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team 1 */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            {isEditing ? (
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="bg-[#222] px-3 py-1 rounded-lg text-white"
              />
            ) : (
              <h3 className="font-bold">{team1Name}</h3>
            )}
            {isAdmin && !isEditing && (
              <button onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {team1Players.map((player) => (
              <div
                key={player.name}
                className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg"
              >
                <span>{player.name}</span>
                {player.hasPaid && (
                  <span className="text-xs bg-green-900/50 px-2 py-1 rounded-full">
                    Paid
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Team 2 */}
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            {isEditing ? (
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="bg-[#222] px-3 py-1 rounded-lg text-white"
              />
            ) : (
              <h3 className="font-bold">{team2Name}</h3>
            )}
            {isAdmin && !isEditing && (
              <button onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {team2Players.map((player) => (
              <div
                key={player.name}
                className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg"
              >
                <span>{player.name}</span>
                {player.hasPaid && (
                  <span className="text-xs bg-green-900/50 px-2 py-1 rounded-full">
                    Paid
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={saveTeamNames}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF2E00] text-white rounded-lg 
                     hover:bg-[#FF4D00] transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Team Names
          </button>
        </div>
      )}
    </div>
  );
}
