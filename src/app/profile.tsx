import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { ChevronLeft, User, Briefcase, Shuffle, Save } from "lucide-react-native";
import { getUserProfile, updateUserProfile } from "@/services/profile.service";

const MERLOT = "#6F1D3A";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/adventurer/png?seed=initial");

  async function loadProfile() {
    const profile = await getUserProfile();
    if (profile) {
      setName(profile.name);
      setRole(profile.role);
      setAvatarUrl(profile.avatarUrl);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const handleRandomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    // Dicebear Adventure style is cute and colorful
    const newAvatar = `https://api.dicebear.com/7.x/adventurer/png?seed=${seed}`;
    setAvatarUrl(newAvatar);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    if (!role.trim()) {
      Alert.alert("Error", "Role cannot be empty.");
      return;
    }

    try {
      const success = await updateUserProfile(name.trim(), role.trim(), avatarUrl);
      if (success) {
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred.");
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
        {/* Header */}
        <View style={styles.hero}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>USER PROFILE</Text>
            </View>
          </View>

          <Text style={styles.heading}>Edit Profile</Text>
          <Text style={styles.subHeading}>
            Customize your coder identity and randomize your developer avatar.
          </Text>
        </View>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarGlow} />
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          
          <TouchableOpacity
            style={styles.randomBtn}
            onPress={handleRandomizeAvatar}
            activeOpacity={0.8}
          >
            <Shuffle size={16} color="#FFF" />
            <Text style={styles.randomBtnText}>Randomize Avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <User size={16} color="#8B8B95" />
              <Text style={styles.label}>Display Name</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Alex Mercer"
              placeholderTextColor="#5C5C66"
              style={styles.input}
            />
          </View>

          {/* Role Field */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Briefcase size={16} color="#8B8B95" />
              <Text style={styles.label}>Professional Role</Text>
            </View>
            <TextInput
              value={role}
              onChangeText={setRole}
              placeholder="e.g. Frontend Developer"
              placeholderTextColor="#5C5C66"
              style={styles.input}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Save size={18} color="#FFF" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 25,
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

  avatarCard: {
    backgroundColor: "#15151C",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
    overflow: "hidden",
  },

  avatarGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(111,29,58,0.15)",
    top: 20,
  },

  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1C1C24",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },

  randomBtn: {
    backgroundColor: "#1F1F2A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  randomBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },

  formContainer: {
    gap: 22,
  },

  inputGroup: {
    gap: 10,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  label: {
    color: "#CFCFCF",
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#15151D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFF",
    fontSize: 15,
  },

  saveButton: {
    backgroundColor: MERLOT,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 10,
    shadowColor: MERLOT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },

  saveButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
