export const explainCode = async (code: string) => {
  try {
    console.log(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
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
                  text: `
You are a coding teacher.

Explain this code simply for beginners:

${code}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation generated."
    );
  } catch (error) {
    console.log(error);

    return "Something went wrong";
  }
};