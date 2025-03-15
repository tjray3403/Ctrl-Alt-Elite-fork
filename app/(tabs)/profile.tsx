import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
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

  const [userData, setUserData] = useState({ name: "", dob: "", weight: "" });

  // State for updating info
  const [newName, setNewName] = useState("");
  const [newDOB, setNewDOB] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Toggle for showing the Edit Profile section
  const [isEditing, setIsEditing] = useState(false);

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
          setUserData(docSnap.data() as { name: string; dob: string; weight: string });
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

    try {
      await updateDoc(docRef, {
        name: newName || userData.name,
        dob: newDOB || userData.dob,
        weight: newWeight || userData.weight,
      });

      setUserData({
        name: newName || userData.name,
        dob: newDOB || userData.dob,
        weight: newWeight || userData.weight,
      });

      setNewName("");
      setNewDOB("");
      setNewWeight("");

      Alert.alert("✅ Profile Updated!", "Your information has been saved.");
    } catch (error) {
      if (error instanceof Error && "code" in error) {
      console.error("❌ Firestore Update Error:", error);
      Alert.alert("❌ Update Failed", error.message);
      }
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("❌ Error", "Please enter both current and new password.");
      return;
    }

    try {

      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");

      Alert.alert("✅ Success", "Your password has been updated.");
    } catch (error) {
      if (error instanceof Error && "code" in error) {
      console.error("❌ Password Update Error:", error);
      Alert.alert("❌ Error", error.code === "auth/wrong-password" ? "Incorrect current password." : error.message);
    
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Profile View */}
        {!isEditing ? (
          <>
            <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
            <Text style={styles.profileName}>{userData.name || "User"}</Text>
            <Text style={styles.profileInfo}>🎂 Age: {userData.dob || "--"}</Text>
            <Text style={styles.profileInfo}>⚖ Weight: {userData.weight || "--"} lbs</Text>

            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.primaryButton}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Edit Profile View */}
            <Text style={styles.title}>Edit Profile</Text>

            {/* Update Name */}
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="Enter New Name" />

            {/* Update DOB */}
            <TextInput style={styles.input} value={newDOB} onChangeText={setNewDOB} placeholder="Enter Date of Birth (YYYY-MM-DD)" />

            {/* Update Weight */}
            <TextInput
              style={styles.input}
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder="Enter Weight (lbs)"
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={updateUser} style={styles.primaryButton}>
              <Text style={styles.buttonText}>Save Changes</Text>
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

            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.logoutButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
