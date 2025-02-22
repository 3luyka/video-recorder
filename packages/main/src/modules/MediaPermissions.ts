import { ipcMain, systemPreferences } from "electron";
import type { AppModule } from "../AppModule.js";
import type { ModuleContext } from "../ModuleContext.js";

class MediaPermissionsModule implements AppModule {
  async enable(_context: ModuleContext): Promise<void> {
    await this.init();
  }

  private async init(): Promise<void> {
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    ipcMain.handle("check-media-permissions", async () => {
      return {
        camera: systemPreferences.getMediaAccessStatus("camera"),
        microphone: systemPreferences.getMediaAccessStatus("microphone"),
      };
    });

    ipcMain.handle("request-media-permissions", async () => {
      try {
        const cameraPermission =
          await systemPreferences.askForMediaAccess("camera");

        const microphonePermission =
          await systemPreferences.askForMediaAccess("microphone");

        return {
          camera: cameraPermission,
          microphone: microphonePermission,
        };
      } catch (error) {
        throw new Error(
          `Failed to request media permissions: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    });
  }

  dispose(): void {
    ipcMain.removeHandler("check-media-permissions");
    ipcMain.removeHandler("request-media-permissions");
  }
}

export function mediaPermissionsModule(
  ...args: ConstructorParameters<typeof MediaPermissionsModule>
) {
  return new MediaPermissionsModule(...args);
}
