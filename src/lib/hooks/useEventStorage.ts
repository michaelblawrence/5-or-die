import { useState, useCallback } from "react";

export function useEventStorage(eventKey: string) {
  // Track if user has joined this event
  const [hasJoinedEvent, setHasJoinedEvent] = useState(() => {
    try {
      return localStorage.getItem(`event:${eventKey}:joined`) === "true";
    } catch {
      return false;
    }
  });

  const markEventJoined = useCallback(() => {
    try {
      localStorage.setItem(`event:${eventKey}:joined`, "true");
      setHasJoinedEvent(true);
    } catch (error) {
      console.error("Failed to update localStorage:", error);
    }
  }, [eventKey]);

  return {
    hasJoinedEvent,
    markEventJoined,
  };
}
