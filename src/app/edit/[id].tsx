import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";

import { getSnippetById, updateSnippet } from "@/services/snippet.service";

const MERLOT = "#6F1D3A";

export default function EditSnippet() {
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(true);

  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadSnippet() {
    try {
      const data = await getSnippetById(id as string);

      if (data) {
        setTitle(data.title);
        setCode(data.code);
        setLanguage(data.language);
        setTags(data.tags);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate() {
    if (!title || !code || !language) {
      setErrorMessage("Please fill all required fields.");
      setErrorModal(true);
      return;
    }

    try {
      await updateSnippet(id as string, title, code, language, tags);

      setSuccessModal(true);
    } catch (error) {
      console.error(error);

      setErrorMessage("Failed to update snippet.");
      setErrorModal(true);
    }
  }

  useEffect(() => {
    loadSnippet();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading snippet...</Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="light-content" />

          <Text style={styles.heading}>Edit Snippet</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Language</Text>

            <TextInput
              value={language}
              onChangeText={setLanguage}
              placeholder="JavaScript"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags</Text>

            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="react, api, hooks"
              placeholderTextColor="#888"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Code</Text>

            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Write your code..."
              placeholderTextColor="#888"
              multiline
              textAlignVertical="top"
              style={styles.codeInput}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={handleUpdate}
          >
            <Text style={styles.buttonText}>Update Snippet</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>Snippet Updated</Text>

            <Text style={styles.modalText}>
              Your snippet has been updated successfully.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModal(false);

                router.replace({
                  pathname: "/snippets/[id]",
                  params: {
                    id: id as string,
                  },
                });
              }}
            >
              <Text style={styles.modalButtonText}>Awesome</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={errorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FF4D4F20" }]}>
              <Text style={[styles.icon, { color: "#FF4D4F" }]}>✕</Text>
            </View>

            <Text style={styles.modalTitle}>Something Went Wrong</Text>

            <Text style={styles.modalText}>{errorMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setErrorModal(false)}
            >
              <Text style={styles.modalButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F0F11",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "white",
    fontSize: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 30,
    marginTop: 20,
  },

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    color: "#CFCFCF",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#1B1B1F",
    borderWidth: 1,
    borderColor: "#2A2A2F",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    fontSize: 15,
  },

  codeInput: {
    backgroundColor: "#151518",
    borderWidth: 1,
    borderColor: "#2A2A2F",
    borderRadius: 18,
    padding: 16,
    color: "#F5F5F5",
    fontSize: 14,
    minHeight: 260,
    fontFamily: "monospace",
  },

  button: {
    backgroundColor: MERLOT,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#16161A",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2F",
  },

  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: `${MERLOT}25`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  icon: {
    fontSize: 34,
    color: MERLOT,
    fontWeight: "700",
  },

  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  modalText: {
    color: "#B8B8C0",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  modalButton: {
    backgroundColor: MERLOT,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  modalButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});