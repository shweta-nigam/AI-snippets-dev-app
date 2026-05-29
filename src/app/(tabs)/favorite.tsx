import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import {
  getFavoriteSnippets,
  toggleFavorite,
} from "@/services/snippet.service";

import { Heart, Code2 } from "lucide-react-native";

import { ISnippet } from "@/types/snippet";

const MERLOT = "#6F1D3A";

export default function FavoriteScreen() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);

  async function loadFavorites() {
    const data = await getFavoriteSnippets();

    setSnippets(data as ISnippet[]);
  }

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FAVORITES</Text>
        </View>

        <Text style={styles.heading}>Favorite Snippets</Text>

        <Text style={styles.subHeading}>
          Quickly access your most loved and reusable code snippets.
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={snippets}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 140,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Heart size={40} color="#777" />
            </View>

            <Text style={styles.emptyTitle}>
              No Favorites Yet
            </Text>

            <Text style={styles.emptyText}>
              Add snippets to favorites to access them faster.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.card}
            onPress={() =>
              router.push(`/snippets/${item.id}`)
            }
          >
            <View style={styles.glow} />

            {/* Top Row */}
            <View style={styles.topRow}>
              <View style={styles.languageBadge}>
                <Code2 size={14} color="#fff" />

                <Text style={styles.languageText}>
                  {item.language}
                </Text>
              </View>

              {/* Favorite Toggle */}
              <Pressable
                style={styles.favoriteButton}
                onPress={async () => {
                  await toggleFavorite(item.id, 0);

                  loadFavorites();
                }}
              >
                <Heart
                  size={20}
                  color="#ff4d6d"
                  fill="#ff4d6d"
                />
              </Pressable>
            </View>

            {/* Title */}
            <Text style={styles.cardTitle}>
              {item.title}
            </Text>

            {/* Tags */}
            <Text style={styles.tags}>
              {item.tags}
            </Text>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.dot} />

              <Text style={styles.footerText}>
                Favorite Snippet
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
  },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(111,29,58,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  heading: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 12,
  },

  subHeading: {
    color: "#A1A1AA",
    fontSize: 15,
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#15151C",
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  glow: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(111,29,58,0.18)",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  languageBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MERLOT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },

  languageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  favoriteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  tags: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4d6d",
    marginRight: 8,
  },

  footerText: {
    color: "#B0B0BA",
    fontSize: 13,
    fontWeight: "500",
  },

  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1A1A22",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptyText: {
    color: "#8E8E98",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 30,
  },
});