import React, { createContext, useContext, useState, useEffect } from "react";
import { AsyncStorage } from "@/services/storage.service";

export type TimerMode = "app_only" | "keep_running";

interface ITimerContext {
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => Promise<void>;
  focusMode: boolean;
  setFocusMode: (enabled: boolean) => Promise<void>;
  
  // Timer active states
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  
  // Navigation blocking modal state
  blockNavigationModalVisible: boolean;
  setBlockNavigationModalVisible: (visible: boolean) => void;
}

const TimerContext = createContext<ITimerContext>({
  timerMode: "app_only",
  setTimerMode: async () => {},
  focusMode: false,
  setFocusMode: async () => {},
  isTimerRunning: false,
  setIsTimerRunning: () => {},
  seconds: 0,
  setSeconds: () => {},
  blockNavigationModalVisible: false,
  setBlockNavigationModalVisible: () => {},
});

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timerMode, setTimerModeState] = useState<TimerMode>("app_only");
  const [focusMode, setFocusModeState] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [blockNavigationModalVisible, setBlockNavigationModalVisible] = useState<boolean>(false);

  // Load saved configurations from storage on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const savedTimerMode = await AsyncStorage.getItem("@timer_mode");
        if (savedTimerMode === "app_only" || savedTimerMode === "keep_running") {
          setTimerModeState(savedTimerMode as TimerMode);
        }

        const savedFocusMode = await AsyncStorage.getItem("@focus_mode");
        if (savedFocusMode !== null) {
          setFocusModeState(savedFocusMode === "true");
        }
      } catch (error) {
        console.error("Error loading timer settings from AsyncStorage:", error);
      }
    }
    loadSettings();
  }, []);

  const setTimerMode = async (mode: TimerMode) => {
    try {
      setTimerModeState(mode);
      await AsyncStorage.setItem("@timer_mode", mode);
    } catch (error) {
      console.error("Error saving timer mode to AsyncStorage:", error);
    }
  };

  const setFocusMode = async (enabled: boolean) => {
    try {
      setFocusModeState(enabled);
      await AsyncStorage.setItem("@focus_mode", enabled ? "true" : "false");
    } catch (error) {
      console.error("Error saving focus mode to AsyncStorage:", error);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        timerMode,
        setTimerMode,
        focusMode,
        setFocusMode,
        isTimerRunning,
        setIsTimerRunning,
        seconds,
        setSeconds,
        blockNavigationModalVisible,
        setBlockNavigationModalVisible,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
