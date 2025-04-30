import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

export default function AboutSettings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>About Panther Pace</Text>

      <Text style={styles.text}>
        Panther Pace is a wellness and fitness companion designed for Prairie View A&M University students to stay on top of their health goals.
      </Text>

      <Text style={styles.text}>Version: {Constants.expoConfig?.version || "1.0.0"}</Text>
      <Text style={styles.text}>Developed by Ctrl+Alt+Elite 💻</Text>

      <TouchableOpacity onPress={() => Linking.openURL("https://pantherpace.com/privacy")}>
        <Text style={styles.link}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL("https://pantherpace.com/terms")}>
        <Text style={styles.link}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  text: { fontSize: 16, marginBottom: 10, textAlign: "center" },
  link: { fontSize: 16, color: "#007AFF", textAlign: "center", marginTop: 10 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 18,
    color: "#007AFF",
  },
});
