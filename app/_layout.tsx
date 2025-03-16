import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="class/list_classes_screen" options={{ title: 'My Classes' }} />
      <Stack.Screen name="class/add_class_screen" options={{ title: 'Add Class' }} />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
    </Stack>
  );
}
