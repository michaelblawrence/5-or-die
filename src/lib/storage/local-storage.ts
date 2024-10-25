import { StorageProvider, Event } from "./types";

export class LocalStorageProvider implements StorageProvider {
  private readonly storageKey = "five-or-die-events";

  private async getEvents(): Promise<Record<string, Event>> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  private async saveEvents(events: Record<string, Event>): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  async createEvent(event: Event): Promise<void> {
    const events = await this.getEvents();
    if (events[event.eventKey]) {
      throw new Error("Event already exists");
    }
    events[event.eventKey] = event;
    await this.saveEvents(events);
  }

  async getEvent(eventKey: string): Promise<Event | null> {
    const events = await this.getEvents();
    return events[eventKey] || null;
  }

  async updateEvent(event: Event): Promise<void> {
    const events = await this.getEvents();
    if (!events[event.eventKey]) {
      throw new Error("Event not found");
    }
    events[event.eventKey] = event;
    await this.saveEvents(events);
  }

  async deleteEvent(eventKey: string): Promise<void> {
    const events = await this.getEvents();
    delete events[eventKey];
    await this.saveEvents(events);
  }

  async listEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    return Object.values(events);
  }
}
