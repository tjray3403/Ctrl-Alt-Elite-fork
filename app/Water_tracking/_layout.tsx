import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* Point to the actual water.tsx file under /Water */}
      <Stack.Screen name="Water Tracker" />
    </Stack>
  );
}
