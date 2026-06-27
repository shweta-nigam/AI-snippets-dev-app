import { db } from "../db/db";

export interface ISession {
  id: number;
  type: string; // 'Study', 'Coding', or 'Project'
  duration: number; // in seconds
  title?: string; // name of the project if type is 'Project'
  createdAt: string;
}

export const createSession = async (type: string, duration: number, title?: string) => {
  try {
    await db.runAsync(
      `
      INSERT INTO sessions (type, duration, title)
      VALUES (?, ?, ?)
      `,
      [type, duration, title || null]
    );
    console.log(`Session of type ${type} saved with duration ${duration}s (Title: ${title})`);
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export const updateSession = async (id: number, duration: number, title?: string) => {
  try {
    await db.runAsync(
      `
      UPDATE sessions
      SET duration = ?, title = ?
      WHERE id = ?
      `,
      [duration, title || null, id]
    );
    console.log(`Session ${id} updated with duration ${duration}s and title ${title}`);
  } catch (error) {
    console.error("Error updating session:", error);
  }
};

export const getAllSessions = async (): Promise<ISession[]> => {
  try {
    const result = await db.getAllAsync(`
      SELECT * FROM sessions
      ORDER BY createdAt DESC
    `);
    return result as ISession[];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
};

export const getSessionStats = async () => {
  try {
    const sessions = await getAllSessions();
    let totalStudy = 0;
    let totalCoding = 0;
    let totalProject = 0;

    sessions.forEach((session) => {
      const typeLower = (session.type || "").toLowerCase().trim();
      if (typeLower === "study") {
        totalStudy += session.duration;
      } else if (typeLower === "coding") {
        totalCoding += session.duration;
      } else {
        totalProject += session.duration;
      }
    });

    return {
      totalStudy,
      totalCoding,
      totalProject,
      sessionCount: sessions.length,
      sessions,
    };
  } catch (error) {
    console.error("Error getting session stats:", error);
    return {
      totalStudy: 0,
      totalCoding: 0,
      totalProject: 0,
      sessionCount: 0,
      sessions: [],
    };
  }
};

export const getSnippetLanguageStats = async () => {
  try {
    const result = await db.getAllAsync<{ language: string; count: number }>(`
      SELECT language, COUNT(*) as count 
      FROM snippets 
      WHERE language IS NOT NULL AND language != ''
      GROUP BY language
      ORDER BY count DESC
    `);
    return result;
  } catch (error) {
    console.error("Error getting language stats:", error);
    return [];
  }
};

/**
 * Deletes a specific session by its ID.
 */
export const deleteSession = async (id: number): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM sessions WHERE id = ?", [id]);
    console.log(`Session with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`Error deleting session with ID ${id}:`, error);
    return false;
  }
};

/**
 * Clears all sessions from the sessions table.
 */
export const clearAllSessions = async (): Promise<boolean> => {
  try {
    await db.runAsync("DELETE FROM sessions");
    console.log("All focus sessions cleared successfully.");
    return true;
  } catch (error) {
    console.error("Error clearing all focus sessions:", error);
    return false;
  }
};

