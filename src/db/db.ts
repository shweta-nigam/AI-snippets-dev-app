import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("snippets.db");

export const initDB = async () => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS snippets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT NOT NULL,
            imageUri TEXT,
            language TEXT,
            tags TEXT,
            isFavorite INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            duration INTEGER NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
            );

            CREATE TABLE IF NOT EXISTS user_profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL DEFAULT 'Developer',
            role TEXT NOT NULL DEFAULT 'Software Engineer',
            avatarUrl TEXT NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
            );
            `)
         console.log("Database initialized");

          // Alter sessions table to add title if it doesn't exist
          try {
              await db.execAsync("ALTER TABLE sessions ADD COLUMN title TEXT;");
              console.log("sessions table altered to add title column");
          } catch (e) {
              // Column probably already exists, ignore
          }

         // Seed default user profile if empty
         const profile = await db.getFirstAsync("SELECT * FROM user_profile");
         if (!profile) {
             const seed = Math.random().toString(36).substring(7);
             const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}`;
             await db.runAsync(
                 "INSERT INTO user_profile (name, role, avatarUrl) VALUES (?, ?, ?)",
                 ["Developer", "Software Engineer", defaultAvatar]
             );
             console.log("Default user profile seeded");
         }
    } catch (error) {
       console.log("DB Init Error:", error); 
    }
}
