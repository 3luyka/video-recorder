import { dialog, ipcMain, systemPreferences } from "electron";
import type { AppModule } from "../AppModule.js";
import type { ModuleContext } from "../ModuleContext.js";
import { writeFile } from "fs/promises";

class IcpHandlersModule implements AppModule {
  async enable(_context: ModuleContext): Promise<void> {
    await this.init();
  }

  private async init(): Promise<void> {
    this.setupIpcHandlers();
  }

  private async handleCheckMediaPermissions() {
    return {
      camera: systemPreferences.getMediaAccessStatus("camera"),
      microphone: systemPreferences.getMediaAccessStatus("microphone"),
    };
  }

  private async handleRequestMediaPermissions() {
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
  }

  private async handleSaveFile(
    _: unknown,
    { buffer, fileName }: { buffer: ArrayBuffer; fileName: string }
  ) {
    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath: fileName,
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    try {
      await writeFile(filePath, Buffer.from(buffer));

      return { success: true, filePath };
    } catch (error: unknown) {
      console.error("Failed to save file:", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private setupIpcHandlers(): void {
    ipcMain.handle("check-media-permissions", this.handleCheckMediaPermissions);
    ipcMain.handle(
      "request-media-permissions",
      this.handleRequestMediaPermissions
    );
    ipcMain.handle("save-recording", this.handleSaveFile);
  }

  dispose(): void {
    ipcMain.removeHandler("check-media-permissions");
    ipcMain.removeHandler("request-media-permissions");
    ipcMain.removeHandler("save-recording");
  }
}

export function icpHandlersModule(
  ...args: ConstructorParameters<typeof IcpHandlersModule>
) {
  return new IcpHandlersModule(...args);
}
