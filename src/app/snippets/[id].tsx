import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";

import { ISnippet } from "@/types/snippet";

import { getSnippetById } from "@/services/snippet.service";

const MERLOT = "#6F1D3A";

export default function SnippetDetails() {
  const { id } = useLocalSearchParams();

  const [snippet, setSnippet] = useState<ISnippet | null>(null);

  async function loadSnippet() {
    const data = await getSnippetById(id as string);

    setSnippet(data as ISnippet);
  }

  useEffect(() => {
    loadSnippet();
  }, []);

  if (!snippet) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading snippet...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{snippet.title}</Text>

        <Text style={styles.language}>{snippet.language}</Text>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <Text style={styles.tags}>{snippet.tags}</Text>
      </View>

      {/* Code Block */}
      <View style={styles.codeCard}>
        <Text style={styles.code}>{snippet.code}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/edit/[id]",
              params: {
                id: snippet.id.toString(),
              },
            })
          }
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: "#0b0b0fad",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0B0F",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 14,
    letterSpacing: -1,
  },

  language: {
    alignSelf: "flex-start",

    backgroundColor: "rgba(111,29,58,0.18)",

    color: "#F3D9E2",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 999,

    overflow: "hidden",

    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  tagsContainer: {
    marginBottom: 24,
  },

  tags: {
    color: "#9C9CA6",
    fontSize: 14,
    lineHeight: 22,
  },

  codeCard: {
    backgroundColor: "#15151C",
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  code: {
    color: "#EAEAEA",
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "monospace",
  },

  actions: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 200,
  },

  editButton: {
    flex: 1,
    backgroundColor: MERLOT,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#26262F",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
