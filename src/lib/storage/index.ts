import { StorageProvider } from "./types";
import { LocalStorageProvider } from "./local-storage";

type StorageProviderType = "localStorage" | "turso";

let storageProvider: StorageProvider;

export function initializeStorage(type: StorageProviderType) {
  switch (type) {
    case "localStorage":
      storageProvider = new LocalStorageProvider();
      break;
    case "turso":
      // We'll implement this later
      throw new Error("Turso provider not implemented yet");
    default:
      throw new Error(`Unknown storage provider type: ${type}`);
  }
}

export function getStorage(): StorageProvider {
  if (!storageProvider) {
    throw new Error("Storage not initialized");
  }
  return storageProvider;
}
