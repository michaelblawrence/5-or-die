import { z } from "zod";

// Schema versions
const PlayerV1Schema = z.object({
  name: z.string(),
  hasPaid: z.boolean(),
  team: z.number().nullable(),
});

const EventV1Schema = z.object({
  schemaVersion: z.literal("1"),
  eventKey: z.string(),
  adminToken: z.string(),
  name: z.string(),
  date: z.string(),
  location: z.string(),
  maxPlayers: z.number(),
  priceTotal: z.number(),
  creator: z.string(),
  players: z.array(PlayerV1Schema),
});

export type EventV1 = z.infer<typeof EventV1Schema>;
export type Player = z.infer<typeof PlayerV1Schema>;
export type Event = EventV1; // We'll add more versions here as needed

// Schema validator with version detection
export function validateEvent(data: unknown): Event {
  // Try to get schema version
  const version = (data as any)?.schemaVersion;

  switch (version) {
    case "1":
      return EventV1Schema.parse(data);
    default:
      throw new Error(`Unknown schema version: ${version}`);
  }
}
