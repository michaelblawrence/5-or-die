import { Event } from "./schema";
export type { Event, Player } from "./schema";

export interface StorageProvider {
  createEvent(event: Event): Promise<void>;
  getEvent(eventKey: string): Promise<Event | null>;
  updateEvent(event: Event): Promise<void>;
  deleteEvent(eventKey: string): Promise<void>;
  listEvents(): Promise<Event[]>;
}
