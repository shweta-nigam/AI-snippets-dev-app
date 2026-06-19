import { db } from "../db/db";

export interface ISession {
  id: number;
  type: string; // 'Study' or 'Coding'
  duration: number; // in seconds
  createdAt: string;
}

export const createSession = async (type: string, duration: number) => {
  try {
    await db.runAsync(
      `
      INSERT INTO sessions (type, duration)
      VALUES (?, ?)
      `,
      [type, duration]
    );
    console.log(`Session of type ${type} saved with duration ${duration}s`);
  } catch (error) {
    console.error("Error saving session:", error);
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

    sessions.forEach((session) => {
      if (session.type === "Study") {
        totalStudy += session.duration;
      } else if (session.type === "Coding") {
        totalCoding += session.duration;
      }
    });

    return {
      totalStudy,
      totalCoding,
      sessionCount: sessions.length,
      sessions,
    };
  } catch (error) {
    console.error("Error getting session stats:", error);
    return {
      totalStudy: 0,
      totalCoding: 0,
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
