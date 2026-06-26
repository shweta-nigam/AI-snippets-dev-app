import React from "react";
import { View } from "react-native";

import { Tabs } from "expo-router";

import {
  House,
  Code2,
  Plus,
  Sparkles,
  Star,
  Clock,
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: colors.isDark ? "#FFFFFF" : colors.primary,

        tabBarInactiveTintColor: colors.subText,

        tabBarStyle: {
          position: "absolute",

          bottom: 32,
          left: 18,
          right: 18,

          height: 78,

          backgroundColor: colors.isDark ? "rgba(20,20,28,0.96)" : "rgba(255,255,255,0.96)",

          borderRadius: 28,

          borderTopWidth: 0,

          borderWidth: 1,
          borderColor: colors.border,

          paddingTop: 10,
          paddingBottom: 12,

          elevation: 0,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 14,
          },
          shadowOpacity: colors.isDark ? 0.45 : 0.1,
          shadowRadius: 28,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
          letterSpacing: 0.3,
        },

        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 5,
          marginVertical: 6,
        },

      
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? (colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                  : "transparent",

                padding: 8,

                borderRadius: 999,
              }}
            >
              <House
                color={color}
                size={focused ? 24 : 20}
                strokeWidth={2.4}
              />
            </View>
          ),
        }}
      />

      {/* SNIPPETS */}
      <Tabs.Screen
        name="snippets"
        options={{
          title: "Snippets",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? (colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                  : "transparent",

                padding: 8,

                borderRadius: 999,
              }}
            >
              <Code2
                color={color}
                size={focused ? 24 : 20}
                strokeWidth={2.4}
              />
            </View>
          ),
        }}
      />

      {/* CREATE */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: focused ? 52 : 46,
                height: focused ? 52 : 46,

                backgroundColor: colors.primary,

                borderRadius: 999,

                justifyContent: "center",
                alignItems: "center",

                marginTop: -24,

                shadowColor: colors.primary,
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.5,
                shadowRadius: 16,

                elevation: 10,

                borderWidth: 2,
                borderColor: colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              }}
            >
              <Plus
                color="#fff"
                size={focused ? 26 : 22}
                strokeWidth={2.8}
              />
            </View>
          ),
        }}
      />

      {/* TIMER */}
      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? (colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                  : "transparent",

                padding: 8,

                borderRadius: 999,
              }}
            >
              <Clock
                color={color}
                size={focused ? 24 : 20}
                strokeWidth={2.4}
              />
            </View>
          ),
        }}
      />

      {/* AI */}
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused
                  ? (colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                  : "transparent",

                padding: 8,

                borderRadius: 999,
              }}
            >
              <Sparkles
                color={color}
                size={focused ? 24 : 20}
                strokeWidth={2.4}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}