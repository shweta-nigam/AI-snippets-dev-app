import { createSnippet } from "@/services/snippet.service";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MERLOT = "#6F1D3A";

export default function CreateSnippet() {
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
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >
        <StatusBar barStyle="light-content" />

        <View style={styles.hero}>
          <Text style={styles.heading}>Create Snippet</Text>
        </View>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Snippet title"
            placeholderTextColor="#7B7B85"
            value={title}
            onChangeText={setTittle}
            style={styles.input}
          />

          <TextInput
            placeholder="Language"
            placeholderTextColor="#7B7B85"
            value={language}
            onChangeText={setLanguage}
            style={styles.input}
          />

          <TextInput
            placeholder="Tags"
            placeholderTextColor="#7B7B85"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
          />

          <TextInput
            placeholder="// Write your code here"
            placeholderTextColor="#7B7B85"
            multiline
            value={code}
            onChangeText={setCode}
            style={[styles.input, styles.codeInput]}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateSnippet}
          >
            <Text style={styles.buttonText}>Save Snippet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Premium Success Modal */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>
              Snippet Saved
            </Text>

            <Text style={styles.modalText}>
              Your snippet has been saved successfully.
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
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