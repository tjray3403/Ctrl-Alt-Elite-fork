import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase"; // Ensure Firebase is configured
import { useRouter } from "expo-router";

export default function Signup() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        created_at: new Date(),
      });

      Alert.alert("Signup Success", "Account created successfully!");
      router.replace("/tabs"); // Navigate to main app (adjust as needed)
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity onPress={handleSignup}>
        <Text>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
