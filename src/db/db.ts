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
            `)
         console.log("Database initialized");     
    } catch (error) {
       console.log("DB Init Error:", error); 
    }
}
