import { ipcRenderer } from "electron";

export type MediaAccessStatus =
  | "not-determined"
  | "granted"
  | "denied"
  | "restricted"
  | "unknown";

export type MediaPermissionStatus = {
  camera: MediaAccessStatus;
  microphone: MediaAccessStatus;
  error?: string;
};

export type MediaPermissionRequest = {
  camera: boolean;
  microphone: boolean;
  error?: string;
};

export async function checkMediaPermissions(): Promise<MediaPermissionStatus> {
  try {
    return await ipcRenderer.invoke("check-media-permissions");
  } catch (error) {
    console.error(error);

    return {
      camera: "unknown",
      microphone: "unknown",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function requestMediaPermissions(): Promise<MediaPermissionRequest> {
  try {
    return await ipcRenderer.invoke("request-media-permissions");
  } catch (error) {
    console.error(error);

    return {
      camera: false,
      microphone: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function saveRecording(buffer: ArrayBuffer, fileName: string) {
  return await ipcRenderer.invoke("save-recording", { buffer, fileName });
}
