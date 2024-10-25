import type { StorageProvider } from "./types";
import type { Event } from "./schema";
import { validateEvent } from "./schema";

export class S3Provider implements StorageProvider {
  private bucketUrl: string;

  constructor(bucketUrl: string) {
    // Ensure the URL ends with a slash
    this.bucketUrl = bucketUrl.endsWith("/") ? bucketUrl : bucketUrl + "/";
  }

  private getEventUrl(eventKey: string): string {
    return `${this.bucketUrl}${eventKey}.json`;
  }

  async createEvent(event: Event): Promise<void> {
    const eventData: Event = {
      ...event,
      schemaVersion: "1" as const,
    };

    // Validate before saving
    validateEvent(eventData);

    const response = await fetch(this.getEventUrl(event.eventKey), {
      method: "PUT",
      body: JSON.stringify(eventData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }
  }

  async getEvent(eventKey: string): Promise<Event | null> {
    try {
      const response = await fetch(this.getEventUrl(eventKey));

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      const data = await response.json();
      return validateEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  }

  async updateEvent(event: Event): Promise<void> {
    const existingEvent = await this.getEvent(event.eventKey);
    if (!existingEvent) {
      throw new Error("Event not found");
    }

    const eventData: Event = {
      ...event,
      schemaVersion: "1" as const,
    };

    // Validate before saving
    validateEvent(eventData);

    const response = await fetch(this.getEventUrl(event.eventKey), {
      method: "PUT",
      body: JSON.stringify(eventData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update event: ${response.statusText}`);
    }
  }

  async deleteEvent(eventKey: string): Promise<void> {
    const response = await fetch(this.getEventUrl(eventKey), {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  }

  // Note: We don't implement listEvents as we want to prevent listing
  async listEvents(): Promise<Event[]> {
    throw new Error("Listing events is not supported");
  }
}
