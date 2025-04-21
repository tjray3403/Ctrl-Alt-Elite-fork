import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { useRouter } from "expo-router";

export default function AccountSettings() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data() as { name: string; email: string });
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteDoc(doc(db, "users", user.uid));
                await deleteUser(user);
                router.replace("/auth/signup");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete account.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Account Settings</Text>

      {userInfo ? (
        <View style={styles.section}>
          <Text style={styles.label}>Name: {userInfo.name}</Text>
          <Text style={styles.label}>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <Text style={styles.label}>User not found</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.danger]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  danger: { backgroundColor: "#FF3B30" },
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
