import { useMutation } from "@tanstack/react-query";
import { getStorage } from "../storage";
import type { Event } from "../storage/types";

export function useCreateEvent() {
  const storage = getStorage();

  return useMutation({
    mutationFn: (event: Event) => storage.createEvent(event),
  });
}
