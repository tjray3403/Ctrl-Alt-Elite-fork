import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../config/styles";

import { useRouter, Link } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Homsdee</Text>
      <Text style={styles.profileInfo}>Welcome to the Panther Pace App!</Text>

      <Link style={styles.link} href={"/(tabs)/weather"}>
        <Text>Weather</Text>
      </Link>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}
