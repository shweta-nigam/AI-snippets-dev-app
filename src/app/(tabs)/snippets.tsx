import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { Heart } from "lucide-react-native";

import { getAllSnippets, toggleFavorite } from "@/services/snippet.service";
import { ISnippet } from "@/types/snippet";

const MERLOT = "#6F1D3A";

export default function SnippetsScreen() {
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [filterSnippets, setFilterSnippets] = useState<ISnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadSnippets() {
    const data = await getAllSnippets();

    setSnippets(data as ISnippet[]);
    setFilterSnippets(data as ISnippet[]);
  }

  function handleSearch(text: string) {
    setSearchQuery(text);

    if (!text.trim()) {
      setFilterSnippets(snippets);
    }

    const filtered = snippets.filter((snippet) => {
      return (
        snippet.title.toLowerCase().includes(text.toLowerCase()) ||
        snippet.language.toLowerCase().includes(text.toLowerCase()) ||
        snippet.tags.toLowerCase().includes(text.toLowerCase())
      );
    });

    setFilterSnippets(filtered);
  }

useFocusEffect(
  useCallback(() => {
    loadSnippets();
  }, [])
);
// note: Without useCallback, a NEW function gets created on every render. which is bad. so we use useCallback and It MEMORIZES the function.

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>All Snippets</Text>

        <Text style={styles.subHeading}>Browse your saved code collection</Text>
      </View>

      <TextInput
        placeholder="Search snippets..."
        placeholderTextColor="#7B7B85"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {/* List */}
      <FlatList
        data={filterSnippets}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No snippets found</Text>

            <Text style={styles.emptyText}>
              Start saving snippets to build your library.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Favorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={async () => {
                await toggleFavorite(item.id, item.isFavorite ? 0 : 1);

                loadSnippets();
              }}
            >
              <Heart
                size={20}
                color={item.isFavorite ? "#ff4d6d" : "#9CA3AF"}
                fill={item.isFavorite ? "#ff4d6d" : "transparent"}
              />
            </TouchableOpacity>

            {/* Card Content */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/snippets/${item.id}`)}
            >
              <View style={styles.glow} />

              <Text style={styles.cardTitle}>{item.title}</Text>

              <View style={styles.metaRow}>
                <View style={styles.languageBadge}>
                  <Text style={styles.languageText}>{item.language}</Text>
                </View>

                <Text style={styles.tagText}>{item.tags}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    marginBottom: 28,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 20,

    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 8,
    borderRadius: 999,
  },

  heading: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 10,
  },

  subHeading: {
    color: "#A0A0AA",
    fontSize: 15,
    lineHeight: 24,
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

  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    backgroundColor: "rgba(111,29,58,0.18)",
    borderRadius: 999,
    top: -50,
    right: -40,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  searchInput: {
    backgroundColor: "#15151C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  languageBadge: {
    backgroundColor: "rgba(111,29,58,0.20)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  languageText: {
    color: "#F2D7E0",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  tagText: {
    color: "#8D8D96",
    fontSize: 13,
    flex: 1,
    textAlign: "right",
    marginLeft: 10,
  },

  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  emptyText: {
    color: "#8D8D96",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
