import { StorageProvider } from "./types";
import { LocalStorageProvider } from "./local-storage";
import { S3Provider } from "./s3-provider";

export type StorageConfig =
  | { type: "localStorage" }
  | { type: "s3"; bucketUrl: string };

let storageProvider: StorageProvider;

export function initializeStorage(config: StorageConfig) {
  switch (config.type) {
    case "localStorage":
      storageProvider = new LocalStorageProvider();
      break;
    case "s3":
      storageProvider = new S3Provider(config.bucketUrl);
      break;
    default:
      throw new Error(
        // @ts-expect-error Unknown storage provider type
        `Unknown storage provider type: ${config.type as string}`
      );
  }
}

export function getStorage(): StorageProvider {
  if (!storageProvider) {
    throw new Error("Storage not initialized");
  }
  return storageProvider;
}
