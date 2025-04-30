import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import {
  getAuth,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "expo-router";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const auth = getAuth();
  const router = useRouter();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [userData, setUserData] = useState({
    name: "",
    dob: "",
    weight: "",
  });

  const [newName, setNewName] = useState("");
  const [newDOB, setNewDOB] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !userId) {
      // Avoid crashing by waiting until routing is ready
      setTimeout(() => {
        router.replace("/auth/login");
      }, 0);
      return;
    }

    if (userId) {
      const fetchUser = async () => {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(
              docSnap.data() as {
                name: string;
                dob: string;
                weight: string;
              }
            );
          }
        } catch (error) {
          console.error("❌ Firestore Fetch Error:", error);
        }
      };

      fetchUser();
    }
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

      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");

      Alert.alert("✅ Success", "Your password has been updated.");
    } catch (error) {
      if (error instanceof Error && "code" in error) {
        console.error("❌ Password Update Error:", error);
        Alert.alert(
          "❌ Error",
          error.code === "auth/wrong-password"
            ? "Incorrect current password."
            : error.message
        );
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Panther Pace Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/panther-pace-logo-clear.png")} // Adjust path if needed
          style={styles.logoImage}
          resizeMode="contain"
        />
        
      </View>

      <View style={styles.container}>
        {!isEditing ? (
          <>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userData.name || "User"}</Text>
            <Text style={styles.profileInfo}>
              🎂 Age: {userData.dob || "--"}
            </Text>
            <Text style={styles.profileInfo}>
              ⚖ Weight: {userData.weight || "--"} lbs
            </Text>

            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.primaryButton}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>⚙️ Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter New Name"
            />
            <TextInput
              style={styles.input}
              value={newDOB}
              onChangeText={setNewDOB}
              placeholder="Enter Date of Birth (YYYY-MM-DD)"
            />
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
            <TouchableOpacity
              onPress={handleChangePassword}
              style={styles.secondaryButton}
            >
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsEditing(false)}
              style={styles.logoutButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  container: {
    marginTop: 60,
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "center",
    zIndex: 10,
  },
  logoImage: {
    width: 80,
    height: 40,
  },
  logoText: {
    fontSize: 12,
    color: "#333",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#6200EE",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#6200EE",
    marginBottom: 5,
  },
  profileInfo: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
    fontSize: 16,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#6200EE",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "#03DAC6",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    width: "100%",
  },
  logoutButton: {
    backgroundColor: "#B00020",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  linkButton: {
    marginVertical: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#6200EE",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
