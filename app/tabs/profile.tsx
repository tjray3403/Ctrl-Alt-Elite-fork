import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { getAuth, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useRouter } from "expo-router";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { styles } from "../../config/styles";

export default function ProfileScreen() {
  const auth = getAuth();
  const router = useRouter();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [userData, setUserData] = useState({ name: "" });
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // ✅ For re-authentication
  const [newPassword, setNewPassword] = useState(""); // ✅ New password

  useEffect(() => {
    if (!userId) {
      router.replace("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("❌ Firestore Fetch Error:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async () => {
    if (!userId) return;
    const docRef = doc(db, "users", userId);

    await updateDoc(docRef, { name: newName || userData.name });
    setUserData((prev) => ({ ...prev, name: newName }));
    setNewName("");
    Alert.alert("✅ Profile Updated!");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  // ✅ Function to Update Password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("❌ Error", "Please enter both current and new password.");
      return;
    }

    try {
      // Step 1: Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      console.log("✅ Re-authenticated successfully!");

      // Step 2: Update the password in Firebase Authentication
      await updatePassword(user, newPassword);
      console.log("✅ Password updated successfully!");

      // Clear input fields
      setCurrentPassword("");
      setNewPassword("");

      Alert.alert("✅ Success", "Your password has been updated.");
    } catch (error) {
      console.error("❌ Password Update Error:", error);

      if (error.code === "auth/wrong-password") {
        Alert.alert("❌ Error", "Incorrect current password.");
      } else {
        Alert.alert("❌ Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Name: {userData.name || "Loading..."}</Text>

      {/* Update Name */}
      <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="Enter New Name" />
      <TouchableOpacity onPress={updateUser} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      {/* Update Password */}
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity onPress={handleChangePassword} style={styles.secondaryButton}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
