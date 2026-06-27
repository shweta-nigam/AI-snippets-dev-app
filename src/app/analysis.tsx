import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import {
  ChevronLeft,
  Terminal,
  BookOpen,
  Layers,
  BarChart2,
  Calendar,
  Briefcase,
  X,
} from "lucide-react-native";
import { getSessionStats, getSnippetLanguageStats, ISession, deleteSession, clearAllSessions } from "@/services/session.service";
import { getAllSnippets } from "@/services/snippet.service";
import { useTheme } from "@/context/ThemeContext";
import { CustomModal } from "@/components/CustomModal";

const MERLOT = "#6F1D3A";

export default function AnalysisScreen() {
  const { colors } = useTheme();
  const [totalSnippets, setTotalSnippets] = useState<number>(0);
  const [totalCodingTime, setTotalCodingTime] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [totalProjectTime, setTotalProjectTime] = useState<number>(0);
  const [languages, setLanguages] = useState<{ language: string; count: number }[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [modalShowCancel, setModalShowCancel] = useState(false);
  const [modalConfirmLabel, setModalConfirmLabel] = useState("Got It");

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    onConfirm?: () => void,
    showCancel = false,
    confirmLabel = "Got It"
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOnConfirm(() => onConfirm);
    setModalShowCancel(showCancel);
    setModalConfirmLabel(confirmLabel);
    setModalVisible(true);
  };

  async function loadStats() {
    // Load snippets count
    const snippets = await getAllSnippets();
    setTotalSnippets(snippets.length);

    // Load language stats
    const langStats = await getSnippetLanguageStats();
    setLanguages(langStats);

    // Load session stats
    const stats = await getSessionStats();
    setTotalCodingTime(stats.totalCoding);
    setTotalStudyTime(stats.totalStudy);
    setTotalProjectTime(stats.totalProject || 0);
    setSessions(stats.sessions);
    setVisibleCount(20);
  }

  const handleDeleteSession = (item: ISession) => {
    showModal(
      "Delete Session?",
      `Are you sure you want to delete this ${item.type} session?`,
      "warning",
      async () => {
        const success = await deleteSession(item.id);
        if (success) {
          loadStats();
        }
      },
      true,
      "Delete"
    );
  };

  const handleClearHistory = () => {
    showModal(
      "Clear History?",
      "Are you sure you want to clear all focus sessions? This action cannot be undone.",
      "warning",
      async () => {
        const success = await clearAllSessions();
        if (success) {
          loadStats();
        }
      },
      true,
      "Clear All"
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  // Formatter helpers
  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds === 0) return "0s";
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const formatDurationLong = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr.replace(" ", "T") + "Z");
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " at " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  };

  // Calculate languages percentage
  const totalLanguageSnippets = languages.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <StatusBar barStyle={colors.statusBar} />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderColor: colors.border }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.badge, { backgroundColor: colors.glow, borderColor: colors.border }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>ANALYTICS</Text>
          </View>
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>Performance</Text>

        <Text style={[styles.subHeading, { color: colors.subText }]}>
          Gain valuable insights on your code repository and timed learning sessions.
        </Text>
      </View>

      {/* Metric Cards Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: colors.glow }]}>
            <Terminal size={20} color={colors.primary} />
          </View>
          <Text style={[styles.statLabel, { color: colors.subText }]}>Coding Time</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(totalCodingTime)}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: "rgba(52,152,219,0.15)" }]}>
            <BookOpen size={20} color="#3498db" />
          </View>
          <Text style={[styles.statLabel, { color: colors.subText }]}>Study Time</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(totalStudyTime)}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: "rgba(46,204,113,0.15)" }]}>
            <Briefcase size={20} color="#2ecc71" />
          </View>
          <Text style={[styles.statLabel, { color: colors.subText }]}>Project Time</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{formatDuration(totalProjectTime)}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.statIconContainer, { backgroundColor: "rgba(155,89,182,0.15)" }]}>
            <Layers size={20} color="#9b59b6" />
          </View>
          <Text style={[styles.statLabel, { color: colors.subText }]}>Snippets</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{totalSnippets}</Text>
        </View>
      </View>

      {/* Language Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BarChart2 size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Language Breakdown</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {languages.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.subText }]}>No snippets saved yet. Add snippets to see language breakdown.</Text>
          ) : (
            languages.map((item, index) => {
              const pct = totalLanguageSnippets > 0 ? (item.count / totalLanguageSnippets) * 100 : 0;
              return (
                <View key={index} style={styles.langRow}>
                  <View style={styles.langHeader}>
                    <Text style={[styles.langName, { color: colors.text }]}>{item.language}</Text>
                    <Text style={[styles.langCount, { color: colors.subText }]}>
                      {item.count} {item.count === 1 ? "snippet" : "snippets"} ({pct.toFixed(0)}%)
                    </Text>
                  </View>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.isDark ? "#1C1C24" : "#E5E7EB" }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${pct}%`,
                          backgroundColor:
                            index === 0
                              ? colors.primary
                              : index === 1
                              ? "#3498db"
                              : index === 2
                              ? "#2ecc71"
                              : "#f1c40f",
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Focus History Logs */}
      <View style={styles.section}>
        <View style={styles.historyHeaderRow}>
          <View style={styles.sectionHeader}>
            <Calendar size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Session History</Text>
          </View>
          {sessions.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearHistory}
              style={styles.clearHistoryBtn}
            >
              <Text style={[styles.clearHistoryText, { color: colors.primary }]}>Clear History</Text>
            </TouchableOpacity>
          )}
        </View>

        {sessions.length === 0 ? (
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.subText }]}>No focus sessions logged yet. Head to the Timer tab to start tracking!</Text>
          </View>
        ) : (
          <>
            {sessions.slice(0, visibleCount).map((item) => (
              <View key={item.id} style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border, padding: 0 }]}>
                <View style={styles.historyCardMain}>
                  <View style={styles.historyCardLeft}>
                    <View
                      style={[
                        styles.historyIconContainer,
                        {
                          backgroundColor:
                            item.type === "Coding"
                              ? colors.glow
                              : item.type === "Study"
                              ? "rgba(52,152,219,0.15)"
                              : "rgba(46,204,113,0.15)",
                        },
                      ]}
                    >
                      {item.type === "Coding" ? (
                        <Terminal size={14} color={colors.primary} />
                      ) : item.type === "Study" ? (
                        <BookOpen size={14} color="#3498db" />
                      ) : (
                        <Briefcase size={14} color="#2ecc71" />
                      )}
                    </View>
                    <View style={{ flexShrink: 1 }}>
                      <Text style={[styles.historyCardType, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
                        {item.type === "Project" && item.title ? item.title : `${item.type} Session`}
                      </Text>
                      <Text style={[styles.historyCardTime, { color: colors.subText }]}>{formatTimeAgo(item.createdAt)}</Text>
                    </View>
                  </View>
                  <Text style={[styles.historyCardDuration, { color: colors.text, marginLeft: 8 }]}>{formatDurationLong(item.duration)}</Text>
                </View>
                
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDeleteSession(item)}
                  style={styles.deleteLogBtn}
                >
                  <X size={16} color={colors.subText} />
                </TouchableOpacity>
              </View>
            ))}

            {sessions.length > visibleCount && (
              <TouchableOpacity
                style={[styles.loadMoreButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setVisibleCount((prev) => prev + 20)}
                activeOpacity={0.8}
              >
                <Text style={[styles.loadMoreText, { color: colors.text }]}>Load More</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>

      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        confirmLabel={modalConfirmLabel}
        showCancel={modalShowCancel}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          if (modalOnConfirm) modalOnConfirm();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },

  hero: {
    marginBottom: 30,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(111,29,58,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
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

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 30,
  },

  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#15151C",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "flex-start",
  },

  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  statLabel: {
    color: "#8B8B95",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  section: {
    marginBottom: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  sectionCard: {
    backgroundColor: "#15151C",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  emptyText: {
    color: "#6B6B76",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  langRow: {
    marginBottom: 16,
  },

  langHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  langName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  langCount: {
    color: "#8B8B95",
    fontSize: 12,
  },

  progressBarBg: {
    height: 8,
    backgroundColor: "#1C1C24",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  historyCard: {
    backgroundColor: "#14141C",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
  },

  historyCardMain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingLeft: 14,
  },

  deleteLogBtn: {
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  historyHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  clearHistoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  clearHistoryText: {
    fontSize: 13,
    fontWeight: "700",
  },

  historyCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  historyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  historyCardType: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  historyCardTime: {
    color: "#6B6B76",
    fontSize: 11,
    marginTop: 2,
  },

  historyCardDuration: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  loadMoreButton: {
    backgroundColor: "#15151C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  loadMoreText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
