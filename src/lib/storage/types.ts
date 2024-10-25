export interface Player {
  name: string;
  hasPaid: boolean;
  team: number | null;
}

export interface Event {
  eventKey: string;
  name: string;
  adminToken: string;
  date: string;
  location: string;
  maxPlayers: number;
  priceTotal: number;
  creator: string;
  players: Player[];
}

export interface StorageProvider {
  createEvent(event: Event): Promise<void>;
  getEvent(eventKey: string): Promise<Event | null>;
  updateEvent(event: Event): Promise<void>;
  deleteEvent(eventKey: string): Promise<void>;
  listEvents(): Promise<Event[]>;
}
