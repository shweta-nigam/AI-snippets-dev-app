import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import {
  Play,
  Pause,
  RotateCcw,
  Save,
  BookOpen,
  Terminal,
  Clock,
  Briefcase,
} from "lucide-react-native";
import { createSession, updateSession, getAllSessions, ISession } from "@/services/session.service";
import { CustomModal } from "@/components/CustomModal";

const MERLOT = "#6F1D3A";

export default function TimerScreen() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<"Coding" | "Study" | "Project">("Coding");
  const [projectTitle, setProjectTitle] = useState("");
  const [resumingSessionId, setResumingSessionId] = useState<number | null>(null);
  const [history, setHistory] = useState<ISession[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const intervalRef = useRef<any>(null);

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

  // Load history from DB
  async function loadHistory() {
    const data = await getAllSessions();
    setHistory(data);
    setVisibleCount(10);
  }

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      return () => {
        // Stop timer when leaving screen to prevent background battery drain
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
      };
    }, [])
  );

  // Timer interval control
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Start / Pause timer
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  // Reset timer
  const handleReset = () => {
    showModal(
      "Reset Timer",
      "Are you sure you want to reset the current timer? Your progress will be lost.",
      "warning",
      () => {
        setIsRunning(false);
        setSeconds(0);
        setResumingSessionId(null);
        setProjectTitle("");
      },
      true,
      "Reset"
    );
  };

  // Save session
  const handleSave = async () => {
    if (seconds < 5) {
      showModal(
        "Too Short",
        "Sessions must be at least 5 seconds long to be saved.",
        "warning"
      );
      return;
    }

    if (sessionType === "Project" && !projectTitle.trim()) {
      showModal(
        "Project Title Required",
        "Please enter a title for your project session.",
        "warning"
      );
      return;
    }

    try {
      if (resumingSessionId !== null) {
        await updateSession(resumingSessionId, seconds, projectTitle.trim());
        showModal("Success", `Project session for "${projectTitle}" updated!`, "success");
      } else {
        await createSession(
          sessionType,
          seconds,
          sessionType === "Project" ? projectTitle.trim() : undefined
        );
        showModal(
          "Success",
          sessionType === "Project"
            ? `Project session "${projectTitle}" saved!`
            : `${sessionType} session saved!`,
          "success"
        );
      }
      setIsRunning(false);
      setSeconds(0);
      setResumingSessionId(null);
      setProjectTitle("");
      loadHistory();
    } catch (error) {
      console.error(error);
      showModal("Error", "Failed to save session.", "error");
    }
  };

  const handleResumeSession = (item: ISession) => {
    if (item.type === "Project") {
      setIsRunning(false); // Stop any running timer first
      setSessionType("Project");
      setProjectTitle(item.title || "");
      setSeconds(item.duration);
      setResumingSessionId(item.id);
      setIsRunning(true); // Auto-start the timer!
      showModal(
        "Timer Resumed",
        `Resumed tracking for project: "${item.title}"`,
        "success"
      );
    } else {
      showModal(
        "Session Info",
        `${item.type} sessions cannot be resumed. Resuming is only available for Project tracking.`,
        "info"
      );
    }
  };

  // Helper formats
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (secs === 0) return `${mins}m`;
    return `${mins}m ${secs}s`;
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr.replace(" ", "T") + "Z"); // Standardize for cross-platform parsing
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Recently";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={history.slice(0, visibleCount)}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 130,
        }}
        onEndReached={() => {
          if (history.length > visibleCount) {
            setVisibleCount((prev) => prev + 10);
          }
        }}
        onEndReachedThreshold={0.15}
        ListHeaderComponent={
          <>
            {/* Hero Section */}
            <View style={styles.hero}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>FOCUS MODE</Text>
              </View>

              <Text style={styles.heading}>Time Tracker</Text>

              <Text style={styles.subHeading}>
                Track your study sessions or coding streaks to measure your productivity.
              </Text>
            </View>

            {/* Mode Selector */}
            <View style={styles.modeContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modeButton,
                  sessionType === "Coding" && styles.modeButtonActive,
                ]}
                onPress={() => {
                  if (!isRunning || seconds === 0) {
                    setSessionType("Coding");
                    setResumingSessionId(null);
                  }
                }}
              >
                <Terminal size={18} color={sessionType === "Coding" ? "#FFF" : "#8B8B95"} />
                <Text
                  style={[
                    styles.modeText,
                    sessionType === "Coding" && styles.modeTextActive,
                  ]}
                >
                  Coding
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modeButton,
                  sessionType === "Study" && styles.modeButtonActive,
                ]}
                onPress={() => {
                  if (!isRunning || seconds === 0) {
                    setSessionType("Study");
                    setResumingSessionId(null);
                  }
                }}
              >
                <BookOpen size={18} color={sessionType === "Study" ? "#FFF" : "#8B8B95"} />
                <Text
                  style={[
                    styles.modeText,
                    sessionType === "Study" && styles.modeTextActive,
                  ]}
                >
                  Study
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modeButton,
                  sessionType === "Project" && styles.modeButtonActive,
                ]}
                onPress={() => {
                  if (!isRunning || seconds === 0) {
                    setSessionType("Project");
                    setResumingSessionId(null);
                  }
                }}
              >
                <Briefcase size={18} color={sessionType === "Project" ? "#FFF" : "#8B8B95"} />
                <Text
                  style={[
                    styles.modeText,
                    sessionType === "Project" && styles.modeTextActive,
                  ]}
                >
                  Project
                </Text>
              </TouchableOpacity>
            </View>

            {/* Project Title Input (Only in Project mode) */}
            {sessionType === "Project" && (
              <View style={styles.projectInputContainer}>
                <TextInput
                  placeholder="Enter Project Name (e.g. Portfolio)"
                  placeholderTextColor="#8B8B95"
                  value={projectTitle}
                  onChangeText={setProjectTitle}
                  style={styles.projectInput}
                />
              </View>
            )}

            {/* Timer Circle */}
            <View
              style={[
                styles.timerCircle,
                isRunning && styles.timerCircleRunning,
              ]}
            >
              {sessionType === "Project" && resumingSessionId && (
                <Text style={styles.resumingText}>Resuming</Text>
              )}
              <Text style={styles.timerType} numberOfLines={1} ellipsizeMode="tail">
                {sessionType === "Project" && projectTitle ? projectTitle.toUpperCase() : sessionType.toUpperCase()}
              </Text>
              <Text style={styles.timerText}>{formatTime(seconds)}</Text>
              <Text style={styles.timerSubText}>
                {isRunning ? "Focusing..." : "Paused"}
              </Text>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              {/* Reset */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.controlButtonCircle}
                onPress={handleReset}
                disabled={seconds === 0}
              >
                <RotateCcw size={22} color={seconds === 0 ? "#444" : "#FFF"} />
              </TouchableOpacity>

              {/* Start/Pause */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.controlButtonCircleMain,
                  isRunning && styles.controlButtonCirclePause,
                ]}
                onPress={handleStartPause}
              >
                {isRunning ? (
                  <Pause size={28} color="#FFF" />
                ) : (
                  <Play size={28} color="#FFF" style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>

              {/* Save */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.controlButtonCircle}
                onPress={handleSave}
                disabled={seconds === 0}
              >
                <Save size={22} color={seconds === 0 ? "#444" : "#FFF"} />
              </TouchableOpacity>
            </View>

            {/* Recent Sessions List Header */}
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Focus History</Text>
              <Text style={styles.historyCount}>{history.length}</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Clock size={36} color="#444" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyText}>No focus sessions logged yet today.</Text>
          </View>
        }
        ListFooterComponent={
          history.length > visibleCount ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setVisibleCount((prev) => prev + 10)}
              activeOpacity={0.8}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleResumeSession(item)}
            style={styles.historyCard}
          >
            <View style={styles.historyCardLeft}>
              <View
                style={[
                  styles.historyIconContainer,
                  {
                    backgroundColor:
                      item.type === "Coding"
                        ? "rgba(111,29,58,0.15)"
                        : item.type === "Study"
                        ? "rgba(52,152,219,0.15)"
                        : "rgba(46,204,113,0.15)",
                  },
                ]}
              >
                {item.type === "Coding" ? (
                  <Terminal size={16} color="#D47A9A" />
                ) : item.type === "Study" ? (
                  <BookOpen size={16} color="#3498db" />
                ) : (
                  <Briefcase size={16} color="#2ecc71" />
                )}
              </View>
              <View>
                <Text style={styles.historyCardType}>
                  {item.type === "Project" && item.title ? item.title : `${item.type} Session`}
                </Text>
                <Text style={styles.historyCardTime}>{formatTimeAgo(item.createdAt)}</Text>
              </View>
            </View>
            <Text style={styles.historyCardDuration}>{formatDuration(item.duration)}</Text>
          </TouchableOpacity>
        )}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  hero: {
    marginBottom: 20,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(111,29,58,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 14,
  },

  badgeText: {
    color: "#F3D9E2",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  heading: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  subHeading: {
    fontSize: 14,
    lineHeight: 22,
    color: "#B9B9C2",
  },

  modeContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 25,
  },

  modeButton: {
    flex: 1,
    backgroundColor: "#15151C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  modeButtonActive: {
    backgroundColor: MERLOT,
    borderColor: "rgba(255,255,255,0.15)",
  },

  modeText: {
    color: "#8B8B95",
    fontSize: 14,
    fontWeight: "700",
  },

  modeTextActive: {
    color: "#FFF",
  },

  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "rgba(111,29,58,0.25)",
    backgroundColor: "#121218",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
    shadowColor: MERLOT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },

  timerCircleRunning: {
    borderColor: "#ff4d6d",
    shadowOpacity: 0.45,
    shadowRadius: 25,
  },

  timerType: {
    color: "#8B8B95",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  timerText: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "800",
    fontFamily: "monospace",
  },

  timerSubText: {
    color: "#D47A9A",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginBottom: 35,
  },

  controlButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1C1C24",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  controlButtonCircleMain: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: MERLOT,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: MERLOT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  controlButtonCirclePause: {
    backgroundColor: "#D47A9A",
    shadowColor: "#D47A9A",
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  historyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  historyCount: {
    color: "#CFA5B4",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(111,29,58,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyText: {
    color: "#5C5C66",
    fontSize: 13,
  },

  historyCard: {
    backgroundColor: "#14141C",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
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
    backgroundColor: "#14141C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  loadMoreText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  projectInputContainer: {
    marginBottom: 20,
    width: "100%",
  },

  projectInput: {
    backgroundColor: "#15151C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
  },

  resumingText: {
    color: "#2ecc71",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
