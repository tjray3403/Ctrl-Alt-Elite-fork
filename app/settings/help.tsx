import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function HelpSettings() {
  const router = useRouter();

  const openSupportEmail = () => {
    Linking.openURL("mailto:support@pantherpace.com?subject=App Support Request");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Help & Support</Text>

      <View style={styles.faqSection}>
        <Text style={styles.subtitle}>FAQs:</Text>
        <Text style={styles.text}>• How do I reset my password?</Text>
        <Text style={styles.text}>• Where can I find my progress history?</Text>
        <Text style={styles.text}>• How do I report a bug?</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={openSupportEmail}>
        <Text style={styles.buttonText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => Linking.openURL("https://pantherpace.com/help")}>
        <Text style={styles.buttonText}>Visit Help Center</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  faqSection: { marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 6 },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
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
