import { Stack } from "expo-router";
import { initDB } from "@/db/db";
import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
