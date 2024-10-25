import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorage } from "../storage";
import type { Event } from "../storage/types";

export function useEvent(eventKey: string) {
  const queryClient = useQueryClient();
  const storage = getStorage();

  const eventQuery = useQuery({
    queryKey: ["event", eventKey],
    queryFn: () => storage.getEvent(eventKey),
  });

  const updateEventMutation = useMutation({
    mutationFn: (event: Event) => storage.updateEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", eventKey] });
    },
  });

  const togglePaymentStatus = async (playerName: string) => {
    if (!eventQuery.data) return;

    const updatedEvent = {
      ...eventQuery.data,
      players: eventQuery.data.players.map((player) =>
        player.name === playerName
          ? { ...player, hasPaid: !player.hasPaid }
          : player
      ),
    };

    await updateEventMutation.mutateAsync(updatedEvent);
  };

  return {
    event: eventQuery.data,
    isLoading: eventQuery.isLoading,
    isError: eventQuery.isError,
    togglePaymentStatus,
    updateEvent: updateEventMutation.mutate,
  };
}
