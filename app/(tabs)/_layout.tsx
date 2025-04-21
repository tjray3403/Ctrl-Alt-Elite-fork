import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFD700", // Gold for active tab
        tabBarInactiveTintColor: "#A67C00", // Dark Gold for inactive
        tabBarStyle: {
          backgroundColor: "#6A0DAD", // Purple background
          borderTopColor: "#FFD700", // Gold border at the top
        },
        headerStyle: {
          backgroundColor: "#6A0DAD", // Purple header
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIconStyle: {
          color: "#FFD700",
          fontSize: 28,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
        tabBarBackground: () => <View style={{ backgroundColor: "#6A0DAD" }} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: "Recommendations",
          tabBarIcon: ({ color }) => (
            <Ionicons name="compass" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={28} color={color} />
          ),
        }}
      />

      {/* Optional hidden tab (if you ever need it) */}
      <Tabs.Screen
        name="weather"
        options={{
          href: null, // ❌ not shown in tab bar
          title: "Weather",
          tabBarIcon: ({ color }) => (
            <Ionicons name="sunny" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
