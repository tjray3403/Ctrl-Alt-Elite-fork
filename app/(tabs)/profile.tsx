import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const userId = "user_123"; // Replace this with dynamic user authentication
  const [user, setUser] = useState({ name: "", age: "", weight: "" });
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newWeight, setNewWeight] = useState("");

  // Animation Effect
  const glowOpacity = useSharedValue(0.5);
  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.ease }), -1, true);
  }, []);

  const glowingStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // 🔹 Fetch User Data from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data());
        setNewName(docSnap.data().name);
        setNewAge(docSnap.data().age.toString());
        setNewWeight(docSnap.data().weight.toString());
      } else {
        console.log("❌ No such user found!");
      }
    };

    fetchUser();
  }, []);

  // 🔹 Update User Data in Firestore
  const updateUser = async () => {
    const docRef = doc(db, "users", userId);

    try {
      await updateDoc(docRef, {
        name: newName,
        age: parseInt(newAge),
        weight: parseInt(newWeight),
      });

      setUser({ name: newName, age: newAge, weight: newWeight });
      setEditing(false);
      Alert.alert("✅ Profile Updated Successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* Glowing Animated Profile Image */}
        <Animated.View style={[styles.imageContainer, glowingStyle]}>
          <Image source={require("../../assets/images/kopp.jpeg")} style={styles.profileImage} />
        </Animated.View>

        {/* User Info - Editable */}
        {editing ? (
          <>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="Enter Name" />
            <TextInput style={styles.input} value={newAge} onChangeText={setNewAge} keyboardType="numeric" placeholder="Enter Age" />
            <TextInput style={styles.input} value={newWeight} onChangeText={setNewWeight} keyboardType="numeric" placeholder="Enter Weight" />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.name || "Loading..."}</Text>
            <Text style={styles.info}>Age: {user.age || "--"}</Text>
            <Text style={styles.info}>Weight: {user.weight || "--"} lbs</Text>
          </>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {editing ? (
            <TouchableOpacity style={styles.button} onPress={updateUser}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.activityButton]}>
            <Text style={[styles.buttonText, styles.activityText]}>My Activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
    width: "90%",
    borderWidth: 2,
    borderColor: "#ff0000",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#ff0000",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff0000",
    marginTop: 10,
    textShadowColor: "#ff2222",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  info: {
    fontSize: 20,
    color: "#ff6666",
    marginBottom: 5,
  },
  input: {
    fontSize: 18,
    backgroundColor: "#fff",
    padding: 10,
    width: "80%",
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: "#ff0000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  activityButton: {
    backgroundColor: "#990000",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  activityText: {
    color: "#fff",
  },
});
