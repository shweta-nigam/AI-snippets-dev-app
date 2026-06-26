import { createSnippet } from "@/services/snippet.service";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

const MERLOT = "#6F1D3A";

export default function CreateSnippet() {
  const { colors } = useTheme();
  const [title, setTittle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");

  const [successModal, setSuccessModal] = useState(false);

  async function handleCreateSnippet() {
    try {
      await createSnippet(title, code, language, tags);

      setSuccessModal(true);

      setTittle("");
      setCode("");
      setLanguage("");
      setTags("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <KeyboardAvoidingView
  style={styles.container}
   behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={80}
>
        <StatusBar barStyle={colors.statusBar} />

        <View style={styles.hero}>
          <Text style={[styles.heading, { color: colors.text }]}>Create Snippet</Text>
        </View>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Snippet title"
            placeholderTextColor={colors.isDark ? "#7B7B85" : "#6B7280"}
            value={title}
            onChangeText={setTittle}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          />

          <TextInput
            placeholder="Language"
            placeholderTextColor={colors.isDark ? "#7B7B85" : "#6B7280"}
            value={language}
            onChangeText={setLanguage}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          />

          <TextInput
            placeholder="Tags"
            placeholderTextColor={colors.isDark ? "#7B7B85" : "#6B7280"}
            value={tags}
            onChangeText={setTags}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          />

          <TextInput
            placeholder="// Write your code here"
            placeholderTextColor={colors.isDark ? "#7B7B85" : "#6B7280"}
            multiline
            value={code}
            onChangeText={setCode}
            style={[styles.input, styles.codeInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleCreateSnippet}
          >
            <Text style={styles.buttonText}>Save Snippet</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Premium Success Modal */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.glow }]}>
              <Text style={[styles.icon, { color: colors.primary }]}>✓</Text>
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Snippet Saved
            </Text>

            <Text style={[styles.modalText, { color: colors.subText }]}>
              Your snippet has been saved successfully.
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>
                Awesome
              </Text>
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
    backgroundColor: "#0b0b0fad",
  },

  hero: {
    padding: 20,
    marginTop: 40,
  },

  heading: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },

  formCard: {
    padding: 20,
  },

  input: {
    backgroundColor: "#121218",
    color: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  codeInput: {
    minHeight: 220,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: MERLOT,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#121218",
    borderRadius: 30,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: MERLOT,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  icon: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "bold",
  },

  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  modalText: {
    color: "#A1A1AA",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },

  modalButton: {
    backgroundColor: MERLOT,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});