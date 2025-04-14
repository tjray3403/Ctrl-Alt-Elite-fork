import React from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";

function CustomHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Water Tracker</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />, // Use the custom header
      }}
    >
      <Stack.Screen name="Water Tracker" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5de9ff",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: 10,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight || 20 : 10, // Add padding for iOS
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
