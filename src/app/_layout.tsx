import { Stack } from "expo-router";
import { initDB } from "@/db/db";
import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { TimerProvider } from "@/context/TimerContext";

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <ThemeProvider>
      <TimerProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </TimerProvider>
    </ThemeProvider>
  );
}
