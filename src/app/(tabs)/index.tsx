import { getAllSnippets } from "@/services/snippet.service";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { ISnippet } from "@/types/snippet";
import { Link, useFocusEffect } from "expo-router";
import React from "react";

export default function Index() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);

  async function loadSnippets() {
    const data = await getAllSnippets();
    setSnippets(data as ISnippet[]);
  }

useFocusEffect(
  React.useCallback(() => {
    loadSnippets();
  }, [])
);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AI Powered</Text>
        </View>

        <Text style={styles.heading}>Dev Snippets AI</Text>

        <Text style={styles.subHeading}>
          Save, organize, and access your favorite code snippets with a modern
          developer experience.
        </Text>

        <Link href="/create" asChild>
          <TouchableOpacity activeOpacity={0.85} style={styles.createButton}>
            <Text style={styles.createButtonText}>+ Create Snippet</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Snippets</Text>
        <Text style={styles.sectionCount}>{snippets.length}</Text>
      </View>

      {/* Snippets List */}
      <FlatList
        data={snippets}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No snippets yet</Text>
            <Text style={styles.emptyText}>
              Start building your personal snippet collection.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardGlow} />

            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.dot} />
              <Text style={styles.cardFooterText}>Saved Snippet</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const MERLOT = "#6F1D3A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom:100
  },

  hero: {
    marginBottom: 35,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(111,29,58,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },

  badgeText: {
    color: "#F3D9E2",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  heading: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 14,
  },

  subHeading: {
    fontSize: 15,
    lineHeight: 24,
    color: "#B9B9C2",
    marginBottom: 28,
  },

  createButton: {
    backgroundColor: MERLOT,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",

    shadowColor: MERLOT,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  sectionCount: {
    color: "#CFA5B4",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "rgba(111,29,58,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  card: {
    backgroundColor: "#15151C",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  cardGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    backgroundColor: "rgba(111,29,58,0.18)",
    borderRadius: 999,
    top: -40,
    right: -40,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#D47A9A",
    marginRight: 8,
  },

  cardFooterText: {
    color: "#9C9CA6",
    fontSize: 13,
    fontWeight: "500",
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptyText: {
    color: "#8B8B95",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});