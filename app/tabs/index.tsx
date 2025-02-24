import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../config/styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Home</Text>
      <Text style={styles.profileInfo}>Welcome to the Panther Pace App!</Text>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );
}
