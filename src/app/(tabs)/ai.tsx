import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { explainCode, saveApiKey, getApiKey } from "@/services/ai.service";
import { Key, Eye, EyeOff, Save, Sparkles, AlertTriangle } from "lucide-react-native";
import { CustomModal } from "@/components/CustomModal";

const MERLOT = "#6F1D3A";

const AiScreen = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // API Key States
  const [apiKey, setApiKey] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    onConfirm?: () => void
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  // Load API Key from SQLite
  async function loadApiKey() {
    const key = await getApiKey();
    setApiKey(key);
    setIsConfigured(!!key);
  }

  useFocusEffect(
    useCallback(() => {
      loadApiKey();
    }, [])
  );

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      showModal("Required", "Please enter a valid API key.", "warning");
      return;
    }
    await saveApiKey(apiKey.trim());
    setIsConfigured(true);
    setShowConfig(false);
    showModal("Success", "Gemini API Key saved successfully.", "success");
  };

  const handleExplain = async () => {
    if (!apiKey.trim()) {
      showModal(
        "API Key Required",
        "Please provide your Gemini API key at the top configuration panel to get explanations.",
        "warning",
        () => setShowConfig(true)
      );
      return;
    }

    if (!code.trim()) {
      showModal("Empty Code", "Please enter some code to explain.", "warning");
      return;
    }

    try {
      setLoading(true);
      setResponse("");
      const result = await explainCode(code, apiKey.trim());
      setResponse(result);
    } catch (error) {
      console.log(error);
      setResponse("An unexpected error occurred while contacting the Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heading}>AI Code Explainer</Text>
          <Text style={styles.subHeading}>
            Paste your code and get simple explanations instantly using your own Gemini Key.
          </Text>
        </View>

        {/* API Key Panel */}
        <View style={styles.configCard}>
          <TouchableOpacity
            style={styles.configHeader}
            onPress={() => setShowConfig(!showConfig)}
            activeOpacity={0.7}
          >
            <View style={styles.configHeaderLeft}>
              <Key size={18} color={isConfigured ? "#2ecc71" : "#e67e22"} />
              <Text style={styles.configTitle}>Gemini API Key Settings</Text>
            </View>
            <Text style={[styles.statusBadge, isConfigured ? styles.statusActive : styles.statusInactive]}>
              {isConfigured ? "Active" : "Key Required"}
            </Text>
          </TouchableOpacity>

          {(showConfig || !isConfigured) && (
            <View style={styles.configBody}>
              <Text style={styles.configInstructions}>
                To generate explanations, create a free API Key on the Google AI Studio page and enter it below:
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Paste your API key here (AIzaSy...)"
                  placeholderTextColor="#7d7d88"
                  value={apiKey}
                  onChangeText={(text) => {
                    setApiKey(text);
                    if (text === "") setIsConfigured(false);
                  }}
                  secureTextEntry={!isKeyVisible}
                  style={styles.keyInput}
                />
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setIsKeyVisible(!isKeyVisible)}
                  activeOpacity={0.7}
                >
                  {isKeyVisible ? <EyeOff size={18} color="#FFF" /> : <Eye size={18} color="#FFF" />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveKey}
                activeOpacity={0.8}
              >
                <Save size={16} color="#FFF" />
                <Text style={styles.saveBtnText}>Save API Key</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Warning Banner if not configured */}
        {!isConfigured && (
          <View style={styles.warningBanner}>
            <AlertTriangle size={18} color="#e67e22" />
            <Text style={styles.warningText}>
              Please configure your API key above to enable AI features.
            </Text>
          </View>
        )}

        {/* Code Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Paste Your Code</Text>
          <TextInput
            placeholder="Write or paste your code here..."
            placeholderTextColor="#7d7d88"
            multiline
            value={code}
            onChangeText={setCode}
            style={styles.input}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.button, !isConfigured && styles.buttonDisabled]}
          activeOpacity={0.8}
          onPress={handleExplain}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Sparkles size={18} color="#fff" />
              <Text style={styles.buttonText}>Explain Code</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Result Area */}
        {response ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>AI Explanation</Text>
            <Text style={styles.resultText}>{response}</Text>
          </View>
        ) : null}
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          if (modalOnConfirm) modalOnConfirm();
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default AiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0fad",
    paddingTop: 50,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  heroCard: {
    backgroundColor: "#121218",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 24,
    borderRadius: 28,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: MERLOT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  subHeading: {
    color: "#a1a1aa",
    fontSize: 15,
    lineHeight: 24,
  },

  configCard: {
    backgroundColor: "#14141C",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 16,
    marginBottom: 20,
  },

  configHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  configHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  configTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  statusBadge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
  },

  statusActive: {
    backgroundColor: "rgba(46,204,113,0.15)",
    color: "#2ecc71",
  },

  statusInactive: {
    backgroundColor: "rgba(230,126,34,0.15)",
    color: "#e67e22",
  },

  configBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingTop: 14,
  },

  configInstructions: {
    color: "#8B8B95",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B0B0F",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  keyInput: {
    flex: 1,
    height: 48,
    color: "#FFF",
    fontSize: 14,
  },

  iconBtn: {
    padding: 8,
  },

  saveBtn: {
    backgroundColor: MERLOT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 14,
    shadowColor: MERLOT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  saveBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },

  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(230,126,34,0.1)",
    borderWidth: 1,
    borderColor: "rgba(230,126,34,0.15)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },

  warningText: {
    color: "#e67e22",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    color: "#d4d4d8",
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "600",
  },

  input: {
    minHeight: 220,
    backgroundColor: "#121218",
    borderRadius: 24,
    padding: 18,
    color: "#fff",
    fontSize: 15,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    lineHeight: 24,
  },

  button: {
    backgroundColor: MERLOT,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    shadowColor: MERLOT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  resultCard: {
    backgroundColor: "#121218",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  resultTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  resultText: {
    color: "#d4d4d8",
    fontSize: 15,
    lineHeight: 28,
  },
});
