import { db } from "@/db/db";

/**
 * A lightweight, SQLite-backed implementation of the AsyncStorage API.
 * This is used to ensure persistent storage across app launches in environments 
 * where external dependency installation may fail or be restricted.
 */
export const AsyncStorage = {
  /**
   * Retrieves a value from the SQLite settings table for a given key.
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      const result = await db.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = ?",
        [key]
      );
      return result ? result.value : null;
    } catch (error) {
      console.error(`AsyncStorage.getItem error for key [${key}]:`, error);
      return null;
    }
  },

  /**
   * Saves a key-value pair to the SQLite settings table.
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await db.runAsync(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        [key, value]
      );
    } catch (error) {
      console.error(`AsyncStorage.setItem error for key [${key}]:`, error);
    }
  },

  /**
   * Removes a key-value pair from the SQLite settings table.
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      await db.runAsync(
        "DELETE FROM settings WHERE key = ?",
        [key]
      );
    } catch (error) {
      console.error(`AsyncStorage.removeItem error for key [${key}]:`, error);
    }
  },
};
