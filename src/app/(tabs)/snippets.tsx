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
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "@/context/ThemeContext";

const MERLOT = "#6F1D3A";

const getLanguage = (lang: string) => {
  if (!lang) return "text";
  const l = lang.toLowerCase().trim();
  if (l === "c++" || l === "cpp") return "cpp";
  if (l === "c#" || l === "csharp") return "csharp";
  if (l === "js" || l === "javascript") return "javascript";
  if (l === "ts" || l === "typescript") return "typescript";
  if (l === "py" || l === "python") return "python";
  if (l === "html") return "html";
  if (l === "css") return "css";
  if (l === "json") return "json";
  if (l === "sql") return "sql";
  if (l === "bash" || l === "sh") return "bash";
  return l;
};

export default function SnippetsScreen() {
  const { colors } = useTheme();
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [filterSnippets, setFilterSnippets] = useState<ISnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  async function loadSnippets() {
    const data = await getAllSnippets();
    setSnippets(data as ISnippet[]);
    setFilterSnippets(data as ISnippet[]);
  }

  function handleSearch(text: string) {
    setSearchQuery(text);
    setVisibleCount(20); // Reset pagination on search

    if (!text.trim()) {
      setFilterSnippets(snippets);
      return;
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

  const getPreviewCode = (codeStr: string) => {
    if (!codeStr) return "";
    const lines = codeStr.split("\n");
    const previewLines = lines.slice(0, 5); // Take first 5 lines
    let preview = previewLines.join("\n");
    if (lines.length > 5) {
      preview += "\n...";
    }
    return preview;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text }]}>All Snippets</Text>
        <Text style={[styles.subHeading, { color: colors.subText }]}>Browse your saved code collection</Text>
      </View>

      <TextInput
        placeholder="Search snippets..."
        placeholderTextColor={colors.isDark ? "#7B7B85" : "#6B7280"}
        value={searchQuery}
        onChangeText={handleSearch}
        style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
      />

      {/* List */}
      <FlatList
        data={filterSnippets.slice(0, visibleCount)}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No snippets found</Text>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              Start saving snippets to build your library.
            </Text>
            <TouchableOpacity
              style={[styles.emptyCreateButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
              activeOpacity={0.85}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.emptyCreateButtonText}>+ Create Snippet</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          filterSnippets.length > visibleCount ? (
            <TouchableOpacity
              style={[styles.loadMoreButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setVisibleCount((prev) => prev + 20)}
              activeOpacity={0.8}
            >
              <Text style={[styles.loadMoreText, { color: colors.text }]}>Load More</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Favorite Button */}
            <TouchableOpacity
              style={[styles.favoriteButton, { backgroundColor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }]}
              onPress={async () => {
                await toggleFavorite(item.id, item.isFavorite ? 0 : 1);
                loadSnippets();
              }}
            >
              <Heart
                size={20}
                color={item.isFavorite ? "#ff4d6d" : colors.subText}
                fill={item.isFavorite ? "#ff4d6d" : "transparent"}
              />
            </TouchableOpacity>

            {/* Card Content */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/snippets/${item.id}`)}
            >
              <View style={[styles.glow, { backgroundColor: colors.glow }]} />

              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>

              {/* Code Preview */}
              <View style={[styles.codePreviewCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <SyntaxHighlighter
                  language={item.language ? getLanguage(item.language) : "text"}
                  style={atomOneDark}
                  customStyle={{ backgroundColor: "transparent", padding: 0 }}
                  PreTag={View}
                  CodeTag={Text}
                  fontSize={11}
                  highlighter="hljs"
                  fontFamily="monospace"
                >
                  {getPreviewCode(item.code)}
                </SyntaxHighlighter>
              </View>

              <View style={styles.metaRow}>
                <View style={[styles.languageBadge, { backgroundColor: colors.glow }]}>
                  <Text style={[styles.languageText, { color: colors.primary }]}>{item.language}</Text>
                </View>

                <Text style={[styles.tagText, { color: colors.subText }]}>{item.tags}</Text>
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
    marginBottom: 10,
    paddingRight: 35, // Prevent text overlapping the favorite button
  },

  codePreviewCard: {
    backgroundColor: "#0B0B0F",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },

  codePreviewText: {
    color: "#C5C5CE",
    fontFamily: "monospace",
    fontSize: 11,
    lineHeight: 16,
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

  emptyCreateButton: {
    backgroundColor: MERLOT,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: MERLOT,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },

  emptyCreateButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  loadMoreButton: {
    backgroundColor: "#15151C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 40,
  },

  loadMoreText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
