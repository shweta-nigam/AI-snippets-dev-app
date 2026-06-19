import { db } from "../db/db";

export const saveApiKey = async (key: string) => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES ('gemini_api_key', ?)`,
      [key]
    );
    console.log("Gemini API key saved in SQLite settings table.");
  } catch (error) {
    console.error("Error saving API key:", error);
  }
};

export const getApiKey = async (): Promise<string> => {
  try {
    const result = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM settings WHERE key = 'gemini_api_key'`
    );
    return result ? result.value : "";
  } catch (error) {
    console.error("Error getting API key:", error);
    return "";
  }
};

export const explainCode = async (code: string, apiKey: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a coding teacher.\n\nExplain this code simply for beginners:\n\n${code}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (response.status !== 200) {
      return data?.error?.message || "Error generating explanation. Please check your API key.";
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation generated."
    );
  } catch (error) {
    console.error(error);
    return "Something went wrong. Please verify your internet connection and API key.";
  }
};