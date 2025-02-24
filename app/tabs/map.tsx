import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../config/styles";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺 Map</Text>
      <Text style={styles.profileInfo}>Find gyms and running tracks near you.</Text>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>View Nearby Locations</Text>
      </TouchableOpacity>
    </View>
  );
}
