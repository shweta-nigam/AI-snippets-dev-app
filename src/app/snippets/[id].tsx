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

import { getSnippetById, deleteSnippet } from "@/services/snippet.service";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CustomModal } from "@/components/CustomModal";
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

export default function SnippetDetails() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();

  const [snippet, setSnippet] = useState<ISnippet | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteSuccessVisible, setDeleteSuccessVisible] = useState(false);

  async function loadSnippet() {
    const data = await getSnippetById(id as string);

    setSnippet(data as ISnippet);
  }

  useEffect(() => {
    loadSnippet();
  }, []);

  async function handleDelete() {
    if (snippet) {
      setDeleteConfirmVisible(false);
      await deleteSnippet(snippet.id);
      setDeleteSuccessVisible(true);
    }
  }

  if (!snippet) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading snippet...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={colors.statusBar} />
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{snippet.title}</Text>

          <Text style={[styles.language, { backgroundColor: colors.glow, color: colors.primary }]}>{snippet.language}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <Text style={[styles.tags, { color: colors.subText }]}>{snippet.tags}</Text>
        </View>

        {/* Code Block */}
        <View style={[styles.codeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SyntaxHighlighter
            language={snippet.language ? getLanguage(snippet.language) : "text"}
            style={atomOneDark}
            customStyle={{ backgroundColor: "transparent", padding: 0 }}
            PreTag={View}
            CodeTag={Text}
            fontSize={14}
            highlighter="hljs"
            fontFamily="monospace"
          >
            {snippet.code}
          </SyntaxHighlighter>
        </View>

        {/* Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
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

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.isDark ? "#26262F" : "#E5E7EB" }]}
            activeOpacity={0.85}
            onPress={() => setDeleteConfirmVisible(true)}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <CustomModal
        visible={deleteConfirmVisible}
        title="Delete Snippet"
        message="Are you sure you want to delete this snippet? This action cannot be undone."
        type="warning"
        showCancel={true}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirmVisible(false)}
      />

      {/* Delete Success Modal */}
      <CustomModal
        visible={deleteSuccessVisible}
        title="Snippet Deleted"
        message="Your snippet has been deleted successfully."
        type="success"
        confirmLabel="Awesome"
        onConfirm={() => {
          setDeleteSuccessVisible(false);
          router.replace("/(tabs)/snippets");
        }}
        onClose={() => {
          setDeleteSuccessVisible(false);
          router.replace("/(tabs)/snippets");
        }}
      />
    </>
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
