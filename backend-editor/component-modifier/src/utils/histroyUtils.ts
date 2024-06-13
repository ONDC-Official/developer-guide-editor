import { ComponentsType } from "./ComponentType/ComponentsFolderTypeEditable";
import { copyDir, deleteFolderSync } from "./fileUtils";
import path from "path";
import fs from "fs/promises";
import { isBinary } from "./fileUtils";

export class HistoryUtil {
  history: string[];
  maxHistory: number;
  historyPath: string;

  constructor(maxHistory: number) {
    this.history = [];
    this.maxHistory = maxHistory;
    const historyPath = isBinary? path.join(path.dirname(process.execPath), "./history") : path.resolve(__dirname, "../../history");
    this.historyPath = historyPath

    this.initializeHistoryFolder();
  }

  async initializeHistoryFolder() {
    try {
      await deleteFolderSync(this.historyPath);
      await fs.mkdir(this.historyPath, { recursive: true });
    } catch (error) {
      console.error("Failed to create history directory:", error);
    }
  }

  async addHistory(components: ComponentsType) {
    if (this.history.length >= this.maxHistory) {
      // Optionally, remove the oldest directory
      await this.removeOldestHistory();
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Safe filenames
    const directoryName = `history-${timestamp}`;
    const directoryPath = path.join(this.historyPath, directoryName);

    try {
      await copyDir(components.folderPath, directoryPath);
      this.history.push(directoryPath);
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  }

  async removeOldestHistory() {
    if (this.history.length === 0) return;
    try {
      const oldestHistory = this.history.shift();
      await fs.rm(oldestHistory, { recursive: true });
      console.log(`Removed oldest history: ${oldestHistory}`);
    } catch (error) {
      console.error("Failed to remove oldest history:", error);
    }
  }

  async undoLastAction() {
    if (this.history.length === 0) {
      console.log("No history to undo");
      throw new Error("No history to undo");
    }

    try {
      const lastHistory = this.history.pop();
      return lastHistory;
    } catch (error) {
      console.error("Failed to get latest history:", error);
    }
  }
}

export async function CreateSave(components) {
  console.log("Creating Save");
  const histroyPath = path.resolve(__dirname, "../../history");

  //   await copyDir(components.folderPath);
}
