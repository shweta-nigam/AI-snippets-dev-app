import React, { useState } from "react";
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

import { explainCode } from "@/services/ai.service";

const MERLOT = "#6F1D3A";

const AiScreen = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);

      const result = await explainCode(code);

      setResponse(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroCard}>
            <Text style={styles.heading}>AI Code Explainer</Text>

            <Text style={styles.subHeading}>
              Paste your code and get simple explanations instantly.
            </Text>
          </View>

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

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleExplain}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Explain Code</Text>
            )}
          </TouchableOpacity>

          {response ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>AI Explanation</Text>

              <Text style={styles.resultText}>{response}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
    paddingBottom: 80,
  },

  heroCard: {
    backgroundColor: "#121218",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 24,
    borderRadius: 28,
    marginTop: 10,
    marginBottom: 25,

    shadowColor: MERLOT,
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
    minHeight: 260,
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
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.45,
    shadowRadius: 12,

    elevation: 8,
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
