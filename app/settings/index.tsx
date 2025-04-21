import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/account")}>
        <Text style={styles.itemText}>Account ›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/help")}>
        <Text style={styles.itemText}>Help ›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/about")}>
        <Text style={styles.itemText}>About ›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/accessibility")}>
        <Text style={styles.itemText}>Accessibility ›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 18,
    color: "#007AFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  item: {
    marginBottom: 30,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
