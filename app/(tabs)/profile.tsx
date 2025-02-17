import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from "expo-router";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

WebBrowser.maybeCompleteAuthSession();

export default function Profile() {
  const auth = getAuth();
  const router = useRouter();
  const user = auth.currentUser;
  const userId = user?.uid;
  const [userData, setUserData] = useState({ name: "", age: "", weight: "" });
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newWeight, setNewWeight] = useState("");

  // Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    expoClientId: "YOUR_EXPO_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("✅ Google Sign-In Successful!", response);
      router.replace("/index");
    }
  }, [response]);

  useEffect(() => {
    if (!userId) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setNewName(docSnap.data().name);
        setNewAge(docSnap.data().age.toString());
        setNewWeight(docSnap.data().weight.toString());
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = async () => {
    if (!userId) return;
    const docRef = doc(db, "users", userId);

    try {
      await updateDoc(docRef, {
        name: newName || userData.name,
        age: parseInt(newAge) || userData.age,
        weight: parseInt(newWeight) || userData.weight,
      });

      setUserData({ name: newName, age: newAge, weight: newWeight });
      setEditing(false);
      Alert.alert("✅ Profile Updated Successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("✅ Logged Out", "You have been logged out successfully.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("❌ Error", "Failed to log out. Try again.");
    }
  };

  const handlePasswordReset = async () => {
    if (!auth.currentUser) {
      Alert.alert("❌ Error", "You must be logged in to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      Alert.alert("📩 Check Your Email", "A password reset link has been sent.");
    } catch (error) {
      Alert.alert("❌ Error", "Failed to send reset link.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>{userData.name || "Loading..."}</Text>
      {editing ? (
        <>
          <TextInput value={newName} onChangeText={setNewName} placeholder="Enter Name" />
          <TextInput value={newAge} onChangeText={setNewAge} keyboardType="numeric" placeholder="Enter Age" />
          <TextInput value={newWeight} onChangeText={setNewWeight} keyboardType="numeric" placeholder="Enter Weight" />
        </>
      ) : (
        <>
          <Text>Age: {userData.age || "--"}</Text>
          <Text>Weight: {userData.weight || "--"} lbs</Text>
        </>
      )}

      <TouchableOpacity onPress={updateUser}><Text>Save</Text></TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}><Text>Logout</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => promptAsync()}><Text>Sign in with Google</Text></TouchableOpacity>
      <TouchableOpacity onPress={handlePasswordReset}><Text>Reset Password</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: "center", alignItems: "center" } });
