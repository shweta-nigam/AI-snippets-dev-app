import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import React from "react";
import { Star, BarChart2, FileUp, FileDown } from "lucide-react-native";
import { importSnippetFromFile, exportSnippetsToFile } from "@/services/file.service";

export default function Index() {
  const handleImport = async () => {
    try {
      const res = await importSnippetFromFile();
      if (res.success) {
        Alert.alert("Import Successful", res.message);
      } else if (res.message !== "Import cancelled by user") {
        Alert.alert("Import Info", res.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred during file import.");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportSnippetsToFile();
      if (!res.success && res.message !== "No snippets found in database to export") {
        Alert.alert("Export Info", res.message);
      } else if (!res.success) {
        Alert.alert("Export Empty", res.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred during file export.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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

      {/* Quick Access */}
      <Text style={styles.sectionTitle}>Quick Access</Text>

      <View style={styles.gridContainer}>
        {/* Favorites Card */}
        <Link href="/favorite" asChild>
          <TouchableOpacity activeOpacity={0.85} style={styles.gridCard}>
            <View style={styles.cardGlow} />
            <View style={[styles.iconContainer, { backgroundColor: "rgba(255,215,0,0.12)" }]}>
              <Star color="#FFD700" size={22} fill="#FFD700" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Favorites</Text>
              <Text style={styles.cardText}>Access starred snippets</Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Analysis Card */}
        <Link href="/analysis" asChild>
          <TouchableOpacity activeOpacity={0.85} style={styles.gridCard}>
            <View style={styles.cardGlowBlue} />
            <View style={[styles.iconContainer, { backgroundColor: "rgba(52,152,219,0.12)" }]}>
              <BarChart2 color="#3498db" size={22} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Analysis</Text>
              <Text style={styles.cardText}>Track stats & focus time</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* File Utilities */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>File Manager</Text>

      <View style={styles.gridContainer}>
        {/* Import Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.gridCard}
          onPress={handleImport}
        >
          <View style={styles.cardGlowGreen} />
          <View style={[styles.iconContainer, { backgroundColor: "rgba(46,204,113,0.12)" }]}>
            <FileUp color="#2ecc71" size={22} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Import Code</Text>
            <Text style={styles.cardText}>Pick local code files</Text>
          </View>
        </TouchableOpacity>

        {/* Export Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.gridCard}
          onPress={handleExport}
        >
          <View style={styles.cardGlowOrange} />
          <View style={[styles.iconContainer, { backgroundColor: "rgba(230,126,34,0.12)" }]}>
            <FileDown color="#e67e22" size={22} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Export Code</Text>
            <Text style={styles.cardText}>Share snippets backup</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const MERLOT = "#6F1D3A";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 130,
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

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  gridContainer: {
    flexDirection: "row",
    gap: 16,
  },

  gridCard: {
    flex: 1,
    backgroundColor: "#15151C",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
    height: 160,
    justifyContent: "space-between",
  },

  cardGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: "rgba(255,215,0,0.05)",
    borderRadius: 999,
    top: -30,
    right: -30,
  },

  cardGlowBlue: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: "rgba(52,152,219,0.05)",
    borderRadius: 999,
    top: -30,
    right: -30,
  },

  cardGlowGreen: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: "rgba(46,204,113,0.05)",
    borderRadius: 999,
    top: -30,
    right: -30,
  },

  cardGlowOrange: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: "rgba(230,126,34,0.05)",
    borderRadius: 999,
    top: -30,
    right: -30,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardText: {
    color: "#8B8B95",
    fontSize: 12,
    lineHeight: 16,
  },
});