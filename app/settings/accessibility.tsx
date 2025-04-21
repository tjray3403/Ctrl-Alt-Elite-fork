import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AccessibilitySettings() {
  const router = useRouter();
  const [fontLarge, setFontLarge] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Accessibility</Text>

      <View style={styles.option}>
        <Text style={styles.label}>Large Font Size</Text>
        <Switch value={fontLarge} onValueChange={setFontLarge} />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>High Contrast Mode</Text>
        <Switch value={highContrast} onValueChange={setHighContrast} />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Reduce Motion</Text>
        <Switch value={reduceMotion} onValueChange={setReduceMotion} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16 },
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
