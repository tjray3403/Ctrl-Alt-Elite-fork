import { Tabs, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function TabLayout() {
  const auth = getAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Tabs.Screen name="login" options={{
            tabBarIcon: ({ color }) => (<FontAwesome5 name="sign-in-alt" size={24} color={color} />),
          }} />
          <Tabs.Screen name="signup" options={{
            tabBarIcon: ({ color }) => (<FontAwesome5 name="user-plus" size={24} color={color} />),
          }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="index" options={{
            tabBarIcon: ({ color }) => (<FontAwesome name="home" size={24} color={color} />),
          }} />
          <Tabs.Screen name="map" options={{
            tabBarIcon: ({ color }) => (<FontAwesome5 name="map-marker-alt" size={24} color={color} />),
          }} />
          <Tabs.Screen name="profile" options={{
            tabBarIcon: ({ color }) => (<FontAwesome name="user" size={24} color={color} />),
          }} />
          <Tabs.Screen name="recommendations" options={{
            tabBarIcon: ({ color }) => (<FontAwesome name="smile-o" size={24} color={color} />),
          }} />
        </>
      )}
    </Tabs>
  );
}
