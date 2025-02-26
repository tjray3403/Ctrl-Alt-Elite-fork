import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../config/styles";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Explore</Text>
      <Text style={styles.profileInfo}>Discover new workouts and fitness tips.</Text>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Find New Workouts</Text>
      </TouchableOpacity>
    </View>
  );
}
